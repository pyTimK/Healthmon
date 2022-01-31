import { Bell } from "akar-icons";
import { useState } from "react";
import NotifBlock from "./NotifBlock";
import styles from "./useNotif.module.css";

const useNotif = () => {
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const toggleNotif = () => {
		setIsNotifOpen((isNotifOpen) => !isNotifOpen);
	};

	const NotifBell: React.FC = () => (
		<Bell size={24} color='whitesmoke' strokeWidth={1} cursor='pointer' onClick={toggleNotif} />
	);

	const Notif: React.FC = () => (
		<div className={styles.notifDropdown}>
			<NotifBlock />
		</div>
	);

	const Overlay: React.FC = () => <div className={styles.overlay} onClick={toggleNotif} />;

	return { isNotifOpen, NotifBell, Notif, Overlay };
};

export default useNotif;
