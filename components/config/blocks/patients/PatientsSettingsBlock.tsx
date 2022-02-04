import MyUser, { Patient } from "../../../../classes/MyUser";
import usePatients from "../../../../hooks/usePatients";
import useRequestedUsers from "../../../../hooks/useRequestedUsers";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import usePatientSearchModal from "./patientSearchModal/usePatientSearchModal";

interface PatientsSettingsBlockProps {
	user: MyUser;
}
const PatientsSettingsBlock: React.FC<PatientsSettingsBlockProps> = ({ user }) => {
	const { patients } = usePatients(user);
	const { requestedUsers } = useRequestedUsers(user);
	const { PatientSearchModal, openPatientSearchModal, setSearchResult } = usePatientSearchModal(
		user,
		patients,
		requestedUsers
	);

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
			{patients.map((patient, _i) => (
				<SettingsRow key={_i} title={patient.name} subtitle={patient.number} />
			))}
			{/* <SettingsRow title={user.name} subtitle={user.number} /> */}
			<PatientSearchModal />
		</SettingsBlock>
	);
};

export default PatientsSettingsBlock;
