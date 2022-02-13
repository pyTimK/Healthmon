import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import logError from "../function/logError";
import notify from "../function/notify";
import UserComment, { RecordComment } from "./../types/RecordComment";

type useRecordCommentsType = (userComment: UserComment) => { recordComments: RecordComment[] };

const useRecordComments: useRecordCommentsType = (userComment) => {
	const [recordComments, setRecordComments] = useState<RecordComment[]>([]);

	//* Does not require reload on page to get updated data
	const getRecordCommentsListener = () => {
		try {
			const unsub = FireStoreHelper.commentsListener(userComment, setRecordComments);
			if (unsub) return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get comments online");
		}
	};

	useEffect(() => {
		if (userComment.patientId === "") return;
		return getRecordCommentsListener();
	}, [userComment]);

	return { recordComments: recordComments };
};

export default useRecordComments;
