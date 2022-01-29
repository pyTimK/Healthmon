import { User } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import DeviceData from "../types/DeviceData";
import HealthWorker from "../types/HealthWorker";
import Patient from "../types/Patient";
import { CookiesHelper } from "./CookiesHelper";
import { FireStoreHelper } from "./FireStoreHelper";

export const enum Role {
	Patient = "Patient",
	HealthWorker = "Health Worker",
}

interface IMyUser {
	name: string;
	id: string;
	number: string;
	role: Role;
	healthWorkers: HealthWorker[];
	monitoring: Patient[];
	device: string;
}

class MyUser {
	public name: string;
	public id: string;
	public number: string;
	public role: Role;
	public healthWorkers: HealthWorker[];
	public monitoring: Patient[];
	public device: string;

	constructor(user?: Partial<IMyUser>) {
		this.name = user?.name ?? "";
		this.id = user?.id ?? "";
		this.number = user?.number ?? "";
		this.role = user?.role ?? Role.Patient;
		this.healthWorkers = user?.healthWorkers ?? [];
		this.monitoring = user?.monitoring ?? [];
		this.device = user?.device ?? "";
	}

	static fromFirebaseUser(user: User) {
		return new this({
			name: user.displayName?.substring(0, Math.min(15, user.displayName.length)) ?? "",
			id: user.uid,
			number: user.phoneNumber ?? "",
		});
	}

	static fromCookie() {
		return new MyUser(CookiesHelper.get<MyUser | undefined>("user", undefined));
	}

	updatePersonalDetails = async (newName: string, newNumber: string, newRole: Role) => {
		this.name = newName;
		this.number = newNumber;
		this.role = newRole;
		CookiesHelper.savePersonalDetails(this);
		FireStoreHelper.updateDevice(this);
		FireStoreHelper.updateUser(this);
	};
}

export default MyUser;
