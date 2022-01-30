import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import MyUser from "../../classes/MyUser";
import usePersonalDetailsSettingsBlock from "../../components/config/blocks/personalDetails/usePersonalDetailsSettingsBlock";
import Layout from "../../components/layout/Layout";
import ButtonStatus from "../../enums/ButtonStatus";
import logError from "../../function/logError";
import notify from "../../function/notify";
import useAccount from "../../hooks/useAccount";

const Account: NextPage = () => {
	const user = MyUser.fromCookie();
	const { logout } = useAccount();
	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role } = usePersonalDetailsSettingsBlock(user);
	const [saveButtonEnabled, setSaveButtonEnabled] = useState(ButtonStatus.Hidden);
	const route = useRouter();

	const updateUser = async () => {
		// setSaveButtonEnabled(false);
		try {
			await user.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value, role);
			notify("Successfully updated details", { type: "success" });
		} catch (_e) {
			notify("Updating user details failed");
			logError(_e);
			return;
		}

		setTimeout(() => route.replace("/"), 2000);
		// setSaveButtonEnabled(false);
	};

	return (
		<Layout title='Account - Healthmon' description={PageDescriptions.HOME}>
			<h1>Account</h1>
			<PersonalDetailsSettingsBlock />

			<button className={"pink-button"} onClick={updateUser} disabled={!saveButtonEnabled}>
				Save
			</button>
			<button className='black-button' onClick={logout}>
				Sign out
			</button>
			<ToastContainer theme='colored' autoClose={2} />
		</Layout>
	);
};

export default Account;
