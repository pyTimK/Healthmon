import { UserConfig } from "./../types/userConfig";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CookiesHelper } from "../classes/CookiesHelper";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import logError from "../function/logError";
import notify from "../function/notify";

const useUserConfig = () => {
	const [userConfig, setUserConfig] = useState(UserConfig.constructEmpty());
	const router = useRouter();

	const userConfigListener = (id: string) => {
		try {
			const unsub = FireStoreHelper.userConfigListener(id, setUserConfig);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not fetch user config online");
		}
		return () => {};
	};

	// TODO: move to serverside
	useEffect(() => {
		const id = CookiesHelper.get<string>("id", "");
		if (id.length === 0) {
			router.replace("/auth");
			return;
		}

		return userConfigListener(id);
	}, []);

	return { userConfig };
};

export default useUserConfig;
