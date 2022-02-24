import clsx from "clsx";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import ButtonStatus from "../../enums/ButtonStatus";
import { getDayMonthFromYYYYMMDD, getTimeFromHHMMSS } from "../../function/dateConversions";
import logError from "../../function/logError";
import notify from "../../function/notify";
import { AppContext } from "../../pages/_app";
import { isRecordCommentNotif, MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import MyAvatar from "../Avatar";
import styles from "./NotifItem.module.css";

interface NotifItemProp {
	notif: MonitorRequestNotif | RecordCommentNotif;
	setIsNotifOpen: Dispatch<SetStateAction<boolean>>;
}

const NotifItem: React.FC<NotifItemProp> = ({ notif, setIsNotifOpen }) => {
	const { user, userConfig, fireStoreHelper } = useContext(AppContext);
	const sender = notif.sender;
	const router = useRouter();
	const [acceptDeclineButtonStatus, setAcceptDeclineButtonStatus] = useState<ButtonStatus>(ButtonStatus.Enabled);

	const onDeclineMonitorRequest = async () => {
		if (!fireStoreHelper) return;

		try {
			await fireStoreHelper.removeMonitorRequest(user.toPatient(), sender);
		} catch (_e) {
			logError(_e);
			notify("Can't decline request right now");
		}
	};

	const onAcceptMonitorRequest = async () => {
		if (!fireStoreHelper) return;

		setAcceptDeclineButtonStatus(ButtonStatus.Disabled);
		try {
			await fireStoreHelper.removeMonitorRequest(user.toPatient(), sender);
			await fireStoreHelper.add_patient_healthWorker_relationship(user.toPatient(), sender);
		} catch (_e) {
			logError(_e);
			notify("Can't accept request right now");
		}
		setAcceptDeclineButtonStatus(ButtonStatus.Enabled);
	};

	const deleteCommentNotif = async () => {
		if (!fireStoreHelper) return;

		if (!isRecordCommentNotif(notif)) return;
		try {
			await fireStoreHelper.removeRecordCommentNotif(user, notif);
		} catch (_e) {
			logError(_e);
			notify("Can't remove notification right now");
		}
	};

	const viewComment = async () => {
		if (!fireStoreHelper) return;

		//TODO: view comment
		if (!isRecordCommentNotif(notif)) return;
		await userConfig.updateDate(notif.recordDate, fireStoreHelper);
		router.replace(`/#${notif.recordTime}`);
		setIsNotifOpen(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div className={styles.avatarWrapper}>
					<MyAvatar size={45} letter={sender.name} nonclickable photoURL={sender.photoURL} />
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
						disabled={acceptDeclineButtonStatus === ButtonStatus.Disabled}
						className={clsx(styles.notifButton, styles.declineButton)}
						onClick={onDeclineMonitorRequest}>
						{/* <Cross size={16} /> */}
						Decline
					</button>
					<button
						disabled={acceptDeclineButtonStatus === ButtonStatus.Disabled}
						className={clsx(styles.notifButton, styles.acceptButton)}
						onClick={onAcceptMonitorRequest}>
						{/* <Check size={16} />  */}
						Accept
					</button>
				</div>
			)}
		</div>
	);
};

export default NotifItem;
