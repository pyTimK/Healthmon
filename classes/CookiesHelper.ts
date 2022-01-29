import { IncomingMessage } from "http";
import cookies from "js-cookie";
import cookie from "cookie";
import MyUser from "./MyUser";

const allCookies = ["user", "isPatient", "deviceid"];
export abstract class CookiesHelper {
	static get<T>(key: string, fallBackValue: T): T {
		try {
			const item = cookies.get(key);
			return item ? (JSON.parse(item) as T) : fallBackValue;
		} catch (_e) {
			const e = _e as Error;
			console.log(e.message);
			return fallBackValue;
		}
	}

	static parseCookies(req: IncomingMessage | undefined) {
		return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
	}

	static set<T>(key: string, value: T) {
		try {
			cookies.set(key, JSON.stringify(value), {
				expires: 1000,
			});
		} catch (_e) {
			const e = _e as Error;
			console.log(e.message);
		}
	}

	static update<T>(key: string, fields: Partial<T>) {
		const prev = CookiesHelper.get<T>(key, {} as T);
		CookiesHelper.set(key, { ...prev, ...fields });
	}

	static clear() {
		allCookies.forEach((ck) => {
			cookies.remove(ck);
		});
	}

	//! USER
	static savePersonalDetails(user: MyUser) {
		CookiesHelper.update<MyUser>("user", {
			name: user.name,
			number: user.number,
			role: user.role,
		});
	}
}
