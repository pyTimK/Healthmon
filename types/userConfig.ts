import { FireStoreHelper } from "../classes/FireStoreHelper";
import { Role } from "../classes/MyUser";
import { getYYYYMMDD } from "../function/dateConversions";

export interface UserConfigProps {
	id: string;
	role: Role;
	date: string;
}

export class UserConfig implements UserConfigProps {
	constructor(public id: string, public role: Role, public date: string) {}

	static constructEmpty() {
		return new this("", Role.Patient, getYYYYMMDD(new Date()));
	}

	getProps = () => {
		return {
			id: this.id,
			role: this.role,
			date: this.date,
		};
	};

	static fromFirebaseUserConfig(userConfig: UserConfigProps) {
		return new this(userConfig.id, userConfig.role, userConfig.date);
	}

	async updateRole(newRole: Role, fireStoreHelper: FireStoreHelper) {
		if (this.role === newRole) return;
		this.role = newRole;
		await fireStoreHelper.updateUserConfig(this);
	}

	async updateDate(newDate: Date, fireStoreHelper: FireStoreHelper): Promise<void>;
	async updateDate(newDate: string, fireStoreHelper: FireStoreHelper): Promise<void>;
	async updateDate(newDate: Date | string, fireStoreHelper: FireStoreHelper) {
		const newDateStr = typeof newDate === "string" ? newDate : getYYYYMMDD(newDate);
		if (this.date === newDateStr) return;
		this.date = newDateStr;
		await fireStoreHelper.updateUserConfig(this);
	}

	// async updateDate(newDate: string) {
	// 	const newDateStr = getYYYYMMDD(newDate);
	// 	if (this.date === newDateStr) return;
	// 	this.date = newDateStr;
	// 	await FireStoreHelper.updateUserConfig(this);
	// }
}
