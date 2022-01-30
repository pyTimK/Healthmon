import NotifItem from "./NotifItem";
import styles from "./NotifBlock.module.css";
import { SettingsHorizontal } from "akar-icons";

const NotifBlock: React.FC = () => {
	return (
		<div>
			<div className={styles.header}>
				<h3 className={styles.title}>Notifications</h3>
				<div className={styles.configIconWrapper}>
					<SettingsHorizontal size={18} cursor='pointer' />
				</div>
			</div>
			<NotifItem />
			<NotifItem />
			<NotifItem />
		</div>
	);
};

export default NotifBlock;
