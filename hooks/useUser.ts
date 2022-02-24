import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CookieKeys, CookiesHelper } from "../classes/CookiesHelper";
import MyUser from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";
import { FirebaseData } from "../pages/_app";

const useUser = (data?: FirebaseData) => {
	const [user, setUser] = useState<MyUser>(new MyUser());
	const router = useRouter();

	const getUserData = async (data: FirebaseData, id: string) => {
		try {
			const fetchedUser = await data.fireStoreHelper.getUser(id);
			setUser(fetchedUser);
		} catch (_e) {
			logError(_e);
			notify("Could not fetch data online");
		}
	};

	// TODO: move to serverside
	useEffect(() => {
		if (!data) return;
		const id = CookiesHelper.get<string>(CookieKeys.id, "");
		if (id === "") return;

		getUserData(data, id);
	}, [data]);

	return { user };
};

export default useUser;
