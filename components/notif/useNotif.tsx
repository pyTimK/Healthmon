import { Bell } from "akar-icons";
import { AnimateSharedLayout, motion } from "framer-motion";
import React, {
	Dispatch,
	memo,
	MouseEventHandler,
	SetStateAction,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import sortNotifs from "../../function/sortNotifs";
import { AppContext } from "../../pages/_app";
import { MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import NotifBlock from "./NotifBlock";
import styles from "./useNotif.module.css";

const useNotif = () => {
	const { user, userConfig, monitorRequestNotifs, recordCommentNotifs } = useContext(AppContext);
	const [isNotifOpen, setIsNotifOpen] = useState(false);

	const notifsList: (MonitorRequestNotif | RecordCommentNotif)[] = useMemo(
		() => sortNotifs(monitorRequestNotifs, recordCommentNotifs),
		[monitorRequestNotifs, recordCommentNotifs]
	);

	const toggleNotif: MouseEventHandler = (e) => {
		e.preventDefault();
		setIsNotifOpen((isNotifOpen) => !isNotifOpen);
	};

	const NotifBell: React.FC = () => {
		const size = "var(--bell-size)";
		return (
			<div className={styles.bellWrapper}>
				{notifsList.length > 0 && <div className={styles.redDot} />}
				<Bell
					style={{ width: size, height: size }}
					color='whitesmoke'
					strokeWidth={1}
					cursor='pointer'
					onClick={toggleNotif}
				/>
			</div>
		);
	};

	const Overlay: React.FC = () => <div className={styles.overlay} onClick={toggleNotif} />;

	return { user, userConfig, isNotifOpen, NotifBell, Overlay, notifsList, setIsNotifOpen };
};

export default useNotif;

interface NotifProps {
	notifsList: (MonitorRequestNotif | RecordCommentNotif)[];
	setIsNotifOpen: Dispatch<SetStateAction<boolean>>;
}

export const Notif: React.FC<NotifProps> = ({ notifsList, setIsNotifOpen }) => {
	const [justOpened, setJustOpened] = useState(true);
	useEffect(() => {
		setJustOpened(false);
		// setTimeout(() => setJustOpened(false), 800);
	}, []);
	return (
		<AnimateSharedLayout>
			<motion.div
				// layout
				animate={{ height: "fit-content" }}
				initial={{ height: 0 }}
				exit={{ height: 0, transition: { duration: 0.2 } }}
				// transition={{ duration: 5 }}
				className={styles.notifDropdown}>
				<NotifBlock notifs={notifsList} setIsNotifOpen={setIsNotifOpen} />
			</motion.div>
		</AnimateSharedLayout>
	);
};
