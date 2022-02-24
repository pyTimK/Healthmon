import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CookieKeys, CookiesHelper } from "../classes/CookiesHelper";
import logError from "../function/logError";
import notify from "../function/notify";
import { FirebaseData } from "./../pages/_app";
import { UserConfig } from "./../types/userConfig";

const useUserConfig = (data?: FirebaseData) => {
	const [userConfig, setUserConfig] = useState(UserConfig.constructEmpty());
	const router = useRouter();

	const userConfigListener = (data: FirebaseData, id: string) => {
		try {
			const unsub = data.fireStoreHelper.userConfigListener(id, setUserConfig);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not fetch user config online");
		}
		return () => {};
	};

	// TODO: move to serverside
	useEffect(() => {
		if (!data) return;
		const id = CookiesHelper.get<string>(CookieKeys.id, "");
		if (id === "") return;

		return userConfigListener(data, id);
	}, [data]);

	return { userConfig };
};

export default useUserConfig;
