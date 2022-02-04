import { Search } from "akar-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import dynamic from "next/dynamic";
import { FormEventHandler, MouseEventHandler, useRef, useState } from "react";
import { FireStoreHelper } from "../../../../../classes/FireStoreHelper";
import MyUser, { Patient, RequestedUser } from "../../../../../classes/MyUser";
import ButtonStatus from "../../../../../enums/ButtonStatus";
import { db } from "../../../../../firebase/initFirebase";
import alreadyPatient from "../../../../../function/alreadyPatient";
import alreadyRequested from "../../../../../function/alreadyRequested";
import logError from "../../../../../function/logError";
import notify from "../../../../../function/notify";
import useConfirmModal from "../../../../myModal/useConfirmModal/useConfirmModal";
import useMyModal from "../../../../myModal/useMyModal";
import Sizedbox from "../../../../Sizedbox";
import UserOverview from "../../../../userOverview/UserOverview";
import styles from "./PatientSearchModal.module.css";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

interface PatientSearchModalProps {}

const usePatientSearchModal = (user: MyUser, patients: Patient[], requestedUsers: RequestedUser[]) => {
	const [MyModal, openPatientSearchModal, closePatientSearchModal, isPatientSearchModalOpen] = useMyModal();
	const { ConfirmModal, openConfirmModal, closeConfirmModal } = useConfirmModal();
	const [searchResult, setSearchResult] = useState<Patient[]>([]);
	const patientNumInputRef = useRef<HTMLInputElement>(null);
	const [buttonStatus, setButtonStatus] = useState(ButtonStatus.Enabled);
	const selectedPatient = useRef<Patient | null>(null);

	const searchPatient: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!patientNumInputRef.current) return;

		if (!patientNumInputRef.current.value) {
			notify("Please enter a phone number", { type: "info" });
			return;
		}
		const newSearchResult: Patient[] = [];

		const q = query(collection(db, "users"), where("number", "==", patientNumInputRef.current.value));
		const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			const user = doc.data() as MyUser;
			newSearchResult.push({ id: user.id, name: user.name, number: user.number, photoURL: user.photoURL });
		});
		if (newSearchResult.length === 0) {
			notify("No patient found");
		}
		setSearchResult(newSearchResult);
	};

	const sendRequest = async (patient: Patient) => {
		if (alreadyRequested(patient, requestedUsers)) return;
		if (alreadyPatient(patient, patients)) return;

		setButtonStatus(ButtonStatus.Disabled);
		try {
			await FireStoreHelper.sendMonitorRequestNotif(patient, user.toHealthWorker());
			notify("Request Sent", { type: "success" });
		} catch (_e) {
			logError(_e);
			notify("Can't send request right now");
		}
		setButtonStatus(ButtonStatus.Enabled);
	};

	const cancelRequest = async (patient: Patient | null) => {
		if (!patient) return;
		if (!alreadyRequested(patient, requestedUsers)) return;

		setButtonStatus(ButtonStatus.Disabled);
		try {
			await FireStoreHelper.removeMonitorRequest(patient, user.toHealthWorker());
			notify("Request Cancelled", { type: "info" });
		} catch (_e) {
			logError(_e);
			notify("Can't cancel request right now");
		}
		setButtonStatus(ButtonStatus.Enabled);
		closeConfirmModal();
	};

	const confirmCancelRequest = async (patient: Patient) => {
		selectedPatient.current = patient;
		openConfirmModal();
	};

	const PatientSearchModal: React.FC<PatientSearchModalProps> = ({}) => {
		return (
			<>
				<MyModal>
					<div className={styles.section}>
						<h1 className={styles.title}>Add Patient</h1>
						<Sizedbox height={30} />
						<form className={styles.inputRow} onSubmit={searchPatient}>
							<input
								ref={patientNumInputRef}
								className={styles.input}
								type='text'
								placeholder='Search...'
							/>
							<button type='submit' className={styles.SearchIconButton}>
								<Search size={16} strokeWidth={4} color='var(--background-light)' />
							</button>
						</form>
						<p>Please Enter patient&#39;s phone number</p>
						{searchResult.map((patient, _i) => {
							return (
								<div key={_i} className={styles.resultRow}>
									<UserOverview
										name={patient.name}
										number={patient.number}
										photoURL={patient.photoURL}
									/>
									<div className={styles.resultRowButton}>
										{!alreadyPatient(patient, patients) &&
											patient.number !== user.number &&
											(alreadyRequested(patient, requestedUsers) ? (
												<CancelRequestButton
													onClick={(_) => confirmCancelRequest(patient)}
													buttonStatus={buttonStatus}
												/>
											) : (
												<SendRequestButton
													onClick={(_) => sendRequest(patient)}
													buttonStatus={buttonStatus}
												/>
											))}
									</div>
									{/* <ConfirmModal
									title='Confirm Cancel Request'
									description={`Are you sure you want to cancel request to ${patient.name}?`}
									onConfirm={(_) => cancelRequest(patient)}
								/> */}
								</div>
							);
						})}
					</div>
				</MyModal>
				<ConfirmModal
					title='Confirm Cancel Request'
					description={`Are you sure you want to cancel request to ${
						selectedPatient.current?.name ?? "this user"
					}?`}
					onConfirm={(_) => {
						cancelRequest(selectedPatient.current);
					}}
				/>
			</>
		);
	};

	return {
		PatientSearchModal,
		openPatientSearchModal,
		closePatientSearchModal,
		isPatientSearchModalOpen,
		setSearchResult,
	};
};

interface SendRequestButtonProps {
	buttonStatus: ButtonStatus;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

const SendRequestButton: React.FC<SendRequestButtonProps> = ({ buttonStatus, onClick }) => {
	return (
		<button className='pink-button' onClick={onClick} disabled={buttonStatus === ButtonStatus.Disabled}>
			Send Request
		</button>
	);
};

interface CancelRequestButtonProps {
	buttonStatus: ButtonStatus;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

const CancelRequestButton: React.FC<CancelRequestButtonProps> = ({ buttonStatus, onClick }) => {
	return (
		<button className='gray-button' onClick={onClick} disabled={buttonStatus === ButtonStatus.Disabled}>
			Cancel Request
		</button>
	);
};

export default usePatientSearchModal;
