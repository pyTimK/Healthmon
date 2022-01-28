import { NextPage } from "next";
import "firebase/compat/auth";
import ConfigScreen from "../../components/config/Config";
import Head from "next/head";
import styles from "../styles/Register.module.css";

const RegisterScreen: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Settings - Healthmon</title>
				<meta
					name='description'
					content='Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device <Device Name>. It monitors the collected health data of patients and stores the result in a cloud storage for later access.'
				/>
			</Head>

			<h1>Settings</h1>
			<ConfigScreen />
		</div>
	);
};

export default RegisterScreen;
