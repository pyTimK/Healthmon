import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../classes/Constants";
import { Role } from "../classes/MyUser";
import MyAvatar from "../components/Avatar";
import DropdownPicker from "../components/home/myDatePicker/dropdownPicker/DropdownPicker";
import MyDatePicker from "../components/home/myDatePicker/MyDatePicker";
import Layout from "../components/layout/Layout";
import useNotif from "../components/notif/useNotif";
import RecordsBlock from "../components/record/RecordsBlock";
import Sizedbox from "../components/Sizedbox";
import { parseUserConfigDate } from "../function/dateConversions";
import dayGreetings from "../function/dayGreetings";
import groupCommentsBasedOnPatient from "../function/groupCommentsBasedOnPatient";
import { DeviceType } from "../hooks/useIsSmartphone";
import useUserComments from "../hooks/useUserComments";
import styles from "../styles/Home.module.css";
import UserComment from "../types/RecordComment";
import { AppContext } from "./_app";

const Home: NextPage = () => {
	const { device, user, userConfig } = useContext(AppContext);

	return (
		<Layout title='HealthMon' description={PageDescriptions.HOME}>
			<Header />
			<main className={styles.main}>
				{user.id !== "" && (
					<div className={styles.title}>
						<h1>
							{dayGreetings()} <span className={styles.nameHome}>{user?.name}</span>
						</h1>
					</div>
				)}
				{user.id !== "" && userConfig.id !== "" && <MyDatePicker />}
				{device !== DeviceType.Smartphone && <Sizedbox height={50} />}

				{userConfig.role === Role.Patient ? <PatientRecordBlock /> : <HealthWorkerRecordBlocks />}
				<Sizedbox height={100} />
			</main>
			<ToastContainer theme='colored' autoClose={2} closeButton={false} />
		</Layout>
	);
};

interface PatientRecordBlockProps {}

const PatientRecordBlock: React.FC<PatientRecordBlockProps> = () => {
	const { user } = useContext(AppContext);
	return <RecordsBlock headerHidden patient={user.toPatient()} />;
};

interface HealthWorkerRecordBlocksProps {}

const HealthWorkerRecordBlocks: React.FC<HealthWorkerRecordBlocksProps> = () => {
	const { user, patients } = useContext(AppContext);
	const { userComments } = useUserComments(user);
	const groupedCommentsBasedOnPatient = groupCommentsBasedOnPatient(userComments);

	return (
		<div className={styles.recordsWrapper}>
			{patients.map((patient, i) => (
				<RecordsBlock key={i} patient={patient} groupedCommentsBasedOnPatient={groupedCommentsBasedOnPatient} />
			))}
		</div>
	);
};

const Header: React.FC = () => {
	const { user, userConfig, Notif, NotifBell, Overlay, isNotifOpen } = useNotif();
	const router = useRouter();
	const goToAccounts = () => router.push("/account");
	const { month, year } = parseUserConfigDate(userConfig.date);
	return (
		<div className={styles.header}>
			<MyAvatar
				className={styles.avatar}
				// size={26}
				photoURL={user.photoURL}
				letter={user.name}
				onClick={goToAccounts}
			/>
			<DropdownPicker userConfig={userConfig} month={month} year={year} />
			<NotifBell />
			<AnimatePresence>{isNotifOpen && <Notif />}</AnimatePresence>
			<AnimatePresence>{isNotifOpen && <Overlay />}</AnimatePresence>
		</div>
	);
};

//? OLD HEADER
// const Header: React.FC = () => {
// 	const { user, Notif, NotifBell, Overlay, isNotifOpen } = useNotif();
// 	const router = useRouter();
// 	const goToAccounts = () => router.push("/account");
// 	return (
// 		<div className={styles.header}>
// 			<NotifBell />
// 			<Avatar
// 				className={styles.avatar}
// 				// size={26}
// 				photoURL={user.photoURL}
// 				letter={user.name}
// 				onClick={goToAccounts}
// 			/>
// 			{isNotifOpen && <Notif />}
// 			{isNotifOpen && <Overlay />}
// 			<ToastContainer theme='colored' autoClose={2} />
// 		</div>
// 	);
// };

export default Home;
