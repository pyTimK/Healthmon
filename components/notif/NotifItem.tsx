import { Check, Cross } from "akar-icons";
import clsx from "clsx";
import Avatar from "../Avatar";
import styles from "./NotifItem.module.css";
const NotifItem: React.FC = () => {
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div className={styles.avatarWrapper}>
					<Avatar letter={"s"} nonclickable />
				</div>
				<p className={styles.description}>Dr. Belen wants to monitor you</p>
			</div>
			<div className={styles.options}>
				<button className={clsx(styles.notifButton, styles.declineButton)}>
					<Cross size={16} /> Decline
				</button>
				<button className={clsx(styles.notifButton, styles.acceptButton)}>
					<Check size={16} /> Accept
				</button>
			</div>
		</div>
	);
};

export default NotifItem;
