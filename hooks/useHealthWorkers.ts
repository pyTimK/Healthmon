import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CookiesHelper } from "../classes/CookiesHelper";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import MyUser from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";
import HealthWorker from "../types/HealthWorker";

const useHealthWorkers = (user: MyUser) => {
	const [healthWorkers, setHealthWorkers] = useState<HealthWorker[]>([]);
	const router = useRouter();

	const getHealthWorkersData = async () => {
		try {
			const fetchedHealthWorkers = await FireStoreHelper.getUser(user.id);
			setHealthWorkers(fetchedHealthWorkers);
		} catch (_e) {
			logError(_e);
			notify("Could not fetch data online");
		}
	};

	// TODO: move to serverside
	useEffect(() => {
		getHealthWorkersData();
	}, []);

	return { healthWorkers: healthWorkers };
};

export default useHealthWorkers;
