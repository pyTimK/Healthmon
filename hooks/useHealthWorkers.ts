import { useEffect, useState } from "react";
import MyUser, { HealthWorker } from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";
import { FirebaseData } from "./../pages/_app";

type useHealthWorkersType = (user: MyUser, data?: FirebaseData) => { healthWorkers: HealthWorker[] };

const useHealthWorkers: useHealthWorkersType = (user, data) => {
	const [healthWorkers, setHealthWorkers] = useState<HealthWorker[]>([]);

	//* Does not require reload on page to get updated data
	const getHealthWorkersListener = (data: FirebaseData) => {
		try {
			const unsub = data.fireStoreHelper.healthWorkersListener(user, setHealthWorkers);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
		return () => {};
	};

	// TODO: move to serverside
	useEffect(() => {
		if (!data || user.id === "") return;
		console.log("useHealthWorkers accessed");
		return getHealthWorkersListener(data);
	}, [user, data]);

	return { healthWorkers: healthWorkers };
};

export default useHealthWorkers;
