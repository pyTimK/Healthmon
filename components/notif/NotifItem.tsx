import { Check, Cross } from "akar-icons";
import clsx from "clsx";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import MyUser from "../../classes/MyUser";
import logError from "../../function/logError";
import notify from "../../function/notify";
import { isRecordCommentNotif, MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import Avatar from "../Avatar";
import styles from "./NotifItem.module.css";

interface NotifItemProp {
	notif: MonitorRequestNotif | RecordCommentNotif;
	user: MyUser;
}

const NotifItem: React.FC<NotifItemProp> = ({ notif, user }) => {
	const sender = notif.sender;

	const onDeclineMonitorRequest = async () => {
		try {
			await FireStoreHelper.removeMonitorRequest(user.toPatient(), sender);
		} catch (_e) {
			logError(_e);
			notify("Can't decline request right now");
		}
	};

	const onAcceptMonitorRequest = async () => {
		try {
			await FireStoreHelper.add_patient_healthWorker_relationship(user.toPatient(), sender, user.device);
			await FireStoreHelper.removeMonitorRequest(user.toPatient(), sender);
		} catch (_e) {
			logError(_e);
			notify("Can't accept request right now");
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div className={styles.avatarWrapper}>
					<Avatar letter={sender.name} nonclickable />
				</div>
				<p className={styles.description}>
					<b className={styles.name}>{sender.name}</b>
					{!isRecordCommentNotif(notif) ? ` wants to monitor you` : ` commented on your record`}
				</p>
			</div>
			{!isRecordCommentNotif(notif) && (
				<div className={styles.options}>
					<button
						className={clsx(styles.notifButton, styles.declineButton)}
						onClick={onDeclineMonitorRequest}>
						<Cross size={16} /> Decline
					</button>
					<button className={clsx(styles.notifButton, styles.acceptButton)} onClick={onAcceptMonitorRequest}>
						<Check size={16} /> Accept
					</button>
				</div>
			)}
		</div>
	);
};

export default NotifItem;
