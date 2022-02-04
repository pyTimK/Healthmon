import { Bell } from "akar-icons";
import { Unsubscribe } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import MyUser, { HealthWorker, Formatted } from "../../classes/MyUser";
import sortNotifs from "../../function/sortNotifs";
import { MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import NotifBlock from "./NotifBlock";
import styles from "./useNotif.module.css";

const inSenders = (senders: Formatted<HealthWorker>, newSenderId: string) =>
	Object.prototype.hasOwnProperty.call(senders, newSenderId);

const useNotif = (user?: MyUser) => {
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const [monitorRequestNotifs, setMonitorRequestNotifs] = useState<MonitorRequestNotif[]>([]);
	const [recordCommentNotifs, setRecordCommentNotifs] = useState<RecordCommentNotif[]>([]);

	const notifsList: (MonitorRequestNotif | RecordCommentNotif)[] = useMemo(
		() => sortNotifs(monitorRequestNotifs, recordCommentNotifs),
		[monitorRequestNotifs, recordCommentNotifs]
	);

	useEffect(() => {
		if (!user) return;

		const unsubMonitorRequestNotif = FireStoreHelper.monitorRequestNotifListener(user.id, setMonitorRequestNotifs);
		const unsubRecordCommentNotif = FireStoreHelper.recordCommentNotifListener(user.id, setRecordCommentNotifs);

		return () => {
			unsubMonitorRequestNotif();
			unsubRecordCommentNotif();
		};
	}, [user]);

	const toggleNotif = () => {
		setIsNotifOpen((isNotifOpen) => !isNotifOpen);
	};

	const NotifBell: React.FC = () => (
		<Bell size={24} color='whitesmoke' strokeWidth={1} cursor='pointer' onClick={toggleNotif} />
	);

	const Notif: React.FC = () => (
		<div className={styles.notifDropdown}>
			<NotifBlock notifs={notifsList} user={user} />
		</div>
	);

	const Overlay: React.FC = () => <div className={styles.overlay} onClick={toggleNotif} />;

	return { isNotifOpen, NotifBell, Notif, Overlay };
};

export default useNotif;
