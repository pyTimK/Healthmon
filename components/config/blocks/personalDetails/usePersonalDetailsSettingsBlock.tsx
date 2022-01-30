import React, { ChangeEventHandler, useMemo, useRef, useState } from "react";
import ReactDropdown from "react-dropdown";
import MyUser, { Role } from "../../../../classes/MyUser";
import InputOption from "../../options/inputOption/InputOption";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import styles from "./PersonalDetailsSettingsBlock.module.css";

interface PersonalDetailsSettingsBlockProps {}

const usePersonalDetailsSettingsBlock = (user: MyUser, hasEditOption = false) => {
	const nameInputRef = useRef<HTMLInputElement>(null);
	const numberInputRef = useRef<HTMLInputElement>(null);
	const [role, setRole] = useState<Role>(user.role);
	const [editing, setEditing] = useState(!hasEditOption);

	const startEditing = () => {
		setEditing(true);
	};

	const PersonalDetailsSettingsBlock: React.FC<PersonalDetailsSettingsBlockProps> = useMemo(
		() =>
			({}) => {
				return (
					<SettingsBlock
						hint='Personal Details'
						hasOptionButton={hasEditOption}
						onOptionButtonClick={startEditing}
						editing={editing}>
						<SettingsRow title='Name'>
							{editing ? (
								<InputOption inputRef={nameInputRef} value={user.name} />
							) : (
								<p className={styles.settingsRowValue}>{user.name}</p>
							)}
						</SettingsRow>
						<SettingsRow title='Phone'>
							{editing ? (
								<InputOption inputRef={numberInputRef} value={user.number} />
							) : (
								<p className={styles.settingsRowValue}>{user.number}</p>
							)}
						</SettingsRow>
						<SettingsRow title='Role'>
							{editing ? (
								<ReactDropdown
									className={styles.dropdown}
									menuClassName={styles.dropdownMenu}
									placeholderClassName={styles.dropdownPlaceHolder}
									arrowClassName={styles.dropdownArrow}
									options={[Role.Patient, Role.HealthWorker]}
									onChange={(arg) => {
										// console.log("CHANGED! ", arg);
										setRole(arg.value as Role);
									}}
									// placeholder='Select Year Level'
									value={role}
								/>
							) : (
								<p className={styles.settingsRowValue}>{user.role}</p>
							)}
						</SettingsRow>
					</SettingsBlock>
				);
			},
		[editing]
	);

	return { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role, editing, setEditing };
};

export default usePersonalDetailsSettingsBlock;
