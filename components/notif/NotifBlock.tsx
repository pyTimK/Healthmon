import NotifItem from "./NotifItem";
import styles from "./NotifBlock.module.css";
import { SettingsHorizontal } from "akar-icons";
import { useRouter } from "next/router";

const NotifBlock: React.FC = () => {
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
			<NotifItem />
			<NotifItem />
			<NotifItem />
		</div>
	);
};

export default NotifBlock;
