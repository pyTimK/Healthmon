import { useContext } from "react";
import { useRef } from "react";
import { FireStoreHelper } from "../../../../classes/FireStoreHelper";
import MyUser, { Patient } from "../../../../classes/MyUser";
import logError from "../../../../function/logError";
import notify from "../../../../function/notify";
import { AppContext } from "../../../../pages/_app";
import useConfirmModal from "../../../myModal/useConfirmModal/useConfirmModal";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import usePatientSearchModal from "./patientSearchModal/usePatientSearchModal";

interface PatientsSettingsBlockProps {
	user: MyUser;
}
const PatientsSettingsBlock: React.FC<PatientsSettingsBlockProps> = ({ user }) => {
	const { patients, requestedUsers } = useContext(AppContext);
	const selectedPatient = useRef<Patient | null>(null);
	const { PatientSearchModal, openPatientSearchModal, setSearchResult } = usePatientSearchModal(
		user,
		patients,
		requestedUsers
	);
	const { ConfirmModal, openConfirmModal, closeConfirmModal } = useConfirmModal();

	const addPatient = () => {
		setSearchResult([]);
		openPatientSearchModal();
	};

	const unpairPatient = async () => {
		if (!selectedPatient.current) return;
		try {
			FireStoreHelper.remove_patient_healthWorker_relationship(selectedPatient.current, user.toHealthWorker());
			notify("Patient unpaired", { type: "success" });
		} catch (_e) {
			logError(_e);
			notify("Error unpairing patient", { type: "error" });
		}
		closeConfirmModal();
	};

	const confirmUnPairPatient = (patient: Patient) => {
		selectedPatient.current = patient;
		openConfirmModal();
	};

	return (
		<SettingsBlock hint='Patients' hasOptionButton onOptionButtonClick={addPatient} optionButtonName='Add'>
			{patients.map((patient, _i) => (
				<SettingsRow key={_i} photoURL={patient.photoURL} title={patient.name} subtitle={patient.number}>
					<button className='transparent-button' onClick={() => confirmUnPairPatient(patient)}>
						Unpair
					</button>
				</SettingsRow>
			))}
			<PatientSearchModal />
			<ConfirmModal
				title='Confirm Unpair'
				description='Are you sure you want to remove this patient from your monitoring list?'
				onConfirm={unpairPatient}
			/>
		</SettingsBlock>
	);
};

export default PatientsSettingsBlock;
