import { Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import MyUser, { HealthWorker } from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";

type useHealthWorkersType = (user: MyUser) => { healthWorkers: HealthWorker[] };

const useHealthWorkers: useHealthWorkersType = (user) => {
	const [healthWorkers, setHealthWorkers] = useState<HealthWorker[]>([]);

	//* Does not require reload on page to get updated data
	const getHealthWorkersListener = () => {
		try {
			const unsub = FireStoreHelper.healthWorkersListener(user, setHealthWorkers);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
		return () => {};
	};

	// TODO: move to serverside
	useEffect(() => {
		if (user.id === "") return;
		console.log("useHealthWorkers accessed");
		return getHealthWorkersListener();
	}, []);

	return { healthWorkers: healthWorkers };
};

export default useHealthWorkers;
