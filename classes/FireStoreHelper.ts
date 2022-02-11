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
import { db } from "../firebase/initFirebase";
import DeviceData from "../types/DeviceData";
import { NotifSubject } from "../types/Notification";
import { RecordMetaData } from "./../components/record/Record";
import { MonitorRequestNotif, RecordCommentNotif } from "./../types/Notification";
import UserComment, { date_time_healthWorkerId, date_time_patientId, RecordComment } from "./../types/RecordComment";
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

export abstract class FireStoreHelper {
	//! DEVICE------------------------
	static askPairDevice = async (deviceId: string, user: MyUser) => {
		await updateDoc(doc(db, "devices", deviceId), {
			new_id: user.id,
			new_name: user.name,
			confirmed: false,
			request_timestamp: serverTimestamp(),
		} as Partial<DeviceData>);
	};

	static pairDevice = async (user: MyUser, deviceId: string) => {
		const paired_doc: DeviceData = {
			name: user.name,
			id: user.id,
			new_name: "",
			new_id: "",
			confirmed: true,
			request_timestamp: serverTimestamp(),
		};
		const deviceDoc = await getDoc(doc(db, "devices", deviceId));
		const deviceData = deviceDoc.data() as DeviceData;
		if (deviceData.id) await updateDoc(doc(db, "users", deviceData.id), { device: "" });
		await updateDoc(doc(db, "devices", deviceId), { ...paired_doc });
		await updateDoc(doc(db, "users", user.id), { device: deviceId });
	};

	private static _isDevicePaired = async (user: MyUser, deviceId: string = "") => {
		if (deviceId === "" && user.device === "") return false;

		const deviceDocRef = doc(db, "devices", deviceId !== "" ? deviceId : user.device);
		const deviceDoc = await getDoc(deviceDocRef);

		if (!deviceDoc.exists()) return false;

		const deviceData = deviceDoc.data() as DeviceData;

		if (user.id !== deviceData.id) return false;

		return true;
	};

	static unPairDevice = async (user: MyUser, deviceId: string) => {
		const isPaired = await FireStoreHelper._isDevicePaired(user, deviceId);
		if (!isPaired) return;

		const clearedDeviceData: DeviceData = {
			name: "",
			id: "",
			new_name: "",
			new_id: "",
			confirmed: false,
			request_timestamp: serverTimestamp(),
		};
		await updateDoc(doc(db, "users", user.id), { device: "" });
		await setDoc(doc(db, "devices", deviceId), { ...clearedDeviceData });
	};

	private static _updatePersonalDetailsOnDevice = async (user: MyUser) => {
		const isPaired = await FireStoreHelper._isDevicePaired(user);
		if (!isPaired) return;

		const newDeviceDocFields: DeviceData = {
			id: user.id,
			name: user.name,
			new_id: "",
			new_name: "",
			confirmed: false,
			request_timestamp: serverTimestamp(),
		};
		await setDoc(doc(db, "devices", user.device), { ...newDeviceDocFields });
	};

	//! RECORD----------------------
	static recordDataListener = (
		patientId: string,
		dateStr: string,
		setRecords: Dispatch<SetStateAction<RecordData[]>>,
		setRecordsMetaData: Dispatch<SetStateAction<RecordMetaData[]>>
	) => {
		if (patientId === "" || dateStr === "") return;

		const q = query(collection(db, "records", dateStr, patientId));

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
			setRecords(() => gotRecords);
			setRecordsMetaData(() => gotRecordsMetaData);
		});

		return unsubscribe;
	};

	//! COMMENT------------------------
	private static _updatePersonalDetailsOnComments = async (user: MyUser, userComments: UserComment[]) => {
		for (const comment of userComments) {
			await updateDoc(
				doc(db, "records", comment.recordDate, comment.patientId, comment.recordTime, "comments", user.id),
				{ sender: user.toHealthWorker() }
			);
		}
	};

	static addComment = async (commenter: MyUser, comment: string, userComment: UserComment) => {
		if (commenter.id === "") return;

		//* Update list of comments by the user
		const newUserCommentField = <{ [key: string]: UserComment }>{};
		newUserCommentField[date_time_patientId(userComment)] = userComment;

		await updateDoc(doc(db, "users", commenter.id, "comments", "comments"), newUserCommentField);

		//* Add comment on record
		const newComment: RecordComment = {
			comment: comment,
			sender: commenter.toHealthWorker(),
			timestamp: serverTimestamp(),
		};

		await setDoc(
			doc(
				db,
				"records",
				userComment.recordDate,
				userComment.patientId,
				userComment.recordTime,
				"comments",
				commenter.id
			),
			newComment
		);

		//* Send comment notif to patient
		const recordCommentNotif: RecordCommentNotif = {
			sender: commenter.toHealthWorker(),
			recordDate: userComment.recordDate,
			recordTime: userComment.recordTime,
			timestamp: serverTimestamp(),
		};

		await setDoc(
			doc(
				db,
				"notifications",
				userComment.patientId,
				NotifSubject.RecordComment,
				date_time_healthWorkerId(userComment, commenter.id)
			),
			recordCommentNotif
		);

		//TODO {not here} see two white unimplemented in recordcommentnotif
	};

	static commentsListener = (userComment: UserComment, setComments: Dispatch<SetStateAction<RecordComment[]>>) => {
		if (userComment.patientId === "") return;
		const q = query(
			collection(db, "records", userComment.recordDate, userComment.patientId, userComment.recordTime, "comments")
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			console.log("comment snap");
			let gotComments: RecordComment[] = [];

			querySnapshot.forEach((doc) => {
				const recordComment = doc.data() as RecordComment;
				gotComments.push(recordComment);
			});

			gotComments.reverse();
			setComments(() => gotComments);
		});

		return unsubscribe;
	};

	//! USER------------------------
	static setUser = async (user: MyUser) => {
		await setDoc(doc(db, "users", user.id), user.getUserProps());

		//* healthWorkers, monitoring, requestedUsers, and comments are all empty at the start
		await setDoc(doc(db, "users", user.id, "associates", "healthWorkers"), { exists: true });
		await setDoc(doc(db, "users", user.id, "associates", "requestedUsers"), { exists: true });
		await setDoc(doc(db, "users", user.id, "associates", "monitoring"), { exists: true });
		await setDoc(doc(db, "users", user.id, "comments", "comments"), { exists: true });
	};

	static getUser = async (id: string) => {
		const userDoc = await getDoc(doc(db, "users", id));
		const Iuser = userDoc.data() as IMyUser;
		return new MyUser(Iuser);
	};

	private static _getAssociated = async <T extends BaseUser>(user: MyUser, docName: string): Promise<T[]> => {
		const associateDoc = await getDoc(doc(db, "users", user.id, "associates", docName));
		const associateDocData = associateDoc.data();
		delete associateDocData!.exists;
		const formattedAssociate = associateDocData as Formatted<T>;
		return toUnformatted(formattedAssociate);
	};

	static getHealthWorkers = async (user: MyUser) =>
		await FireStoreHelper._getAssociated<HealthWorker>(user, "healthWorkers");

	static getPatients = async (user: MyUser) => await FireStoreHelper._getAssociated<Patient>(user, "monitoring");

	static getRequestedUsers = async (user: MyUser) =>
		await FireStoreHelper._getAssociated<RequestedUser>(user, "requestedUsers");

	static getComments = async (user: MyUser) => {
		const commentsDoc = await getDoc(doc(db, "users", user.id, "comments", "comments"));
		const commentsDocData = commentsDoc.data();
		delete commentsDocData!.exists;
		const formattedComments = commentsDocData as Formatted<UserComment>;
		const comments = toUnformatted(formattedComments);
		return comments;
	};

	private static _associateListener = <T extends BaseUser>(
		user: MyUser,
		setRecords: Dispatch<SetStateAction<T[]>>,
		docName: string
	) => {
		const unsubscribe = onSnapshot(doc(db, "users", user.id, "associates", docName), (associateDoc) => {
			console.log(docName, " snap");
			const associateDocData = associateDoc.data();
			delete associateDocData!.exists;
			const formattedAssociate = associateDocData as Formatted<T>;
			const healthWorkers = toUnformatted(formattedAssociate);
			setRecords(() => healthWorkers);
		});

		return unsubscribe;
	};

	static healthWorkersListener = (user: MyUser, setRecords: Dispatch<SetStateAction<HealthWorker[]>>) =>
		FireStoreHelper._associateListener(user, setRecords, "healthWorkers");

	static patientsListener = (user: MyUser, setRecords: Dispatch<SetStateAction<HealthWorker[]>>) =>
		FireStoreHelper._associateListener(user, setRecords, "monitoring");

	static requestedUsersListener = (user: MyUser, setRecords: Dispatch<SetStateAction<HealthWorker[]>>) =>
		FireStoreHelper._associateListener(user, setRecords, "requestedUsers");

	static updatePersonalDetails = async (user: MyUser) => {
		// TODO Make this a transaction
		//* Updates the original doc containing user info and also all other docs dependent on it
		await updateDoc(doc(db, "users", user.id), user.getPersonalDetails());

		await FireStoreHelper._updatePersonalDetailsOnDevice(user);
		await FireStoreHelper._updatePersonalDetailsOnAssociatedHealthWorkers(user);
		await FireStoreHelper._updatePersonalDetailsOnAssociatedMonitoring(user);
		await FireStoreHelper._updatePersonalDetailsOnMonitorRequestNotif(user);

		const comments = await FireStoreHelper.getComments(user);
		await FireStoreHelper._updatePersonalDetailsOnRecordCommentNotif(user, comments);
		await FireStoreHelper._updatePersonalDetailsOnComments(user, comments);
	};

	private static _updatePersonalDetailsOnAssociatedHealthWorkers = async (user: MyUser) => {
		const healthWorkers = await FireStoreHelper.getHealthWorkers(user);
		console.log(healthWorkers);

		for (const healthWorker of healthWorkers) {
			const newField = <{ [key: string]: Patient }>{};
			newField[user.id] = user.toPatient();
			await updateDoc(doc(db, "users", healthWorker.id, "associates", "monitoring"), newField);
		}
	};

	private static _updatePersonalDetailsOnAssociatedMonitoring = async (user: MyUser) => {
		const patients = await FireStoreHelper.getPatients(user);

		for (const patient of patients) {
			const newField = <{ [key: string]: HealthWorker }>{};
			newField[user.id] = user.toHealthWorker();
			await updateDoc(doc(db, "users", patient.id, "associates", "healthWorkers"), newField);
		}
	};

	private static _addMonitorRequestToRequestedUsers = async (patient: Patient, healthWorker: HealthWorker) => {
		const requestField = <{ [key: string]: Patient }>{};
		requestField[patient.id] = patient;
		await updateDoc(doc(db, "users", healthWorker.id, "associates", "requestedUsers"), requestField);
	};

	private static _removeMonitorRequestFromRequestedUsers = async (patient: Patient, healthWorker: HealthWorker) => {
		const requestField = <{ [key: string]: FieldValue }>{};
		requestField[patient.id] = deleteField();
		await updateDoc(doc(db, "users", healthWorker.id, "associates", "requestedUsers"), requestField);
	};

	//! USERCONFIG ----------------------
	static createUserConfig = async (id: string) => {
		await setDoc(doc(db, "config", id), { id: id, role: Role.Patient, date: "2022-02-06" } as UserConfigProps);
	};
	static updateUserConfig = async (userConfig: UserConfig) => {
		await updateDoc(doc(db, "config", userConfig.id), userConfig.getProps());
	};

	static userConfigListener = (id: string, setUserConfig: Dispatch<SetStateAction<UserConfig>>) => {
		const unsubscribe = onSnapshot(doc(db, "config", id), (configDoc) => {
			console.log("userConfig snap");
			const configDocData = configDoc.data() as UserConfig;
			setUserConfig(UserConfig.fromFirebaseUserConfig(configDocData));
		});
		return unsubscribe;
	};

	//! NOTIF------------------------
	private static _addMonitorRequestNotif = async (patient: Patient, healthWorker: HealthWorker) => {
		await setDoc(doc(db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id), {
			timestamp: serverTimestamp(),
			sender: healthWorker,
		} as MonitorRequestNotif);
	};

	private static _removeMonitorRequestNotif = async (patient: Patient, healthWorker: HealthWorker) => {
		await deleteDoc(doc(db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id));
	};

	static sendMonitorRequestNotif = async (patient: Patient, healthWorker: HealthWorker) => {
		await FireStoreHelper._addMonitorRequestNotif(patient, healthWorker);
		await FireStoreHelper._addMonitorRequestToRequestedUsers(patient, healthWorker);
	};

	static removeMonitorRequest = async (patient: Patient, healthWorker: HealthWorker) => {
		await FireStoreHelper._removeMonitorRequestNotif(patient, healthWorker);
		await FireStoreHelper._removeMonitorRequestFromRequestedUsers(patient, healthWorker);
	};

	static monitorRequestNotifListener = (
		id: string,
		setMonitorRequestNotifs: Dispatch<SetStateAction<MonitorRequestNotif[]>>
	) => {
		const q = query(collection(db, "notifications", id, NotifSubject.MonitorRequest));

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

	static recordCommentNotifListener = (
		id: string,
		setRecordCommentNotifs: Dispatch<SetStateAction<RecordCommentNotif[]>>
	) => {
		const q = query(collection(db, "notifications", id, NotifSubject.RecordComment));

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

	private static _updatePersonalDetailsOnMonitorRequestNotif = async (user: MyUser) => {
		const requestedUsers = await FireStoreHelper.getRequestedUsers(user);

		for (const reqUser of requestedUsers) {
			await updateDoc(doc(db, "notifications", reqUser.id, NotifSubject.MonitorRequest, user.id), {
				sender: user.toHealthWorker(),
			});
		}
	};

	private static _updatePersonalDetailsOnRecordCommentNotif = async (user: MyUser, comments: UserComment[]) => {
		for (const comment of comments) {
			if (!comment.hasNotif) continue;

			const notifUpdate: Partial<RecordCommentNotif> = {
				sender: user.toHealthWorker(),
			};

			await updateDoc(
				doc(
					db,
					"notifications",
					comment.patientId,
					NotifSubject.RecordComment,
					date_time_healthWorkerId(comment, user.id)
				),
				notifUpdate
			);
		}
	};

	//! HW - PATIENT PAIRING------------------------

	private static _addHealthWorker = async (patient: Patient, healthWorker: HealthWorker) => {
		const newHealthWorkerField = <{ [key: string]: any }>{};
		newHealthWorkerField[healthWorker.id] = healthWorker;
		await updateDoc(doc(db, "users", patient.id, "associates", "healthWorkers"), newHealthWorkerField);
	};

	private static _addPatient = async (patient: Patient, healthWorker: HealthWorker) => {
		const newPatientField = <{ [key: string]: any }>{};
		newPatientField[patient.id] = patient;
		await updateDoc(doc(db, "users", healthWorker.id, "associates", "monitoring"), newPatientField);
	};

	static add_patient_healthWorker_relationship = async (patient: Patient, healthWorker: HealthWorker) => {
		await FireStoreHelper._addHealthWorker(patient, healthWorker);
		await FireStoreHelper._addPatient(patient, healthWorker);
	};

	private static _removeHealthWorker = async (patient: Patient, healthWorker: HealthWorker) => {
		const newHealthWorkerField = <{ [key: string]: FieldValue }>{};
		newHealthWorkerField[healthWorker.id] = deleteField();
		await updateDoc(doc(db, "users", patient.id, "associates", "healthWorkers"), newHealthWorkerField);
	};

	private static _removePatient = async (patient: Patient, healthWorker: HealthWorker) => {
		const newPatientField = <{ [key: string]: FieldValue }>{};
		newPatientField[patient.id] = deleteField();
		await updateDoc(doc(db, "users", healthWorker.id, "associates", "monitoring"), newPatientField);
	};

	static remove_patient_healthWorker_relationship = async (patient: Patient, healthWorker: HealthWorker) => {
		await FireStoreHelper._removeHealthWorker(patient, healthWorker);
		await FireStoreHelper._removePatient(patient, healthWorker);
	};
}
