import { useEffect, useState } from "react";
import { FireStoreHelper } from "../classes/FireStoreHelper";
import MyUser from "../classes/MyUser";
import { MonitorRequestNotif, RecordCommentNotif } from "../types/Notification";

const useNotifListeners = (user: MyUser) => {
	const [monitorRequestNotifs, setMonitorRequestNotifs] = useState<MonitorRequestNotif[]>([]);
	const [recordCommentNotifs, setRecordCommentNotifs] = useState<RecordCommentNotif[]>([]);

	useEffect(() => {
		if (user.id === "") return;
		console.log("useNotifListeners accessed");

		const unsubMonitorRequestNotif = FireStoreHelper.monitorRequestNotifListener(user.id, setMonitorRequestNotifs);
		const unsubRecordCommentNotif = FireStoreHelper.recordCommentNotifListener(user.id, setRecordCommentNotifs);

		return () => {
			unsubMonitorRequestNotif();
			unsubRecordCommentNotif();
		};
	}, [user]);

	return { monitorRequestNotifs, recordCommentNotifs };
};

export default useNotifListeners;
