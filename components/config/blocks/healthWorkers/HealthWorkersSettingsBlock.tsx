import { useRef } from "react";
import { FireStoreHelper } from "../../../../classes/FireStoreHelper";
import MyUser, { HealthWorker } from "../../../../classes/MyUser";
import logError from "../../../../function/logError";
import notify from "../../../../function/notify";
import useHealthWorkers from "../../../../hooks/useHealthWorkers";
import useConfirmModal from "../../../myModal/useConfirmModal/useConfirmModal";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";

interface HealthWorkersSettingsBlockProps {
	user: MyUser;
}

const HealthWorkersSettingsBlock: React.FC<HealthWorkersSettingsBlockProps> = ({ user }) => {
	const { healthWorkers } = useHealthWorkers(user);
	const selectedHealthWorker = useRef<HealthWorker | null>(null);

	const { ConfirmModal, openConfirmModal, closeConfirmModal } = useConfirmModal();

	const unpairHealthWorker = async () => {
		if (!selectedHealthWorker.current) return;

		try {
			FireStoreHelper.remove_patient_healthWorker_relationship(user.toPatient(), selectedHealthWorker.current);
			notify("HealthWorker unpaired", { type: "success" });
		} catch (_e) {
			logError(_e);
			notify("Error unpairing health worker", { type: "error" });
		}
		closeConfirmModal();
	};

	const confirmUnPairHealthWorker = (healthWorker: HealthWorker) => {
		selectedHealthWorker.current = healthWorker;
		openConfirmModal();
	};

	return (
		<SettingsBlock hint='Health Workers'>
			{healthWorkers.map((healthWorker, _i) => (
				<SettingsRow
					key={_i}
					photoURL={healthWorker.photoURL}
					title={healthWorker.name}
					subtitle={healthWorker.number}>
					<button className='transparent-button' onClick={() => confirmUnPairHealthWorker(healthWorker)}>
						Unpair
					</button>
				</SettingsRow>
			))}
			<ConfirmModal
				title='Confirm Unpair'
				description='Are you sure you want to remove this health worker from monitorig your health?'
				onConfirm={unpairHealthWorker}
			/>
		</SettingsBlock>
	);
};

export default HealthWorkersSettingsBlock;
