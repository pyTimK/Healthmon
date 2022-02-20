import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CookiesHelper } from "../classes/CookiesHelper";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import MyUser from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";

const useUser = () => {
	const [user, setUser] = useState<MyUser>(new MyUser());
	const router = useRouter();

	const getUserData = async (id: string) => {
		try {
			const fetchedUser = await FireStoreHelper.getUser(id);
			setUser(fetchedUser);
		} catch (_e) {
			logError(_e);
			notify("Could not fetch data online");
		}
	};

	// TODO: move to serverside
	useEffect(() => {
		const id = CookiesHelper.get<string>("id", "");
		if (id.length === 0 && router.pathname !== "/auth") {
			router.replace("/auth");
			return;
		}
		getUserData(id);
	}, []);

	return { user };
};

export default useUser;
