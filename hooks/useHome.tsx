import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CookiesHelper } from "../classes/CookiesHelper";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import MyUser from "../classes/MyUser";
import { RecordData } from "../components/record/Record";
import logError from "../function/logError";
import notify from "../function/notify";
import useUser from "./useUser";

const useHome = () => {
	const { user } = useUser();
	const [records, setRecords] = useState<RecordData[]>([]);

	const getRecordListener = (id: string) => {
		try {
			const unsub = FireStoreHelper.recordDataListener(id, setRecords);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
	};

	useEffect(() => {
		if (!user) return;
		return getRecordListener(user.id);
		//TODO Add comment data listener for each record! yaru desne
	}, [user]);

	return { user, records };
};

export default useHome;
