import { NextPage } from "next";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import { Role } from "../../classes/MyUser";
import GeneralSettingsBlock from "../../components/config/blocks/general/GeneralSettingsBlock";
import HealthWorkersSettingsBlock from "../../components/config/blocks/healthWorkers/HealthWorkersSettingsBlock";
import PatientsSettingsBlock from "../../components/config/blocks/patients/PatientsSettingsBlock";
import Layout from "../../components/layout/Layout";
import { AppContext } from "../_app";
import style from "./Settings.module.css";

const Settings: NextPage = () => {
	const { user, userConfig } = useContext(AppContext);

	return (
		<Layout title='Settings - Healthmon' description={PageDescriptions.HOME}>
			<div className={style.container}>
				<h1>Settings</h1>
				{user.id !== "" && userConfig.role === Role.Patient && <GeneralSettingsBlock user={user} />}
				{user.id !== "" && userConfig.role === Role.Patient ? (
					<HealthWorkersSettingsBlock user={user} />
				) : (
					<PatientsSettingsBlock user={user} />
				)}
				<ToastContainer theme='colored' autoClose={200} closeButton={false} />
			</div>
		</Layout>
	);
};

export default Settings;
