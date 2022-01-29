import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { CookiesHelper } from "../../classes/CookiesHelper";
import MyUser, { Role } from "../../classes/MyUser";
import { db } from "../../firebase/initFirebase";
import logError from "../../function/logError";
import notify from "../../function/notify";
import DeviceData from "../../types/DeviceData";
import GeneralSettingsBlock from "./blocks/general/GeneralSettingsBlock";
import usePersonalDetailsSettingsBlock from "./blocks/personalDetails/usePersonalDetailsSettingsBlock";
import SettingsBlock from "./settingsBlock/SettingsBlock";
import SettingsRow from "./settingsRow/SettingsRow";

const ConfigScreen: NextPage = () => {
	const [user, setUser] = useState(MyUser.fromCookie());
	const { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role } = usePersonalDetailsSettingsBlock(user);
	const route = useRouter();
	// useEffect(() => {
	// 	CookiesHelper.set("user", user);
	// }, [user]);

	const updateUser = async () => {
		try {
			await user.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value, role);
			notify("Successfully updated details", { type: "success" });
		} catch (_e) {
			notify("Updating user details failed");
			logError(_e);
		}
		route.replace("/");
	};

	return (
		<div>
			<GeneralSettingsBlock user={user} />

			<PersonalDetailsSettingsBlock />

			{user.healthWorkers.length > 0 && (
				<SettingsBlock hint='Health Workers'>
					{user.healthWorkers.map((healthWorker, _i) => {
						return (
							<>
								<SettingsRow title={healthWorker.name} subtitle={healthWorker.number}></SettingsRow>
							</>
						);
					})}
				</SettingsBlock>
			)}

			<button className='pink-button' onClick={updateUser}>
				Save
			</button>

			{/* TOAST */}
			<ToastContainer theme='colored' autoClose={2} />
		</div>
	);
};

export default ConfigScreen;
