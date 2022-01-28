import { NextPage } from "next";
import { PageDescriptions } from "../../classes/Constants";
import Layout from "../../components/layout/Layout";
import useAccount from "./useAccount";

const Account: NextPage = () => {
	const { logout } = useAccount();

	return (
		<Layout title='Account - Healthmon' description={PageDescriptions.HOME}>
			<div>
				<button onClick={logout}>Logout</button>
			</div>
		</Layout>
	);
};

export default Account;
