import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import MyUser from "../classes/MyUser";
import { RecordData } from "../components/record/Record";

const useHome = () => {
	const [user, setUser] = useState(MyUser.fromCookie());
	const [records, setRecords] = useState<RecordData[]>([]);
	const router = useRouter();

	// TODO: move to serverside
	useEffect(() => {
		if (user.id.length == 0) {
			router.replace("/auth");
			return;
		}
		const unsub = FireStoreHelper.recordDataListener(user.id, setRecords);
		return () => unsub();
	}, [user]);

	return { user, records };
};

export default useHome;
