import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import usePersonalDetailsSettingsBlock from "../components/config/blocks/personalDetails/usePersonalDetailsSettingsBlock";
import ButtonStatus from "../enums/ButtonStatus";
import { auth } from "../firebase/initFirebase";
import logError from "../function/logError";
import notify from "../function/notify";
import useUser from "./useUser";

const useAccount = () => {
	const { user } = useUser();
	const router = useRouter();
	const authUser = getAuth().currentUser;

	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role, editing, setEditing } =
		usePersonalDetailsSettingsBlock(user, true);
	const [saveButtonStatus, setSaveButtonStatus] = useState(ButtonStatus.Hidden);

	const updateUser: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		setSaveButtonStatus(ButtonStatus.Disabled);
		try {
			await user?.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value, role);
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

		nameInputRef.current.value = user?.name ?? "";
		numberInputRef.current.value = user?.number ?? "";
		setEditing(false);
	};

	const logout = async () => {
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
