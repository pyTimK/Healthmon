import { Unsubscribe } from "firebase/firestore";
import MyUser, { Patient } from "../classes/MyUser";
import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import logError from "../function/logError";
import notify from "../function/notify";

type usePatientsType = (user: MyUser) => { patients: Patient[] };

const usePatients: usePatientsType = (user) => {
	const [patients, setPatients] = useState<Patient[]>([]);

	//* Does not require reload on page to get updated data
	const getPatientsListener = () => {
		try {
			const unsub = FireStoreHelper.patientsListener(user, setPatients);
			return () => {
				unsub();
			};
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
		return () => {};
	};

	// TODO: move to serverside
	useEffect(() => {
		if (user.id === "") return;
		console.log("usePatients accessed");
		return getPatientsListener();
	}, [user]);

	return { patients: patients };
};

export default usePatients;
