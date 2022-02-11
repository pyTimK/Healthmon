import { SettingsHorizontal } from "akar-icons";
import clsx from "clsx";
import { useRouter } from "next/router";
import MyUser from "../../classes/MyUser";
import { MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import Divider from "../Divider";
import Sizedbox from "../Sizedbox";
import styles from "./NotifBlock.module.css";
import NotifItem from "./NotifItem";

interface NotifBlockProps {
	notifs: (MonitorRequestNotif | RecordCommentNotif)[];
	user: MyUser;
}

const NotifBlock: React.FC<NotifBlockProps> = ({ notifs, user }) => {
	const router = useRouter();
	const goToSettings = () => router.push("/settings");

	return (
		<div>
			<div className={styles.header}>
				<h3 className={clsx(styles.title, "unselectable")}>Notifications</h3>
				<div className={styles.configIconWrapper}>
					<SettingsHorizontal size={18} cursor='pointer' onClick={goToSettings} />
				</div>
			</div>
			<Divider />
			{notifs.length === 0 && (
				<div className={clsx(styles.emptyContainer, "unselectable")}>
					<img className={styles.emptySvg} src='/img/void.svg' />
					<p className={styles.emptyText}>It&#39;s quiet out here...</p>
				</div>
			)}
			{notifs.map((notif, _i) => (
				<div>
					<Divider />
					<NotifItem key={_i} notif={notif} user={user} />
					<Sizedbox height={10} />
				</div>
			))}
		</div>
	);
};

export default NotifBlock;
