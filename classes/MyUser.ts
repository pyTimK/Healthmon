import { User } from "firebase/auth";
import { FireStoreHelper } from "./FireStoreHelper";

export const enum Role {
	Patient = "Patient",
	HealthWorker = "Health Worker",
}

export interface BaseUser {
	[key: string]: string;
	name: string;
	id: string;
	number: string;
	photoURL: string;
}

export interface RequestedUser extends BaseUser {}
export interface Patient extends BaseUser {}
export interface HealthWorker extends BaseUser {}

export interface Formatted<T> {
	[key: string]: T;
}

export const toFormatted = <T extends BaseUser>(list: T[]) => {
	const formattedList = <Formatted<T>>{};
	for (const el of list) formattedList[el.id] = el;
	return formattedList;
};

export const toUnformatted = <T>(formattedList: Formatted<T>) => Object.values(formattedList);

export interface IMyUser extends BaseUser {
	role: Role;
	device: string;
}

class MyUser {
	public name: string;
	public id: string;
	public number: string;
	public role: Role;
	public device: string;
	public photoURL: string;

	constructor(user?: Partial<IMyUser>) {
		this.name = user?.name ?? "";
		this.id = user?.id ?? "";
		this.number = user?.number ?? "";
		this.role = user?.role ?? Role.Patient;
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

	toPatient = (): Patient => {
		return { id: this.id, name: this.name, number: this.number, photoURL: this.photoURL };
	};

	getUserProps = () => {
		return {
			id: this.id,
			name: this.name,
			number: this.number,
			role: this.role,
			photoURL: this.photoURL,
			device: this.device,
		};
	};

	getPersonalDetails = () => {
		return {
			name: this.name,
			number: this.number,
			role: this.role,
			photoURL: this.photoURL,
		};
	};

	async updatePersonalDetails(newName: string, newNumber: string, newRole: Role) {
		this.name = newName;
		this.number = newNumber;
		this.role = newRole;

		await FireStoreHelper.updatePersonalDetails(this);
	}

	async addRequestedUser(patient: Patient) {
		//TODO FIX IT FILIX
		// this.requestedUsers.push(patient);
		await FireStoreHelper.updateRequestedUsers(this);
	}

	async removeRequestedUser(patient: Patient) {
		//TODO FIX IT FILIX
		// this.requestedUsers = removeRequestedPatient(patient, this);
		await FireStoreHelper.updateRequestedUsers(this);
	}
}

export default MyUser;
