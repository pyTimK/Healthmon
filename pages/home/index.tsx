import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import MyUser, { Role } from "../../classes/MyUser";
import Avatar from "../../components/Avatar";
import MyDatePicker from "../../components/home/myDatePicker/MyDatePicker";
import Layout from "../../components/layout/Layout";
import useNotif from "../../components/notif/useNotif";
import RecordsBlock from "../../components/record/RecordsBlock";
import Sizedbox from "../../components/Sizedbox";
import dayGreetings from "../../function/dayGreetings";
import useUser from "../../hooks/useUser";
import useUserConfig from "../../hooks/useUserConfig";
import styles from "./Home.module.css";

const Home: NextPage = () => {
	const { user } = useUser();
	const { userConfig } = useUserConfig();

	if (user.id === "") return <div></div>;

	return (
		<div>
			<Layout title='HealthMon' description={PageDescriptions.HOME} header={<Header user={user} />}>
				<main className={styles.main}>
					<div className={styles.title}>
						<h1>
							{dayGreetings()} {user?.name}
						</h1>
					</div>
					<MyDatePicker userConfig={userConfig} />
					<Sizedbox height={100} />

					{userConfig.role === Role.Patient ? (
						<PatientRecordBlock user={user} />
					) : (
						<HealthWorkerRecordBlock user={user} />
					)}
				</main>
			</Layout>
		</div>
	);
};

interface PatientRecordBlockProps {
	user: MyUser;
}

const PatientRecordBlock: React.FC<PatientRecordBlockProps> = ({ user }) => <RecordsBlock user={user} />;

interface HealthWorkerRecordBlockProps {
	user: MyUser;
}

const HealthWorkerRecordBlock: React.FC<HealthWorkerRecordBlockProps> = ({ user }) => (
	//TODO show patient records on health workers page
	<div>
		<RecordHeading user={user} />
		<RecordsBlock user={user} />
	</div>
);

interface RecordHeadingProps {
	user: MyUser;
}

const RecordHeading: React.FC<RecordHeadingProps> = ({ user }) => {
	return (
		<div className={styles.recordHeading}>
			<Avatar />
			<div className={styles.descriptionWrapper}>
				<p className={styles.description}>Krisha is feeling good today</p>
			</div>
		</div>
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
				size={50}
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
