import { Bell } from "akar-icons";
import { motion } from "framer-motion";
import React, { MouseEventHandler, useContext, useEffect, useMemo, useState } from "react";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import { Formatted, HealthWorker } from "../../classes/MyUser";
import sortNotifs from "../../function/sortNotifs";
import useNotifListeners from "../../hooks/useNotifListeners";
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

	const Notif: React.FC = () => {
		return (
			<motion.div
				animate={{ height: "fit-content" }}
				initial={{ height: 0 }}
				exit={{ height: 0, transition: { duration: 0.2 } }}
				className={styles.notifDropdown}>
				<NotifBlock notifs={notifsList} setIsNotifOpen={setIsNotifOpen} />
			</motion.div>
		);
	};

	const Overlay: React.FC = () => <div className={styles.overlay} onClick={toggleNotif} />;

	return { user, userConfig, isNotifOpen, NotifBell, Notif, Overlay };
};

export default useNotif;
