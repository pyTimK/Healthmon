import {
	collection,
	deleteDoc,
	deleteField,
	doc,
	FieldValue,
	getDoc,
	onSnapshot,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { RecordData } from "../components/record/Record";
import { Firestore } from "firebase/firestore";
import DeviceData from "../types/DeviceData";
import { NotifSubject } from "../types/Notification";
import { RecordMetaData } from "./../components/record/Record";
import { MonitorRequestNotif, RecordCommentNotif } from "./../types/Notification";
import UserComment, {
	date_time_healthWorkerId,
	date_time_healthWorkerId_from_recordCommentNotif,
	date_time_patientId,
	date_time_patientId_from_recordCommentNotif,
	RecordComment,
} from "./../types/RecordComment";
import { UserConfig, UserConfigProps } from "./../types/userConfig";
import MyUser, {
	BaseUser,
	Formatted,
	HealthWorker,
	IMyUser,
	Patient,
	RequestedUser,
	Role,
	toUnformatted,
} from "./MyUser";
import { getYYYYMMDD } from "../function/dateConversions";

export class FireStoreHelper {
	constructor(private db: Firestore) {}

	//! DEVICE------------------------
	async askPairDevice(deviceId: string, user: MyUser) {
		await updateDoc(doc(this.db, "devices", deviceId), {
			new_id: user.id,
			new_name: user.name,
			confirmed: false,
			request_timestamp: serverTimestamp(),
		} as Partial<DeviceData>);
	}

	async pairDevice(user: MyUser, deviceId: string) {
		const paired_doc: DeviceData = {
			name: user.name,
			id: user.id,
			new_name: "",
			new_id: "",
			confirmed: true,
			request_timestamp: serverTimestamp(),
		};
		const deviceDoc = await getDoc(doc(this.db, "devices", deviceId));
		const deviceData = deviceDoc.data() as DeviceData;
		if (deviceData.id) await updateDoc(doc(this.db, "users", deviceData.id), { device: "" });
		await updateDoc(doc(this.db, "devices", deviceId), { ...paired_doc });
		await updateDoc(doc(this.db, "users", user.id), { device: deviceId });
	}

	private async _isDevicePaired(user: MyUser, deviceId: string = "") {
		if (deviceId === "" && user.device === "") return false;

		const deviceDocRef = doc(this.db, "devices", deviceId !== "" ? deviceId : user.device);
		const deviceDoc = await getDoc(deviceDocRef);

		if (!deviceDoc.exists()) return false;

		const deviceData = deviceDoc.data() as DeviceData;

		if (user.id !== deviceData.id) return false;

		return true;
	}

	async unPairDevice(user: MyUser, deviceId: string) {
		const isPaired = await this._isDevicePaired(user, deviceId);
		if (!isPaired) return;

		const clearedDeviceData: DeviceData = {
			name: "",
			id: "",
			new_name: "",
			new_id: "",
			confirmed: false,
			request_timestamp: serverTimestamp(),
		};
		await updateDoc(doc(this.db, "users", user.id), { device: "" });
		await setDoc(doc(this.db, "devices", deviceId), { ...clearedDeviceData });
	}

	private async _updatePersonalDetailsOnDevice(user: MyUser) {
		const isPaired = await this._isDevicePaired(user);
		if (!isPaired) return;

		const newDeviceDocFields: DeviceData = {
			id: user.id,
			name: user.name,
			new_id: "",
			new_name: "",
			confirmed: false,
			request_timestamp: serverTimestamp(),
		};
		await setDoc(doc(this.db, "devices", user.device), { ...newDeviceDocFields });
	}

	//! RECORD----------------------
	recordDataListener = (
		patientId: string,
		dateStr: string,
		setRecords: Dispatch<SetStateAction<RecordData[]>>,
		setRecordsMetaData: Dispatch<SetStateAction<RecordMetaData[]>>
	) => {
		if (patientId === "" || dateStr === "") return;

		const q = query(collection(this.db, "records", dateStr, patientId));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			console.log("record snap");
			let gotRecords: RecordData[] = [];
			let gotRecordsMetaData: RecordMetaData[] = [];

			querySnapshot.forEach((doc) => {
				const recordData = doc.data() as RecordData;
				gotRecords.push(recordData);
				gotRecordsMetaData.push({ recordTime: doc.id, recordDate: dateStr, patientId: patientId });
			});

			gotRecords.reverse();
			gotRecordsMetaData.reverse();
			setRecords(() => gotRecords);
			setRecordsMetaData(() => gotRecordsMetaData);
		});

		return unsubscribe;
	};

	//! COMMENT------------------------
	private async _updatePersonalDetailsOnComments(user: MyUser, userComments: UserComment[]) {
		for (const comment of userComments) {
			await updateDoc(
				doc(this.db, "records", comment.recordDate, comment.patientId, comment.recordTime, "comments", user.id),
				{ sender: user.toHealthWorker() }
			);
		}
	}

	private async _addRecordComment(commenter: MyUser, comment: string, recordMetaData: RecordMetaData) {
		const newComment: RecordComment = {
			comment: comment,
			sender: commenter.toHealthWorker(),
			timestamp: serverTimestamp(),
		};

		await setDoc(
			doc(
				this.db,
				"records",
				recordMetaData.recordDate,
				recordMetaData.patientId,
				recordMetaData.recordTime,
				"comments",
				commenter.id
			),
			newComment
		);
	}

	private async _addUserComment(commenter: MyUser, recordMetaData: RecordMetaData) {
		//* Update list of comments by the user
		const newUserCommentField = <{ [key: string]: UserComment }>{};
		newUserCommentField[date_time_patientId(recordMetaData)] = {
			recordDate: recordMetaData.recordDate,
			recordTime: recordMetaData.recordTime,
			patientId: recordMetaData.patientId,
			hasNotif: true,
			timestamp: serverTimestamp(),
		};

		await updateDoc(doc(this.db, "users", commenter.id, "comments", "comments"), newUserCommentField);
	}

	async addComment(commenter: MyUser, comment: string, recordMetaData: RecordMetaData) {
		if (commenter.id === "") return;

		this._addUserComment(commenter, recordMetaData);
		this._addRecordComment(commenter, comment, recordMetaData);
		this._sendRecordCommentNotif(commenter, recordMetaData);
	}

	private async _removeRecordComment(commenter: MyUser, userComment: UserComment) {
		await deleteDoc(
			doc(
				this.db,
				"records",
				userComment.recordDate,
				userComment.patientId,
				userComment.recordTime,
				"comments",
				commenter.id
			)
		);
	}

	private async _removeUserComment(commenter: MyUser, userComment: UserComment) {
		//* Update list of comments by the user
		const newUserCommentField = <{ [key: string]: FieldValue }>{};
		newUserCommentField[date_time_patientId(userComment)] = deleteField();

		await updateDoc(doc(this.db, "users", commenter.id, "comments", "comments"), newUserCommentField);
	}

	async removeComment(commenter: MyUser, userComment: UserComment) {
		if (commenter.id === "") return;

		await this._removeUserComment(commenter, userComment);
		await this._removeRecordComment(commenter, userComment);
		if (userComment.hasNotif) await this._removeRecordCommentNotifFromUserComment(commenter, userComment);
	}

	async editComment(commenter: MyUser, comment: string, recordMetaData: RecordMetaData) {
		if (commenter.id === "") return;

		//* Update comment on record
		await updateDoc(
			doc(
				this.db,
				"records",
				recordMetaData.recordDate,
				recordMetaData.patientId,
				recordMetaData.recordTime,
				"comments",
				commenter.id
			),
			{ comment: comment }
		);
	}

	async getUserComments(user: MyUser) {
		const userCommentsDoc = await getDoc(doc(this.db, "users", user.id, "comments", "comments"));
		const userCommentsDocData = userCommentsDoc.data();
		delete userCommentsDocData!.exists;
		const formattedUserComments = userCommentsDocData as Formatted<UserComment>;
		return toUnformatted(formattedUserComments);
	}

	userCommentsListener = (user: MyUser, setRecords: Dispatch<SetStateAction<UserComment[]>>) => {
		const unsubscribe = onSnapshot(doc(this.db, "users", user.id, "comments", "comments"), (userCommentsDoc) => {
			console.log("userComments snap");
			const userCommentsDocData = userCommentsDoc.data();
			delete userCommentsDocData!.exists;
			const formattedUserComments = userCommentsDocData as Formatted<UserComment>;
			const userComments = toUnformatted(formattedUserComments);
			setRecords(() => userComments);
		});

		return unsubscribe;
	};

	commentsListener = (recordMetaData: RecordMetaData, setComments: Dispatch<SetStateAction<RecordComment[]>>) => {
		if (recordMetaData.patientId === "") return;
		const q = query(
			collection(
				this.db,
				"records",
				recordMetaData.recordDate,
				recordMetaData.patientId,
				recordMetaData.recordTime,
				"comments"
			)
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			console.log("comment snap");
			let gotComments: RecordComment[] = [];

			querySnapshot.forEach((doc) => {
				const recordComment = doc.data() as RecordComment;
				gotComments.push(recordComment);
			});

			// gotComments.reverse();
			setComments(() => gotComments);
		});

		return unsubscribe;
	};

	private async _removeHasNotif(user: MyUser, notif: RecordCommentNotif) {
		const hasNotifField = <{ [key: string]: boolean }>{};
		const hasNotifFieldKey = `${date_time_patientId_from_recordCommentNotif(notif, user.id)}.hasNotif`;
		hasNotifField[hasNotifFieldKey] = false;

		await updateDoc(doc(this.db, "users", notif.sender.id, "comments", "comments"), hasNotifField);
	}

	//! USER------------------------
	async setUser(user: MyUser) {
		await setDoc(doc(this.db, "users", user.id), user.getUserProps());

		//* healthWorkers, monitoring, requestedUsers, and comments are all empty at the start
		await setDoc(doc(this.db, "users", user.id, "associates", "healthWorkers"), { exists: true });
		await setDoc(doc(this.db, "users", user.id, "associates", "requestedUsers"), { exists: true });
		await setDoc(doc(this.db, "users", user.id, "associates", "monitoring"), { exists: true });
		await setDoc(doc(this.db, "users", user.id, "comments", "comments"), { exists: true });
	}

	async getUser(id: string) {
		const userDoc = await getDoc(doc(this.db, "users", id));
		const Iuser = userDoc.data() as IMyUser;
		return new MyUser(Iuser);
	}

	private async _getAssociated<T extends BaseUser>(user: MyUser, docName: string): Promise<T[]> {
		const associateDoc = await getDoc(doc(this.db, "users", user.id, "associates", docName));
		const associateDocData = associateDoc.data();
		delete associateDocData!.exists;
		const formattedAssociate = associateDocData as Formatted<T>;
		return toUnformatted(formattedAssociate);
	}

	async getHealthWorkers(user: MyUser) {
		return await this._getAssociated<HealthWorker>(user, "healthWorkers");
	}

	async getPatients(user: MyUser) {
		return await this._getAssociated<Patient>(user, "monitoring");
	}

	async getRequestedUsers(user: MyUser) {
		return await this._getAssociated<RequestedUser>(user, "requestedUsers");
	}

	private _associateListener = <T extends BaseUser>(
		user: MyUser,
		setRecords: Dispatch<SetStateAction<T[]>>,
		docName: string
	) => {
		const unsubscribe = onSnapshot(doc(this.db, "users", user.id, "associates", docName), (associateDoc) => {
			console.log(docName, " snap");
			const associateDocData = associateDoc.data();
			delete associateDocData!.exists;
			const formattedAssociate = associateDocData as Formatted<T>;
			const healthWorkers = toUnformatted(formattedAssociate);
			setRecords(() => healthWorkers);
		});

		return unsubscribe;
	};

	healthWorkersListener = (user: MyUser, setRecords: Dispatch<SetStateAction<HealthWorker[]>>) =>
		this._associateListener(user, setRecords, "healthWorkers");

	patientsListener = (user: MyUser, setRecords: Dispatch<SetStateAction<HealthWorker[]>>) =>
		this._associateListener(user, setRecords, "monitoring");

	requestedUsersListener = (user: MyUser, setRecords: Dispatch<SetStateAction<HealthWorker[]>>) =>
		this._associateListener(user, setRecords, "requestedUsers");

	async updatePersonalDetails(user: MyUser) {
		// TODO Make this a transaction
		//* Updates the original doc containing user info and also all other docs dependent on it
		await updateDoc(doc(this.db, "users", user.id), user.getPersonalDetails());

		await this._updatePersonalDetailsOnDevice(user);
		await this._updatePersonalDetailsOnAssociatedHealthWorkers(user);
		await this._updatePersonalDetailsOnAssociatedMonitoring(user);
		await this._updatePersonalDetailsOnMonitorRequestNotif(user);

		const comments = await this.getUserComments(user);
		await this._updatePersonalDetailsOnRecordCommentNotif(user, comments);
		await this._updatePersonalDetailsOnComments(user, comments);
	}

	private async _updatePersonalDetailsOnAssociatedHealthWorkers(user: MyUser) {
		const healthWorkers = await this.getHealthWorkers(user);
		console.log(healthWorkers);

		for (const healthWorker of healthWorkers) {
			const newField = <{ [key: string]: Patient }>{};
			newField[user.id] = user.toPatient();
			await updateDoc(doc(this.db, "users", healthWorker.id, "associates", "monitoring"), newField);
		}
	}

	private async _updatePersonalDetailsOnAssociatedMonitoring(user: MyUser) {
		const patients = await this.getPatients(user);

		for (const patient of patients) {
			const newField = <{ [key: string]: HealthWorker }>{};
			newField[user.id] = user.toHealthWorker();
			await updateDoc(doc(this.db, "users", patient.id, "associates", "healthWorkers"), newField);
		}
	}

	private async _addMonitorRequestToRequestedUsers(patient: Patient, healthWorker: HealthWorker) {
		const requestField = <{ [key: string]: Patient }>{};
		requestField[patient.id] = patient;
		await updateDoc(doc(this.db, "users", healthWorker.id, "associates", "requestedUsers"), requestField);
	}

	private async _removeMonitorRequestFromRequestedUsers(patient: Patient, healthWorker: HealthWorker) {
		const requestField = <{ [key: string]: FieldValue }>{};
		requestField[patient.id] = deleteField();
		await updateDoc(doc(this.db, "users", healthWorker.id, "associates", "requestedUsers"), requestField);
	}

	//! USERCONFIG ----------------------
	async createUserConfig(id: string) {
		await setDoc(doc(this.db, "config", id), {
			id: id,
			role: Role.Patient,
			date: getYYYYMMDD(new Date()),
		} as UserConfigProps);
	}
	async updateUserConfig(userConfig: UserConfig) {
		await updateDoc(doc(this.db, "config", userConfig.id), userConfig.getProps());
	}

	userConfigListener = (id: string, setUserConfig: Dispatch<SetStateAction<UserConfig>>) => {
		const unsubscribe = onSnapshot(doc(this.db, "config", id), (configDoc) => {
			console.log("userConfig snap");
			const configDocData = configDoc.data() as UserConfig;
			setUserConfig(UserConfig.fromFirebaseUserConfig(configDocData));
		});
		return unsubscribe;
	};

	//! NOTIF - MONITOR REQUEST -----------------------
	private async _addMonitorRequestNotif(patient: Patient, healthWorker: HealthWorker) {
		await setDoc(doc(this.db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id), {
			timestamp: serverTimestamp(),
			sender: healthWorker,
		} as MonitorRequestNotif);
	}

	private async _removeMonitorRequestNotif(patient: Patient, healthWorker: HealthWorker) {
		await deleteDoc(doc(this.db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id));
	}

	async sendMonitorRequestNotif(patient: Patient, healthWorker: HealthWorker) {
		await this._addMonitorRequestNotif(patient, healthWorker);
		await this._addMonitorRequestToRequestedUsers(patient, healthWorker);
	}

	async removeMonitorRequest(patient: Patient, healthWorker: HealthWorker) {
		await this._removeMonitorRequestNotif(patient, healthWorker);
		await this._removeMonitorRequestFromRequestedUsers(patient, healthWorker);
	}

	monitorRequestNotifListener = (
		id: string,
		setMonitorRequestNotifs: Dispatch<SetStateAction<MonitorRequestNotif[]>>
	) => {
		const q = query(collection(this.db, "notifications", id, NotifSubject.MonitorRequest));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			console.log("monitorRequestNotif snap");

			let gotRecords: MonitorRequestNotif[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data() as MonitorRequestNotif;
				gotRecords.push(data);
			});

			setMonitorRequestNotifs(() => gotRecords);
		});

		return unsubscribe;
	};

	private async _updatePersonalDetailsOnMonitorRequestNotif(user: MyUser) {
		const requestedUsers = await this.getRequestedUsers(user);

		for (const reqUser of requestedUsers) {
			await updateDoc(doc(this.db, "notifications", reqUser.id, NotifSubject.MonitorRequest, user.id), {
				sender: user.toHealthWorker(),
			});
		}
	}

	//! NOTIF - RECORD COMMENT -----------------------
	private async _sendRecordCommentNotif(commenter: MyUser, recordMetaData: RecordMetaData) {
		const recordCommentNotif: RecordCommentNotif = {
			sender: commenter.toHealthWorker(),
			recordDate: recordMetaData.recordDate,
			recordTime: recordMetaData.recordTime,
			timestamp: serverTimestamp(),
		};

		await setDoc(
			doc(
				this.db,
				"notifications",
				recordMetaData.patientId,
				NotifSubject.RecordComment,
				date_time_healthWorkerId(recordMetaData, commenter.id)
			),
			recordCommentNotif
		);
	}

	private async _removeRecordCommentNotifFromUserComment(user: MyUser, userComment: UserComment) {
		console.log(date_time_healthWorkerId(userComment, user.id));
		await deleteDoc(
			doc(
				this.db,
				"notifications",
				userComment.patientId,
				NotifSubject.RecordComment,
				date_time_healthWorkerId(userComment, user.id)
			)
		);
	}

	private async _removeRecordCommentNotif(user: MyUser, notif: RecordCommentNotif) {
		await deleteDoc(
			doc(
				this.db,
				"notifications",
				user.id,
				NotifSubject.RecordComment,
				date_time_healthWorkerId_from_recordCommentNotif(notif)
			)
		);
	}

	async removeRecordCommentNotif(user: MyUser, notif: RecordCommentNotif) {
		await this._removeRecordCommentNotif(user, notif);
		await this._removeHasNotif(user, notif);
	}

	recordCommentNotifListener = (
		id: string,
		setRecordCommentNotifs: Dispatch<SetStateAction<RecordCommentNotif[]>>
	) => {
		const q = query(collection(this.db, "notifications", id, NotifSubject.RecordComment));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			console.log("recordCommentNotif snap");

			let gotRecords: RecordCommentNotif[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data() as RecordCommentNotif;
				gotRecords.push(data);
			});

			setRecordCommentNotifs(() => gotRecords);
		});

		return unsubscribe;
	};

	private async _updatePersonalDetailsOnRecordCommentNotif(user: MyUser, comments: UserComment[]) {
		for (const comment of comments) {
			if (!comment.hasNotif) continue;

			const notifUpdate: Partial<RecordCommentNotif> = {
				sender: user.toHealthWorker(),
			};

			await updateDoc(
				doc(
					this.db,
					"notifications",
					comment.patientId,
					NotifSubject.RecordComment,
					date_time_healthWorkerId(comment, user.id)
				),
				notifUpdate
			);
		}
	}

	//! HW - PATIENT PAIRING------------------------

	private async _addHealthWorker(patient: Patient, healthWorker: HealthWorker) {
		const newHealthWorkerField = <{ [key: string]: any }>{};
		newHealthWorkerField[healthWorker.id] = healthWorker;
		await updateDoc(doc(this.db, "users", patient.id, "associates", "healthWorkers"), newHealthWorkerField);
	}

	private async _addPatient(patient: Patient, healthWorker: HealthWorker) {
		const newPatientField = <{ [key: string]: any }>{};
		newPatientField[patient.id] = patient;
		await updateDoc(doc(this.db, "users", healthWorker.id, "associates", "monitoring"), newPatientField);
	}

	async add_patient_healthWorker_relationship(patient: Patient, healthWorker: HealthWorker) {
		await this._addHealthWorker(patient, healthWorker);
		await this._addPatient(patient, healthWorker);
	}

	private async _removeHealthWorker(patient: Patient, healthWorker: HealthWorker) {
		const newHealthWorkerField = <{ [key: string]: FieldValue }>{};
		newHealthWorkerField[healthWorker.id] = deleteField();
		await updateDoc(doc(this.db, "users", patient.id, "associates", "healthWorkers"), newHealthWorkerField);
	}

	private async _removePatient(patient: Patient, healthWorker: HealthWorker) {
		const newPatientField = <{ [key: string]: FieldValue }>{};
		newPatientField[patient.id] = deleteField();
		await updateDoc(doc(this.db, "users", healthWorker.id, "associates", "monitoring"), newPatientField);
	}

	async remove_patient_healthWorker_relationship(patient: Patient, healthWorker: HealthWorker) {
		await this._removeHealthWorker(patient, healthWorker);
		await this._removePatient(patient, healthWorker);
	}
}
