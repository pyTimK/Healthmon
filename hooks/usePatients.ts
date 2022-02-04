import { Unsubscribe } from "firebase/firestore";
import MyUser, { Patient } from "../classes/MyUser";
import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import logError from "../function/logError";
import notify from "../function/notify";

type usePatientsType = (user?: MyUser) => { patients: Patient[] };

const usePatients: usePatientsType = (user) => {
	if (!user) return { patients: [] };

	const [patients, setPatients] = useState<Patient[]>([]);

	//* Does not require reload on page to get updated data
	const getPatientsListener = () => {
		try {
			const unsub = FireStoreHelper.patientsListener(user, setPatients);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
		return () => {};
	};

	//* Requires reload on page to get updated data
	const getPatientsData = async () => {
		try {
			const fetchedPatients = await FireStoreHelper.getPatients(user);
			setPatients(fetchedPatients);
		} catch (_e) {
			logError(_e);
			notify("Could not fetch data online");
		}
	};

	// TODO: move to serverside
	useEffect(() => {
		//getPatientsData();
		return getPatientsListener();
	}, []);

	return { patients: patients };
};

export default usePatients;