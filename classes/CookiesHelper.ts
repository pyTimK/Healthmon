import { IncomingMessage } from "http";
import cookies from "js-cookie";
import cookie from "cookie";

const allCookies = ["isPatient", "deviceid"];
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
        expires: Date.parse("01 Jan 2100 00:00:00 GMT"),
      });
    } catch (_e) {
      const e = _e as Error;
      console.log(e.message);
    }
  }

  static clear() {
    allCookies.forEach((ck) => {
      cookies.remove(ck);
    });
  }
}
