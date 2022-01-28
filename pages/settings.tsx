import { NextPage } from "next";
import Head from "next/head";
import Configuration from "../components/Configuration";

const Settings: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Settings - Healthmon</title>
				<meta
					name='description'
					content='Healthmon is a web application that is used together with the IoT-Based Health Monitoring Device. It monitors the collected health data of patients and stores the result in a cloud storage for later access.'
				/>
			</Head>

			<h1>Settings</h1>
			<Configuration />
		</div>
	);
};

export default Settings;
