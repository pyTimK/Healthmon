import { User } from "firebase/auth";
import removeRequestedPatient from "../function/removeRequestedPatient";
import HealthWorker from "../types/HealthWorker";
import Patient from "../types/Patient";
import RequestedUsers from "../types/RequestedUsers";
import { CookiesHelper } from "./CookiesHelper";
import { FireStoreHelper } from "./FireStoreHelper";

export const enum Role {
	Patient = "Patient",
	HealthWorker = "Health Worker",
}

export interface IMyUser {
	name: string;
	id: string;
	number: string;
	role: Role;
	healthWorkers: HealthWorker[];
	requestedUsers: RequestedUsers[];
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
	public requestedUsers: RequestedUsers[];
	public monitoring: Patient[];
	public device: string;
	public photoURL: string;

	constructor(user?: Partial<IMyUser>) {
		this.name = user?.name ?? "";
		this.id = user?.id ?? "";
		this.number = user?.number ?? "";
		this.role = user?.role ?? Role.Patient;
		this.healthWorkers = user?.healthWorkers ?? [];
		this.requestedUsers = user?.requestedUsers ?? [];
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

	toHealthWorker = (): HealthWorker => {
		return { id: this.id, name: this.name, number: this.number, photoURL: this.photoURL };
	};

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

	async addRequestedUser(patient: Patient) {
		this.requestedUsers.push(patient);

		CookiesHelper.saveRequestedUsers(this);
		await FireStoreHelper.updateRequestedUsers(this);
	}

	async removeRequestedUser(patient: Patient) {
		this.requestedUsers = removeRequestedPatient(patient, this);

		CookiesHelper.saveRequestedUsers(this);
		await FireStoreHelper.updateRequestedUsers(this);
	}
}

export default MyUser;
