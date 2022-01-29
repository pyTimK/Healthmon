import { useRef, useState } from "react";
import ReactDropdown from "react-dropdown";
import MyUser, { Role } from "../../../../classes/MyUser";
import InputOption from "../../options/inputOption/InputOption";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import styles from "./PersonalDetailsSettingsBlock.module.css";

interface PersonalDetailsSettingsBlockProps {}

const usePersonalDetailsSettingsBlock = (user: MyUser) => {
	const nameInputRef = useRef<HTMLInputElement>(null);
	const numberInputRef = useRef<HTMLInputElement>(null);
	const [role, setRole] = useState<Role>(user.role);

	const PersonalDetailsSettingsBlock: React.FC<PersonalDetailsSettingsBlockProps> = ({}) => {
		return (
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
		);
	};

	return { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role };
};

export default usePersonalDetailsSettingsBlock;
