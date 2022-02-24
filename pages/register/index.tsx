import clsx from "clsx";
import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import { Role } from "../../classes/MyUser";
import GeneralSettingsBlock from "../../components/config/blocks/general/GeneralSettingsBlock";
import PatientsSettingsBlock from "../../components/config/blocks/patients/PatientsSettingsBlock";
import Layout from "../../components/layout/Layout";
import Sizedbox from "../../components/Sizedbox";
import ButtonStatus from "../../enums/ButtonStatus";
import useRegister from "../../hooks/useRegister";
import styles from "./Register.module.css";

const RegisterScreen: NextPage = () => {
	const { user, PersonalDetailsSettingsBlock, updateUser, proceedButtonStatus, role } = useRegister();
	if (!user) return <></>;

	return (
		<Layout title='Register - Healthmon' description={PageDescriptions.HOME} showSidebar={false}>
			<h1>Register</h1>
			<GeneralSettingsBlock user={user} />

			<form onSubmit={updateUser}>
				<PersonalDetailsSettingsBlock />

				{role === Role.HealthWorker && <PatientsSettingsBlock user={user} />}

				<Sizedbox height={20} />
				<button
					type='submit'
					className={clsx("pink-button", styles.proceedButton)}
					disabled={proceedButtonStatus === ButtonStatus.Disabled}>
					Proceed
				</button>
			</form>

			{/* TOAST */}
			<ToastContainer theme='colored' autoClose={2} closeButton={false} />
		</Layout>
	);
};

export default RegisterScreen;
