import { useRouter } from "next/router";
import MyUser from "../classes/MyUser";
import usePersonalDetailsSettingsBlock from "../components/config/blocks/personalDetails/usePersonalDetailsSettingsBlock";
import logError from "../function/logError";
import notify from "../function/notify";

const useRegister = () => {
	const user = MyUser.fromCookie();
	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role } = usePersonalDetailsSettingsBlock(user);
	const route = useRouter();

	const updateUser = async () => {
		try {
			await user.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value, role);
		} catch (_e) {
			notify("Updating user details failed");
			logError(_e);
			return;
		}
		route.replace("/");
	};

	return { user, PersonalDetailsSettingsBlock, updateUser };
};

export default useRegister;
