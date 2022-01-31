import type { NextPage } from "next";
import { PageDescriptions } from "../../classes/Constants";
import Avatar from "../../components/Avatar";
import Layout from "../../components/layout/Layout";
import Record from "../../components/record/Record";
import dayGreetings from "../../function/dayGreetings";
import styles from "./Home.module.css";
import { useState } from "react";
import useHome from "../../hooks/useHome";
import { Bell } from "akar-icons";
import NotifBlock from "../../components/notif/NotifBlock";
import MyUser from "../../classes/MyUser";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

const Home: NextPage = () => {
	const { user, records } = useHome();

	return (
		<Layout title='HealthMon' description={PageDescriptions.HOME}>
			<Header user={user} />
			<main className={styles.main}>
				<h1 className={styles.title}>
					{dayGreetings()} {user.name}
				</h1>

				<div className={styles.recordHeading}>
					<Avatar />
					<div className={styles.descriptionWrapper}>
						<p className={styles.description}>Krisha is feeling good today</p>
					</div>
				</div>

				{records.map((record, i) => (
					<Record
						key={i}
						timestamp={record.timestamp}
						temp={record.temp}
						pulse={record.pulse}
						spo2={record.spo2}
					/>
				))}
			</main>
		</Layout>
	);
};

interface HeaderProps {
	user: MyUser;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const router = useRouter();
	const toggleNotif = () => setIsNotifOpen((isNotifOpen) => !isNotifOpen);
	const goToAccounts = () => router.push("/account");
	return (
		<div className={styles.header}>
			<Bell size={24} color='whitesmoke' strokeWidth={1} cursor='pointer' onClick={toggleNotif} />
			<Avatar
				className={styles.avatar}
				size={30}
				photoURL={user.photoURL}
				letter={user.name}
				onClick={goToAccounts}
			/>
			{isNotifOpen && (
				<div className={styles.notifDropdown}>
					<NotifBlock />
				</div>
			)}
			{isNotifOpen && <div className={styles.overlay} onClick={toggleNotif} />}
			<ToastContainer theme='colored' autoClose={2} />
		</div>
	);
};

export default Home;
