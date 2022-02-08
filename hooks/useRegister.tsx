import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import usePersonalDetailsSettingsBlock from "../components/config/blocks/personalDetails/usePersonalDetailsSettingsBlock";
import ButtonStatus from "../enums/ButtonStatus";
import logError from "../function/logError";
import notify from "../function/notify";
import useUser from "./useUser";
import useUserConfig from "./useUserConfig";

const useRegister = () => {
	const { user } = useUser();
	const { userConfig } = useUserConfig();

	const [proceedButtonStatus, setProceedButtonStatus] = useState(ButtonStatus.Enabled);
	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role } = usePersonalDetailsSettingsBlock(
		user,
		userConfig
	);
	const route = useRouter();

	const updateUser: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		setProceedButtonStatus(ButtonStatus.Disabled);
		try {
			await user.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value);
			console.log(userConfig);
			await userConfig.updateRole(role);
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
