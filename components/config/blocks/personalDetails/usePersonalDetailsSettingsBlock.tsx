import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MyUser, { Role } from "../../../../classes/MyUser";
import { UserConfig } from "../../../../types/userConfig";
import InputOption from "../../options/inputOption/InputOption";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import styles from "./PersonalDetailsSettingsBlock.module.css";

interface PersonalDetailsSettingsBlockProps {}

const usePersonalDetailsSettingsBlock = (user: MyUser, userConfig: UserConfig, hasEditOption = false) => {
	const nameInputRef = useRef<HTMLInputElement>(null);
	const numberInputRef = useRef<HTMLInputElement>(null);
	const [role, setRole] = useState<Role>(userConfig.role);
	const [editing, setEditing] = useState(!hasEditOption);

	useEffect(() => {
		if (userConfig) setRole(userConfig.role);
	}, [userConfig]);

	const startEditing = () => {
		setEditing(true);
	};

	const PersonalDetailsSettingsBlock: React.FC<PersonalDetailsSettingsBlockProps> = useMemo(
		() =>
			function PersonalDetailsSettingsBlockInner({}) {
				return (
					<>
						{
							<SettingsBlock
								hint='Personal Details'
								hasOptionButton={hasEditOption}
								onOptionButtonClick={startEditing}
								editing={editing}>
								<SettingsRow title='Name'>
									{editing ? (
										<InputOption inputRef={nameInputRef} value={user.name} maxLength={20} />
									) : (
										<p className={styles.settingsRowValue}>{user.name}</p>
									)}
								</SettingsRow>
								<SettingsRow title='Phone'>
									{editing ? (
										<InputOption inputRef={numberInputRef} value={user.number} maxLength={15} />
									) : (
										<p className={styles.settingsRowValue}>{user.number}</p>
									)}
								</SettingsRow>
								<SettingsRow title='Role'>
									{editing ? (
										<div className={clsx(styles.roleWrapper, "unselectable")}>
											<div
												className={clsx(
													styles.roleItem,
													role === Role.Patient && styles.roleLeftSelected
												)}
												onClick={() => setRole(Role.Patient)}>
												<img src='/img/svg/patient.svg' alt='doctor' height={35} />
												<p className={styles.settingsRowValue}>Patient</p>
											</div>
											<div
												className={clsx(
													styles.roleItem,
													role === Role.HealthWorker && styles.roleRightSelected
												)}
												onClick={() => setRole(Role.HealthWorker)}>
												<img src='/img/svg/doctor.svg' alt='doctor' height={35} />
												<p className={styles.settingsRowValue}>Health Worker</p>
											</div>
										</div>
									) : (
										<p className={styles.settingsRowValue}>{userConfig.role}</p>
									)}
								</SettingsRow>
							</SettingsBlock>
						}
					</>
				);
			},
		[editing, user, role]
	);
	// PersonalDetailsSettingsBlock.displayName = "PersonalDetailsSettingsBlock";

	return { PersonalDetailsSettingsBlock, nameInputRef, numberInputRef, role, editing, setEditing };
};
export default usePersonalDetailsSettingsBlock;
