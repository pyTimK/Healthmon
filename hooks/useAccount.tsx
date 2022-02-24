import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { FormEventHandler, useContext, useState } from "react";
import { CookieKeys, CookiesHelper } from "../classes/CookiesHelper";
import usePersonalDetailsSettingsBlock from "../components/config/blocks/personalDetails/usePersonalDetailsSettingsBlock";
import ButtonStatus from "../enums/ButtonStatus";
import logError from "../function/logError";
import notify from "../function/notify";
import { AppContext } from "../pages/_app";

const useAccount = () => {
	const { user, userConfig, fireStoreHelper, auth } = useContext(AppContext);
	const router = useRouter();
	const authUser = auth?.currentUser;

	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role, editing, setEditing } =
		usePersonalDetailsSettingsBlock(user, userConfig, true);
	const [saveButtonStatus, setSaveButtonStatus] = useState(ButtonStatus.Hidden);

	const updateUser: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!fireStoreHelper || !numberInputRef.current || !nameInputRef.current) return;

		if (numberInputRef.current.value.length < 10) {
			notify("Number must be at least 10 digits long");
			return;
		}

		setSaveButtonStatus(ButtonStatus.Disabled);
		try {
			await user.updatePersonalDetails(nameInputRef.current.value, numberInputRef.current.value, fireStoreHelper);
			await userConfig.updateRole(role, fireStoreHelper);
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

	const logout = async () => {
		if (!auth) return;
		CookiesHelper.remove(CookieKeys.id);

		try {
			await auth.signOut();
			router.replace("/auth");
		} catch (_e: any) {
			const e: Error = _e;
			console.log(e.message);
		}
	};

	return {
		logout,
		authUser,
		user,
		PersonalDetailsSettingsBlock,
		discardChanges,
		updateUser,
		editing,
		saveButtonStatus,
	};
};

export default useAccount;
