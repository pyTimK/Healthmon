import { Check, Cross } from "akar-icons";
import clsx from "clsx";
import { isRecordCommentNotif, MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import Avatar from "../Avatar";
import styles from "./NotifItem.module.css";

interface NotifItemProp {
	notif: MonitorRequestNotif | RecordCommentNotif;
}

const NotifItem: React.FC<NotifItemProp> = ({ notif }) => {
	const sender = notif.sender;
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
					<button className={clsx(styles.notifButton, styles.declineButton)}>
						<Cross size={16} /> Decline
					</button>
					<button className={clsx(styles.notifButton, styles.acceptButton)}>
						<Check size={16} /> Accept
					</button>
				</div>
			)}
		</div>
	);
};

export default NotifItem;
