import { SettingsHorizontal } from "akar-icons";
import clsx from "clsx";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MonitorRequestNotif, RecordCommentNotif } from "../../types/Notification";
import Divider from "../Divider";
import Sizedbox from "../Sizedbox";
import styles from "./NotifBlock.module.css";
import NotifItem from "./NotifItem";

interface NotifBlockProps {
	notifs: (MonitorRequestNotif | RecordCommentNotif)[];
	setIsNotifOpen: Dispatch<SetStateAction<boolean>>;
}

const NotifBlock: React.FC<NotifBlockProps> = ({ notifs, setIsNotifOpen }) => {
	const [justOpened, setJustOpened] = useState(true);
	const router = useRouter();
	const goToSettings = () => router.push("/settings");
	console.log(notifs);

	useEffect(() => {
		setJustOpened(false);
		// setTimeout(() => setJustOpened(false), 800);
	}, []);

	return (
		<motion.div layout>
			<div className={styles.header}>
				<h3 className={clsx(styles.title, "unselectable")}>Notifications</h3>
				<div className={styles.configIconWrapper}>
					<SettingsHorizontal size={18} cursor='pointer' onClick={goToSettings} />
				</div>
			</div>
			<Divider />
			{notifs.length === 0 && (
				<motion.div layout className={clsx(styles.emptyContainer, "unselectable")}>
					<img className={styles.emptySvg} src='/img/void.svg' />
					<p className={styles.emptyText}>It&#39;s quiet out here...</p>
				</motion.div>
			)}
			<AnimatePresence>
				{notifs.map((notif, _i) => {
					console.log(`${notif.sender}_${notif.timestamp}`);
					return (
						<motion.div
							className={styles.notifItem}
							// layoutId={`${notif.sender}_${notif.timestamp}`}
							key={`${notif.sender}_${notif.timestamp}`}
							initial={justOpened || notifs.length === 1 ? false : { height: 0 }}
							animate={{ height: "fit-content" }}
							// transition={{ duration: 3 }}
							exit={{ height: 0 }}>
							{_i !== 0 && <Divider />}
							<NotifItem notif={notif} setIsNotifOpen={setIsNotifOpen} />
							<Sizedbox height={10} />
						</motion.div>
					);
				})}
			</AnimatePresence>
		</motion.div>
	);
};

export default NotifBlock;
