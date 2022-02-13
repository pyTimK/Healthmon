import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import { RecordMetaData } from "../components/record/Record";
import logError from "../function/logError";
import notify from "../function/notify";
import UserComment, { RecordComment } from "./../types/RecordComment";

type useRecordCommentsType = (recordMetaData: RecordMetaData) => { recordComments: RecordComment[] };

const useRecordComments: useRecordCommentsType = (recordMetaData) => {
	const [recordComments, setRecordComments] = useState<RecordComment[]>([]);

	//* Does not require reload on page to get updated data
	const getRecordCommentsListener = () => {
		try {
			const unsub = FireStoreHelper.commentsListener(recordMetaData, setRecordComments);
			if (unsub) return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get comments online");
		}
	};

	useEffect(() => {
		if (recordMetaData.patientId === "") return;
		return getRecordCommentsListener();
	}, [recordMetaData]);

	return { recordComments: recordComments };
};

export default useRecordComments;
