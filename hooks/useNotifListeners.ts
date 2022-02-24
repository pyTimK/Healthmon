import { useEffect, useState } from "react";
import MyUser from "../classes/MyUser";
import { MonitorRequestNotif, RecordCommentNotif } from "../types/Notification";
import { FirebaseData } from "./../pages/_app";

const useNotifListeners = (user: MyUser, data?: FirebaseData) => {
	const [monitorRequestNotifs, setMonitorRequestNotifs] = useState<MonitorRequestNotif[]>([]);
	const [recordCommentNotifs, setRecordCommentNotifs] = useState<RecordCommentNotif[]>([]);

	useEffect(() => {
		if (!data || user.id === "") return;
		console.log("useNotifListeners accessed");

		const unsubMonitorRequestNotif = data.fireStoreHelper.monitorRequestNotifListener(
			user.id,
			setMonitorRequestNotifs
		);
		const unsubRecordCommentNotif = data.fireStoreHelper.recordCommentNotifListener(
			user.id,
			setRecordCommentNotifs
		);

		return () => {
			unsubMonitorRequestNotif();
			unsubRecordCommentNotif();
		};
	}, [user, data]);

	return { monitorRequestNotifs, recordCommentNotifs };
};

export default useNotifListeners;
