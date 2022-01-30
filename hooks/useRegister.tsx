import { useRouter } from "next/router";
import MyUser from "../classes/MyUser";
import usePersonalDetailsSettingsBlock from "../components/config/blocks/personalDetails/usePersonalDetailsSettingsBlock";
import logError from "../function/logError";
import { useState } from "react";
import notify from "../function/notify";
import ButtonStatus from "../enums/ButtonStatus";

const useRegister = () => {
	const user = MyUser.fromCookie();
	const [proceedButtonStatus, setProceedButtonStatus] = useState(ButtonStatus.Enabled);
	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role } = usePersonalDetailsSettingsBlock(user);
	const route = useRouter();

	const updateUser = async () => {
		setProceedButtonStatus(ButtonStatus.Disabled);
		try {
			await user.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value, role);
		} catch (_e) {
			notify("Updating user details failed");
			logError(_e);
			setProceedButtonStatus(ButtonStatus.Enabled);
			return;
		}
		route.replace("/");
	};

	return { user, PersonalDetailsSettingsBlock, updateUser, proceedButtonStatus, role };
};

export default useRegister;
