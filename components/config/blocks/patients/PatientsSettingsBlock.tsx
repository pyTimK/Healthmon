import MyUser from "../../../../classes/MyUser";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import usePatientSearchModal from "./patientSearchModal/usePatientSearchModal";

interface PatientsSettingsBlockProps {
	user: MyUser;
}

const PatientsSettingsBlock: React.FC<PatientsSettingsBlockProps> = ({ user }) => {
	const { PatientSearchModal, openPatientSearchModal, setSearchResult } = usePatientSearchModal(user);

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
