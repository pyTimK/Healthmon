import { NextPage } from "next";
import { PageDescriptions } from "../../classes/Constants";
import Configuration from "../../components/config/Config";
import Layout from "../../components/layout/Layout";

const Settings: NextPage = () => {
	return (
		<Layout title='Settings - Healthmon' description={PageDescriptions.HOME}>
			<h1>Settings</h1>
			<Configuration />
		</Layout>
	);
};

export default Settings;
