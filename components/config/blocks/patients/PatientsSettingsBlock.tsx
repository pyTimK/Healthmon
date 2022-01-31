import { useRef } from "react";
import MyUser from "../../../../classes/MyUser";
import MyModalSection from "../../../myModal/myModalSection/MyModalSection";
import useMyModal from "../../../myModal/useMyModal";
import InputOption from "../../options/inputOption/InputOption";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import usePatientSearchModal from "./patientSearchModal/usePatientSearchModal";
import styles from "./PatientsSettingsBlock.module.css";

interface PatientsSettingsBlockProps {
	user: MyUser;
}

const PatientsSettingsBlock: React.FC<PatientsSettingsBlockProps> = ({ user }) => {
	const { PatientSearchModal, openPatientSearchModal, setSearchResult } = usePatientSearchModal();

	const addPatient = () => {
		// TODO
		setSearchResult([]);
		openPatientSearchModal();
	};
	return (
		<SettingsBlock
			hint='Monitoring Patients'
			hasOptionButton
			onOptionButtonClick={addPatient}
			optionButtonName='Add'>
			{user.monitoring.map((patient, _i) => (
				<SettingsRow key={_i} title={patient.name} subtitle={patient.number} />
			))}
			{/* <SettingsRow title={user.name} subtitle={user.number} /> */}
			<PatientSearchModal />
		</SettingsBlock>
	);
};

export default PatientsSettingsBlock;
