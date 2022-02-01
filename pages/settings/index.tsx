import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import { Role } from "../../classes/MyUser";
import GeneralSettingsBlock from "../../components/config/blocks/general/GeneralSettingsBlock";
import HealthWorkersSettingsBlock from "../../components/config/blocks/healthWorkers/HealthWorkersSettingsBlock";
import PatientsSettingsBlock from "../../components/config/blocks/patients/PatientsSettingsBlock";
import Layout from "../../components/layout/Layout";
import useUser from "../../hooks/useUser";

const Settings: NextPage = () => {
	const { user } = useUser();
	if (!user) return <></>;

	return (
		<Layout title='Settings - Healthmon' description={PageDescriptions.HOME}>
			<h1>Settings</h1>
			<GeneralSettingsBlock user={user} />
			{user.role === Role.Patient ? (
				<HealthWorkersSettingsBlock user={user} />
			) : (
				<PatientsSettingsBlock user={user} />
			)}
			<ToastContainer theme='colored' autoClose={2} />
		</Layout>
	);
};

export default Settings;
