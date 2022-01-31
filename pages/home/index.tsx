import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import MyUser from "../../classes/MyUser";
import Avatar from "../../components/Avatar";
import Layout from "../../components/layout/Layout";
import useNotif from "../../components/notif/useNotif";
import Record from "../../components/record/Record";
import dayGreetings from "../../function/dayGreetings";
import useHome from "../../hooks/useHome";
import styles from "./Home.module.css";

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
	const { Notif, NotifBell, Overlay, isNotifOpen } = useNotif(user);

	const router = useRouter();
	const goToAccounts = () => router.push("/account");
	return (
		<div className={styles.header}>
			<NotifBell />
			<Avatar
				className={styles.avatar}
				size={30}
				photoURL={user.photoURL}
				letter={user.name}
				onClick={goToAccounts}
			/>
			{isNotifOpen && <Notif />}
			{isNotifOpen && <Overlay />}
			<ToastContainer theme='colored' autoClose={2} />
		</div>
	);
};

export default Home;
