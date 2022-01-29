import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import { useRef, useState } from "react";
import ReactDropdown from "react-dropdown";
import { ToastContainer } from "react-toastify";
import { CookiesHelper } from "../../classes/CookiesHelper";
import MyUser, { Role } from "../../classes/MyUser";
import { db } from "../../firebase/initFirebase";
import notify from "../../function/notify";
import DeviceData from "../../types/DeviceData";
import GeneralSettingsBlock from "./blocks/general/GeneralSettingsBlock";
import styles from "./Config.module.css";
import InputOption from "./options/inputOption/InputOption";
import SettingsBlock from "./settingsBlock/SettingsBlock";
import SettingsRow from "./settingsRow/SettingsRow";

const ConfigScreen: NextPage = () => {
	const [user, setUser] = useState(CookiesHelper.get<MyUser>("user", new MyUser()));

	// useEffect(() => {
	// 	CookiesHelper.set("user", user);
	// }, [user]);

	const [role, setRole] = useState<Role>(user.role);

	const nameInputRef = useRef<HTMLInputElement>(null);
	const numberInputRef = useRef<HTMLInputElement>(null);

	//? Firestore
	const updateRecord = async (deviceName: string) => {
		//TODO dont update device info if not connected
		const newDeviceDocFields: DeviceData = {
			name: nameInputRef.current?.value ?? user.name,
			id: user.id,
			healthWorkers: user.healthWorkers,
			new_name: "",
			new_id: "",
			new_healthWorkers: [],
			confirmed: false,
			request_timestamp: serverTimestamp(),
		};

		const updatedUserDocFields: Partial<MyUser> = {
			name: nameInputRef.current?.value ?? user.name,
			number: numberInputRef.current?.value ?? "",
			device: CookiesHelper.get<string>("deviceid", ""),
			healthWorkers: user.healthWorkers,
			role: Role.Patient, //TODO make variable
		};

		try {
			await updateDoc(doc(db, "devices", deviceName), { ...newDeviceDocFields });
			await updateDoc(doc(db, "users", user.id), { ...updatedUserDocFields });

			return true;
		} catch (_e) {
			notify("Pair failed");

			return false;
		}
	};

	const updateUser = async () => {
		console.log(user);
		user.updatePersonalDetails(nameInputRef.current!.value, numberInputRef.current!.value, role);
		await updateRecord("healthmonmikee1");
		// const route = useRouter();
		// route.replace("/");
	};

	return (
		<div>
			<GeneralSettingsBlock user={user} />

			<SettingsBlock hint='Personal Details'>
				<SettingsRow title='Name'>
					<InputOption inputRef={nameInputRef} defaultValue={user.name} />
				</SettingsRow>
				<SettingsRow title='Phone'>
					<InputOption inputRef={numberInputRef} defaultValue={user.number} />
				</SettingsRow>
				<SettingsRow title='Role'>
					<ReactDropdown
						className={styles.dropdown}
						menuClassName={styles.dropdownMenu}
						placeholderClassName={styles.dropdownPlaceHolder}
						arrowClassName={styles.dropdownArrow}
						options={[Role.Patient, Role.HealthWorker]}
						onChange={(arg) => setRole(arg.value as Role)}
						// placeholder='Select Year Level'
						value={user.role}
					/>
				</SettingsRow>
			</SettingsBlock>
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
