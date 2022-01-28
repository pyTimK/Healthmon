import type { NextPage } from "next";
import { PageDescriptions } from "../../classes/Constants";
import Avatar from "../../components/Avatar";
import Layout from "../../components/layout/Layout";
import Record from "../../components/record/Record";
import dayGreetings from "../../functions/dayGreetings";
import styles from "./Home.module.css";
import useHome from "./useHome";

const Home: NextPage = () => {
	const { user, records } = useHome();

	return (
		<Layout title='HealthMon' description={PageDescriptions.HOME}>
			<main className={styles.main}>
				<h1 className={styles.title}>
					{dayGreetings()} {user.name}
				</h1>

				{/* {user.photoURL && <img className='avatar' src={user.photoURL} alt='avatar' />} */}

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

export default Home;
