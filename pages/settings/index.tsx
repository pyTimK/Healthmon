import { NextPage } from "next";
import { PageDescriptions } from "../../classes/Constants";
import MyUser from "../../classes/MyUser";
import GeneralSettingsBlock from "../../components/config/blocks/general/GeneralSettingsBlock";
import HealthWorkersSettingsBlock from "../../components/config/blocks/healthWorkers/HealthWorkersSettingsBlock";
import Layout from "../../components/layout/Layout";

const Settings: NextPage = () => {
	const user = MyUser.fromCookie();

	return (
		<Layout title='Settings - Healthmon' description={PageDescriptions.HOME}>
			<h1>Settings</h1>
			<GeneralSettingsBlock user={user} />
			<HealthWorkersSettingsBlock user={user} />
		</Layout>
	);
};

export default Settings;
