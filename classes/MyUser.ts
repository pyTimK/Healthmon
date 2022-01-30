import { User } from "firebase/auth";
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
	photoURL: string;
}

class MyUser {
	public name: string;
	public id: string;
	public number: string;
	public role: Role;
	public healthWorkers: HealthWorker[];
	public monitoring: Patient[];
	public device: string;
	public photoURL: string;

	constructor(user?: Partial<IMyUser>) {
		this.name = user?.name ?? "";
		this.id = user?.id ?? "";
		this.number = user?.number ?? "";
		this.role = user?.role ?? Role.Patient;
		this.healthWorkers = user?.healthWorkers ?? [];
		this.monitoring = user?.monitoring ?? [];
		this.device = user?.device ?? "";
		this.photoURL = user?.photoURL ?? "";
	}

	static fromFirebaseUser(user: User) {
		console.log(user);
		return new this({
			name: user.displayName?.substring(0, Math.min(15, user.displayName.length)) ?? "",
			id: user.uid,
			number: user.phoneNumber ?? "",
			photoURL: user.photoURL ?? "",
		});
	}

	static fromCookie() {
		return new MyUser(CookiesHelper.get<MyUser | undefined>("user", undefined));
	}

	async updatePersonalDetails(newName: string, newNumber: string, newRole: Role) {
		this.name = newName;
		this.number = newNumber;
		this.role = newRole;

		CookiesHelper.savePersonalDetails(this);
		await FireStoreHelper.updateDevice(this);
		await FireStoreHelper.updateUser(this);
	}
}

export default MyUser;
