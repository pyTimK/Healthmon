import clsx from "clsx";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useContext } from "react";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import MyUser from "../../classes/MyUser";
import { getDayMonthFromYYYYMMDD, getTimeFromHHMMSS } from "../../function/dateConversions";
import logError from "../../function/logError";
import notify from "../../function/notify";
import { HomeContext } from "../../pages/home";
import { isRecordCommentNotif, MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import Avatar from "../Avatar";
import styles from "./NotifItem.module.css";

interface NotifItemProp {
	notif: MonitorRequestNotif | RecordCommentNotif;
	setIsNotifOpen: Dispatch<SetStateAction<boolean>>;
}

const NotifItem: React.FC<NotifItemProp> = ({ notif, setIsNotifOpen }) => {
	const { user, userConfig } = useContext(HomeContext);
	const sender = notif.sender;
	const router = useRouter();

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
			await FireStoreHelper.add_patient_healthWorker_relationship(user.toPatient(), sender);
			await FireStoreHelper.removeMonitorRequest(user.toPatient(), sender);
		} catch (_e) {
			logError(_e);
			notify("Can't accept request right now");
		}
	};

	const deleteCommentNotif = async () => {
		if (!isRecordCommentNotif(notif)) return;
		try {
			await FireStoreHelper.removeRecordCommentNotif(user, notif);
		} catch (_e) {
			logError(_e);
			notify("Can't remove notification right now");
		}
	};

	const viewComment = async () => {
		//TODO: view comment
		if (!isRecordCommentNotif(notif)) return;
		await userConfig.updateDate(notif.recordDate);
		router.replace(`/#${notif.recordTime}`);
		setIsNotifOpen(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div className={styles.avatarWrapper}>
					<Avatar size={45} letter={sender.name} nonclickable photoURL={sender.photoURL} />
				</div>
				<p className={styles.description}>
					<b className={styles.name}>{sender.name}</b>
					{!isRecordCommentNotif(notif) ? (
						` wants to monitor you`
					) : (
						<span>
							{" "}
							commented in your measurement on{" "}
							<span className={styles.gray}>{getDayMonthFromYYYYMMDD(notif.recordDate)}</span> at{" "}
							<span className={styles.gray}>{getTimeFromHHMMSS(notif.recordTime)}</span>
						</span>
					)}
				</p>
			</div>
			{isRecordCommentNotif(notif) ? (
				<div className={styles.options}>
					<button className={clsx(styles.notifButton, styles.discardButton)} onClick={deleteCommentNotif}>
						Discard
					</button>

					<button className={clsx(styles.notifButton, styles.viewButton)} onClick={viewComment}>
						View
					</button>
				</div>
			) : (
				<div className={styles.options}>
					<button
						className={clsx(styles.notifButton, styles.declineButton)}
						onClick={onDeclineMonitorRequest}>
						{/* <Cross size={16} /> */}
						Decline
					</button>
					<button className={clsx(styles.notifButton, styles.acceptButton)} onClick={onAcceptMonitorRequest}>
						{/* <Check size={16} />  */}
						Accept
					</button>
				</div>
			)}
		</div>
	);
};

export default NotifItem;
