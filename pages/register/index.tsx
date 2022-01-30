import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import GeneralSettingsBlock from "../../components/config/blocks/general/GeneralSettingsBlock";
import Layout from "../../components/layout/Layout";
import useRegister from "../../hooks/useRegister";

const RegisterScreen: NextPage = () => {
	const { user, PersonalDetailsSettingsBlock, updateUser } = useRegister();

	return (
		<Layout title='Register - Healthmon' description={PageDescriptions.HOME} showSidebar={false}>
			<h1>Register</h1>
			<GeneralSettingsBlock user={user} />

			<PersonalDetailsSettingsBlock />

			<button className={"pink-button"} onClick={updateUser}>
				Proceed
			</button>

			{/* TOAST */}
			<ToastContainer theme='colored' autoClose={2} />
		</Layout>
	);
};

export default RegisterScreen;
