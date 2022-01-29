import { NextPage } from "next";
import { PageDescriptions } from "../../classes/Constants";
import ConfigScreen from "../../components/config/Config";
import Layout from "../../components/layout/Layout";

const RegisterScreen: NextPage = () => {
	return (
		<Layout title='Register - Healthmon' description={PageDescriptions.HOME} showSidebar={false}>
			<h1>Register</h1>
			<ConfigScreen />
		</Layout>
	);
};

export default RegisterScreen;
