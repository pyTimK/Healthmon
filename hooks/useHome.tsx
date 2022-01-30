import { collection, onSnapshot, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RecordData } from "../components/record/Record";
import { db } from "../firebase/initFirebase";
import { getYYYYMMDD } from "../function/dateConversions";
import MyUser from "../classes/MyUser";

const useHome = () => {
	const user = MyUser.fromCookie();
	const [records, setRecords] = useState<RecordData[]>([]);
	const router = useRouter();

	const recordDataListener = (id: string) => {
		const dateDoc = getYYYYMMDD(new Date());
		const q = query(collection(db, "records", dateDoc, id));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let gotRecords: RecordData[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data() as RecordData;
				gotRecords.push(data);
			});
			gotRecords.reverse();
			setRecords(() => gotRecords);
		});

		return unsubscribe;
	};

	// TODO: move to serverside
	useEffect(() => {
		if (user.id.length == 0) {
			router.replace("/auth");
			return;
		}
		const unsub = recordDataListener(user.id);
		return () => unsub();
	}, [user]);

	return { user, records };
};

export default useHome;
