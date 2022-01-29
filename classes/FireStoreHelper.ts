import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import DeviceData from "../types/DeviceData";
import MyUser from "./MyUser";

export abstract class FireStoreHelper {
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
		const isPaired = await this._isDevicePaired(user, deviceCode);
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
		const isPaired = await this._isDevicePaired(user);
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

	static updateUser = async (user: MyUser) => {
		const updatedUserDocFields: Partial<MyUser> = {
			name: user.name,
			number: user.number,
			device: user.device,
			healthWorkers: user.healthWorkers,
			role: user.role,
		};
		await updateDoc(doc(db, "users", user.id), { ...updatedUserDocFields });
	};
}
