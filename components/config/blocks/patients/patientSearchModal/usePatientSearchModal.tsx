import { Search } from "akar-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import dynamic from "next/dynamic";
import { FormEventHandler, useRef, useState } from "react";
import { FireStoreHelper } from "../../../../../classes/FireStoreHelper";
import MyUser from "../../../../../classes/MyUser";
import ButtonStatus from "../../../../../enums/ButtonStatus";
import { db } from "../../../../../firebase/initFirebase";
import logError from "../../../../../function/logError";
import notify from "../../../../../function/notify";
import Patient from "../../../../../types/Patient";
import useMyModal from "../../../../myModal/useMyModal";
import Sizedbox from "../../../../Sizedbox";
import UserOverview from "../../../../userOverview/UserOverview";
import styles from "./PatientSearchModal.module.css";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

interface PatientSearchModalProps {}

const usePatientSearchModal = (user: MyUser) => {
	const [MyModal, openPatientSearchModal, closePatientSearchModal, isPatientSearchModalOpen] = useMyModal();
	const [searchResult, setSearchResult] = useState<Patient[]>([]);
	const patientNumInputRef = useRef<HTMLInputElement>(null);
	const [sendRequestButtonStatus, setSendRequestButtonStatus] = useState(ButtonStatus.Enabled);

	const searchPatient: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!patientNumInputRef.current) return;

		if (!patientNumInputRef.current.value) {
			notify("Please enter a phone number", { type: "info" });
			return;
		}
		const q = query(collection(db, "users"), where("number", "==", patientNumInputRef.current.value));
		const snapshot = await getDocs(q);
		const newSearchResult: Patient[] = [];
		snapshot.forEach((doc) => {
			const user = doc.data() as MyUser;
			newSearchResult.push({ id: user.id, name: user.name, number: user.number, photoURL: user.photoURL });
		});
		if (newSearchResult.length === 0) {
			notify("No patient found");
		}
		setSearchResult(newSearchResult);
	};

	const send_request = async (patientID: string) => {
		setSendRequestButtonStatus(ButtonStatus.Disabled);
		try {
			await FireStoreHelper.sendMonitorRequest(patientID, user.id);
			notify("Request Sent", { type: "success" });
		} catch (_e) {
			logError(_e);
			notify("Can't send request right now");
		}
		setSendRequestButtonStatus(ButtonStatus.Enabled);
	};

	const PatientSearchModal: React.FC<PatientSearchModalProps> = ({}) => {
		return (
			<MyModal>
				<div className={styles.section}>
					<h1 className={styles.title}>Add Patient</h1>
					<Sizedbox height={30} />
					<form className={styles.inputRow} onSubmit={searchPatient}>
						<input ref={patientNumInputRef} className={styles.input} type='text' placeholder='Search...' />
						<button type='submit' className={styles.SearchIconButton}>
							<Search size={16} strokeWidth={4} color='var(--background-light)' />
						</button>
					</form>
					<p>Please Enter patient&#39;s phone number</p>
					{searchResult.map((patient, _i) => {
						return (
							<div key={_i} className={styles.resultRow}>
								<UserOverview name={patient.name} number={patient.number} photoURL={patient.photoURL} />
								<button
									className='pink-button'
									onClick={(_) => send_request(patient.id)}
									disabled={sendRequestButtonStatus === ButtonStatus.Disabled}>
									Send Request
								</button>
							</div>
						);
					})}
				</div>
			</MyModal>
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

export default usePatientSearchModal;
