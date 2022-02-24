import { useEffect, useState } from "react";
import MyUser, { Patient } from "../classes/MyUser";
import logError from "../function/logError";
import notify from "../function/notify";
import { FirebaseData } from "../pages/_app";

type usePatientsType = (user: MyUser, data?: FirebaseData) => { patients: Patient[] };

const usePatients: usePatientsType = (user, data) => {
	const [patients, setPatients] = useState<Patient[]>([]);

	//* Does not require reload on page to get updated data
	const getPatientsListener = (data: FirebaseData) => {
		try {
			const unsub = data.fireStoreHelper.patientsListener(user, setPatients);
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
		if (!data || user.id === "") return;
		console.log("usePatients accessed");
		return getPatientsListener(data);
	}, [user, data]);

	return { patients: patients };
};

export default usePatients;
