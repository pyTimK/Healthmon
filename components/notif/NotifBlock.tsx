import NotifItem from "./NotifItem";
import styles from "./NotifBlock.module.css";
import { SettingsHorizontal } from "akar-icons";
import { useRouter } from "next/router";
import { isRecordCommentNotif, MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import MyUser from "../../classes/MyUser";

interface NotifBlockProps {
	notifs: (MonitorRequestNotif | RecordCommentNotif)[];
	user?: MyUser;
}

const NotifBlock: React.FC<NotifBlockProps> = ({ notifs, user }) => {
	const router = useRouter();
	const goToSettings = () => router.push("/settings");

	return (
		<div>
			<div className={styles.header}>
				<h3 className={styles.title}>Notifications</h3>
				<div className={styles.configIconWrapper}>
					<SettingsHorizontal size={18} cursor='pointer' onClick={goToSettings} />
				</div>
			</div>
			{user && notifs.map((notif, _i) => <NotifItem key={_i} notif={notif} user={user} />)}
		</div>
	);
};

export default NotifBlock;
