import { MonitorRequestNotif } from "./../types/Notification";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { SetStateAction } from "react";
import { RecordData } from "../components/record/Record";
import { db } from "../firebase/initFirebase";
import { getYYYYMMDD } from "../function/dateConversions";
import DeviceData from "../types/DeviceData";
import { NotifSubject } from "../types/Notification";
import MyUser, { IMyUser } from "./MyUser";
import Patient from "../types/Patient";
import HealthWorker from "../types/HealthWorker";
import RequestedUsers from "../types/RequestedUsers";
import RequestedUser from "../types/RequestedUsers";

export abstract class FireStoreHelper {
	//! DEVICE------------------------
	static setUserFirestore = async (user: MyUser) => {
		await setDoc(doc(db, "users", user.id), { ...user });
	};

	static askPairDevice = async (deviceCode: string, user: MyUser) => {
		await updateDoc(doc(db, "devices", deviceCode), {
			new_name: user.name,
			new_id: user.id,
			new_healthWorkers: user.healthWorkers,
			confirmed: false,
			code: 0,
			request_timestamp: serverTimestamp(),
		} as Partial<DeviceData>);
	};

	static pairDevice = async (user: MyUser, deviceCode: string) => {
		const paired_doc: DeviceData = {
			name: user.name,
			id: user.id,
			healthWorkers: user.healthWorkers,
			new_name: "",
			new_id: "",
			new_healthWorkers: [],
			confirmed: true,
			request_timestamp: serverTimestamp(),
		};

		await updateDoc(doc(db, "devices", deviceCode), { ...paired_doc });
	};

	private static _isDevicePaired = async (user: MyUser, deviceCode: string = "") => {
		if (deviceCode === "" && user.device === "") return false;

		const deviceDocRef = doc(db, "devices", deviceCode !== "" ? deviceCode : user.device);
		const deviceDoc = await getDoc(deviceDocRef);

		if (!deviceDoc.exists()) return false;

		const deviceData = deviceDoc.data() as DeviceData;

		if (user.id !== deviceData.id) return false;

		return true;
	};

	static unPairDevice = async (user: MyUser, deviceCode: string) => {
		const isPaired = await FireStoreHelper._isDevicePaired(user, deviceCode);
		if (!isPaired) return;

		const clearedDeviceData: Partial<DeviceData> = {
			name: "",
			id: "",
			healthWorkers: [],
			new_name: "",
			new_id: "",
			new_healthWorkers: [],
			confirmed: false,
		};
		await updateDoc(doc(db, "devices", deviceCode), clearedDeviceData);
	};

	static updateDevice = async (user: MyUser) => {
		const isPaired = await FireStoreHelper._isDevicePaired(user);
		if (!isPaired) return;

		const newDeviceDocFields: DeviceData = {
			name: user.name,
			id: user.id,
			healthWorkers: user.healthWorkers,
			new_name: "",
			new_id: "",
			new_healthWorkers: [],
			confirmed: false,
			request_timestamp: serverTimestamp(),
		};
		await updateDoc(doc(db, "devices", user.device), { ...newDeviceDocFields });
	};

	//! RECORD----------------------
	static recordDataListener = (id: string, setRecords: (value: SetStateAction<RecordData[]>) => void) => {
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

	//! USER------------------------
	static updateUser = async (user: MyUser) => {
		const updatedUserDocFields: IMyUser = {
			id: user.id,
			name: user.name,
			number: user.number,
			device: user.device,
			healthWorkers: user.healthWorkers,
			requestedUsers: user.requestedUsers,
			monitoring: user.monitoring,
			role: user.role,
			photoURL: user.photoURL,
		};
		await updateDoc(doc(db, "users", user.id), { ...updatedUserDocFields });
	};

	static updateRequestedUsers = async (user: MyUser) => {
		await updateDoc(doc(db, "users", user.id), { requestedUsers: user.requestedUsers });
	};

	//! NOTIF------------------------
	static sendMonitorRequestNotif = async (patient: Patient, healthWorker: HealthWorker) => {
		//* Send notification to patient user
		await setDoc(doc(db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id), {
			timestamp: serverTimestamp(),
			sender: healthWorker,
		} as MonitorRequestNotif);
	};

	static removeMonitorRequestNotif = async (patient: Patient, healthWorker: HealthWorker) => {
		await deleteDoc(doc(db, "notifications", patient.id, NotifSubject.MonitorRequest, healthWorker.id));
	};
}
