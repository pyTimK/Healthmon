import clsx from "clsx";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { PageDescriptions } from "../../classes/Constants";
import MyUser from "../../classes/MyUser";
import usePersonalDetailsSettingsBlock from "../../components/config/blocks/personalDetails/usePersonalDetailsSettingsBlock";
import Layout from "../../components/layout/Layout";
import Sizedbox from "../../components/Sizedbox";
import ButtonStatus from "../../enums/ButtonStatus";
import logError from "../../function/logError";
import notify from "../../function/notify";
import useAccount from "../../hooks/useAccount";
import useUser from "../../hooks/useUser";
import styles from "./Account.module.css";

const Account: NextPage = () => {
	const { user } = useUser();
	if (!user) return <></>;

	const { logout } = useAccount();
	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role, editing, setEditing } =
		usePersonalDetailsSettingsBlock(user, true);
	const [saveButtonStatus, setSaveButtonStatus] = useState(ButtonStatus.Hidden);
	const route = useRouter();

	const updateUser = async () => {
		setSaveButtonStatus(ButtonStatus.Disabled);
		try {
			await user.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value, role);
			notify("Successfully updated details", { type: "success" });
			setEditing(false);
		} catch (_e) {
			notify("Updating user details failed");
			logError(_e);
		}
		setSaveButtonStatus(ButtonStatus.Enabled);
	};

	const discardChanges = () => {
		if (!nameInputRef.current || !numberInputRef.current) return;

		nameInputRef.current.value = user.name;
		numberInputRef.current.value = user.number;
		setEditing(false);
	};

	return (
		<Layout title='Account - Healthmon' description={PageDescriptions.HOME}>
			<h1>Account</h1>
			<PersonalDetailsSettingsBlock />
			<div className={clsx(styles.onChangeButtonWrapper, !editing && "hidden")}>
				<button
					className={"transparent-button"}
					onClick={discardChanges}
					disabled={saveButtonStatus === ButtonStatus.Disabled}>
					Discard
				</button>
				<button
					className={"pink-button"}
					onClick={updateUser}
					disabled={saveButtonStatus === ButtonStatus.Disabled}>
					Save
				</button>
			</div>
			<Sizedbox height={50} />
			<div className={styles.signOutButton}>
				<button className='black-button' onClick={logout}>
					Sign out
				</button>
			</div>
			<ToastContainer theme='colored' autoClose={2} />
		</Layout>
	);
};

export default Account;
