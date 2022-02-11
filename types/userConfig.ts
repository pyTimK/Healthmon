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
		return new this("", Role.Patient, "2022-02-08");
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

	async updateRole(newRole: Role) {
		if (this.role === newRole) return;
		this.role = newRole;
		await FireStoreHelper.updateUserConfig(this);
	}

	async updateDate(newDate: Date) {
		const newDateStr = getYYYYMMDD(newDate);
		if (this.date === newDateStr) return;
		this.date = newDateStr;
		await FireStoreHelper.updateUserConfig(this);
	}
}
