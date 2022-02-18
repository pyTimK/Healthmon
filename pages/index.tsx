import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../classes/Constants";
import MyUser, { Role } from "../classes/MyUser";
import Avatar from "../components/Avatar";
import DropdownPicker from "../components/home/myDatePicker/dropdownPicker/DropdownPicker";
import MyDatePicker from "../components/home/myDatePicker/MyDatePicker";
import Layout from "../components/layout/Layout";
import useNotif from "../components/notif/useNotif";
import RecordsBlock from "../components/record/RecordsBlock";
import Sizedbox from "../components/Sizedbox";
import { parseUserConfigDate } from "../function/dateConversions";
import dayGreetings from "../function/dayGreetings";
import groupCommentsBasedOnPatient from "../function/groupCommentsBasedOnPatient";
import usePatients from "../hooks/usePatients";
import useUser from "../hooks/useUser";
import useUserComments from "../hooks/useUserComments";
import useUserConfig from "../hooks/useUserConfig";
import UserComment from "../types/RecordComment";
import { UserConfig } from "../types/userConfig";
import styles from "../styles/Home.module.css";
import { AppContext } from "./_app";

export const HomeContext = React.createContext({
	user: new MyUser(),
	userConfig: UserConfig.constructEmpty(),
});

const Home: NextPage = () => {
	const { user } = useUser();
	const { userConfig } = useUserConfig();
	const { isSmartphone } = useContext(AppContext);

	return (
		<Layout title='HealthMon' description={PageDescriptions.HOME}>
			<HomeContext.Provider value={{ user, userConfig }}>
				<Header />
				<main className={styles.main}>
					<div className={styles.title}>
						<h1>
							{dayGreetings()} {user?.name}
						</h1>
					</div>
					<MyDatePicker />
					{!isSmartphone && <Sizedbox height={50} />}

					{userConfig.role === Role.Patient ? <PatientRecordBlock /> : <HealthWorkerRecordBlocks />}
					<Sizedbox height={100} />
				</main>
				<ToastContainer theme='colored' autoClose={2} />
			</HomeContext.Provider>
		</Layout>
	);
};

interface PatientRecordBlockProps {}

const PatientRecordBlock: React.FC<PatientRecordBlockProps> = () => {
	const { user } = useContext(HomeContext);
	return <RecordsBlock headerHidden patient={user.toPatient()} />;
};

export const HealthWorkerRecodBlocksContext = React.createContext({
	groupedCommentsBasedOnPatient: {} as {
		[key: string]: UserComment[];
	},
});

interface HealthWorkerRecordBlocksProps {}

const HealthWorkerRecordBlocks: React.FC<HealthWorkerRecordBlocksProps> = () => {
	const { user } = useContext(HomeContext);
	const { patients } = usePatients(user);
	const { userComments } = useUserComments(user);
	const groupedCommentsBasedOnPatient = groupCommentsBasedOnPatient(userComments);

	return (
		<HealthWorkerRecodBlocksContext.Provider value={{ groupedCommentsBasedOnPatient }}>
			<div className={styles.recordsWrapper}>
				{patients.map((patient, i) => (
					<RecordsBlock key={i} patient={patient} />
				))}
			</div>
		</HealthWorkerRecodBlocksContext.Provider>
	);
};

const Header: React.FC = () => {
	const { user, userConfig, Notif, NotifBell, Overlay, isNotifOpen } = useNotif();
	const router = useRouter();
	const goToAccounts = () => router.push("/account");
	const { month, year } = parseUserConfigDate(userConfig.date);
	return (
		<div className={styles.header}>
			<Avatar
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
