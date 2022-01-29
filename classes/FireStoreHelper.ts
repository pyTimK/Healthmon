import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import DeviceData from "../types/DeviceData";
import MyUser from "./MyUser";

export abstract class FireStoreHelper {
	static setUserFirestore = async (user: MyUser) => {
		await setDoc(doc(db, "users", user.id), { ...user });
	};

	static unPairDevice = async (deviceCode: string, uid: string) => {
		const deviceDoc = await getDoc(doc(db, "devices", deviceCode));
		const deviceData = deviceDoc.data() as DeviceData;

		if (uid !== deviceData.id) return;

		const clearedDeviceData = {
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

	static pairDevice = async (user: MyUser, parsedQR: string) => {
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

		await updateDoc(doc(db, "devices", parsedQR), { ...paired_doc });
	};
}
