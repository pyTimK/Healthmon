import {
	collection,
	deleteDoc,
	deleteField,
	doc,
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
import { getYYYYMMDD } from "../function/dateConversions";
import DeviceData from "../types/DeviceData";
import HealthWorker from "../types/HealthWorker";
import { NotifSubject } from "../types/Notification";
import Patient from "../types/Patient";
import { formatHealthWorkers } from "./../function/converter";
import { MonitorRequestNotif, RecordCommentNotif } from "./../types/Notification";
import { date_time_healthWorkerId } from "./../types/RecordComment";
import MyUser from "./MyUser";

export abstract class FireStoreHelper {
	//! DEVICE------------------------
	static askPairDevice = async (deviceId: string, user: MyUser) => {
		await updateDoc(doc(db, "devices", deviceId), {
			new_id: user.id,
			new_name: user.name,
			confirmed: false,
			request_timestamp: serverTimestamp(),
			new_healthWorkers: user.healthWorkers,
		} as Partial<DeviceData>);

		await setDoc(
			doc(db, "devices", deviceId, "associates", "newHealthWorkers"),
			formatHealthWorkers(user.healthWorkers)
		);
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

		await updateDoc(doc(db, "devices", deviceId), { ...paired_doc });
		await setDoc(
			doc(db, "devices", deviceId, "associates", "healthWorkers"),
			formatHealthWorkers(user.healthWorkers)
		);
		//* No need to delete right
		// await deleteDoc(doc(db, "devices", deviceId, "associates", "newHealthWorkers"));
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
		await updateDoc(doc(db, "devices", deviceId), { ...clearedDeviceData });
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
		await updateDoc(doc(db, "devices", user.device), { ...newDeviceDocFields });
	};

	//! RECORD----------------------
	static recordDataListener = (id: string, setRecords: Dispatch<SetStateAction<RecordData[]>>) => {
		const dateDoc = getYYYYMMDD(new Date());
		const q = query(collection(db, "records", dateDoc, id));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			console.log("snap");
			let gotRecords: RecordData[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data() as RecordData;
				gotRecords.push(data);
			});
			gotRecords.reverse();
			setRecords(() => gotRecords);
		});

		return unsubscribe;
	};

	//! COMMENT------------------------
	private static _updatePersonalDetailsOnComments = async (user: MyUser) => {
		for (const comment of user.comments) {
			await updateDoc(
				doc(db, "records", comment.recordDate, comment.patientID, comment.recordTime, "comments", user.id),
				user.toHealthWorker()
			);
		}
	};

	//! USER------------------------
	static setUser = async (user: MyUser) => {
		await setDoc(doc(db, "users", user.id), user.getDocProps());

		//* healthWorkers, monitoring, requestedUsers, and comments are all empty at the start
		await setDoc(doc(db, "users", user.id, "associates", "healthWorkers"), { exists: true });
		await setDoc(doc(db, "users", user.id, "associates", "requuestedUsers"), { exists: true });
		await setDoc(doc(db, "users", user.id, "associates", "monitoring"), { exists: true });
		await setDoc(doc(db, "users", user.id, "associates", "comments"), { exists: true });
	};

	static updatePersonalDetails = async (user: MyUser) => {
		//* Updates the original doc containing user info and also all other docs dependent on it
		await updateDoc(doc(db, "users", user.id), user.getPersonalDetails());

		await FireStoreHelper._updatePersonalDetailsOnDevice(user);
		await FireStoreHelper._updatePersonalDetailsOnAssociatedHealthWorkers(user);
		await FireStoreHelper._updatePersonalDetailsOnAssociatedMonitoring(user);
		await FireStoreHelper._updatePersonalDetailsOnMonitorRequestNotif(user);
		await FireStoreHelper._updatePersonalDetailsOnRecordCommentNotif(user);
		await FireStoreHelper._updatePersonalDetailsOnComments(user);
	};

	static updateRequestedUsers = async (user: MyUser) => {
		//TODO FIX IT FILIX
		await updateDoc(doc(db, "users", user.id), { requestedUsers: user.requestedUsers });
	};

	private static _updatePersonalDetailsOnAssociatedHealthWorkers = async (user: MyUser) => {
		for (const healthWorker of user.healthWorkers) {
			const newField = <{ [key: string]: Patient }>{};
			newField[user.id] = user.toPatient();
			await updateDoc(doc(db, "users", healthWorker.id, "associates", "monitoring"), newField);
		}
	};

	private static _updatePersonalDetailsOnAssociatedMonitoring = async (user: MyUser) => {
		for (const patient of user.monitoring) {
			const newField = <{ [key: string]: Patient }>{};
			newField[user.id] = user.toHealthWorker();
			await updateDoc(doc(db, "users", patient.id, "associates", "healthWorkers"), newField);
		}
	};

	//! NOTIF------------------------
	static sendMonitorRequestNotif = async (patient: Patient, healthWorker: HealthWorker) => {
		//* Send notification to patient user
		await setDoc(doc(db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id), {
			timestamp: serverTimestamp(),
			sender: healthWorker,
		} as MonitorRequestNotif);
	};

	private static _removeMonitorRequestNotif = async (patient: Patient, healthWorker: HealthWorker) => {
		await deleteDoc(doc(db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id));
	};

	private static _removeMonitorRequestFromRequestedUsers = async (patient: Patient, healthWorker: HealthWorker) => {
		const requestField = <{ [key: string]: any }>{};
		requestField[patient.id] = deleteField();
		await updateDoc(doc(db, "users", healthWorker.id, "associates", "requestedUsers"), requestField);
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

	static _addHealthWorker = async (patient: Patient, healthWorker: HealthWorker) => {
		const newHealthWorkerField = <{ [key: string]: any }>{};
		newHealthWorkerField[healthWorker.id] = healthWorker;
		await updateDoc(doc(db, "users", patient.id, "associates", "healthWorkers"), newHealthWorkerField);
	};

	static _addPatient = async (patient: Patient, healthWorker: HealthWorker) => {
		const newPatientField = <{ [key: string]: any }>{};
		newPatientField[patient.id] = patient;
		await updateDoc(doc(db, "users", healthWorker.id, "associates", "monitoring"), newPatientField);
	};

	static add_patient_healthWorker_relationship = async (patient: Patient, healthWorker: HealthWorker) => {
		await FireStoreHelper._addHealthWorker(patient, healthWorker);
		await FireStoreHelper._addPatient(patient, healthWorker);
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
		for (const reqUser of user.requestedUsers) {
			await updateDoc(doc(db, "notifications", reqUser.id, NotifSubject.MonitorRequest, user.id), {
				sender: user.toHealthWorker(),
			});
		}
	};

	private static _updatePersonalDetailsOnRecordCommentNotif = async (user: MyUser) => {
		for (const comment of user.comments) {
			if (!comment.hasNotif) continue;

			const notifUpdate: Partial<RecordCommentNotif> = {
				sender: user.toHealthWorker(),
			};

			await updateDoc(
				doc(
					db,
					"notifications",
					comment.patientID,
					NotifSubject.RecordComment,
					date_time_healthWorkerId(comment, user.id)
				),
				notifUpdate
			);
		}
	};
}
