import { Search } from "akar-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import MyUser from "../../../../../classes/MyUser";
import { db } from "../../../../../firebase/initFirebase";
import notify from "../../../../../function/notify";
import Patient from "../../../../../types/Patient";
import useMyModal from "../../../../myModal/useMyModal";
import Sizedbox from "../../../../Sizedbox";
import UserOverview from "../../../../userOverview/UserOverview";
import styles from "./PatientSearchModal.module.css";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

interface PatientSearchModalProps {}

const usePatientSearchModal = () => {
	const [MyModal, openPatientSearchModal, closePatientSearchModal, isPatientSearchModalOpen] = useMyModal();
	const [searchResult, setSearchResult] = useState<Patient[]>([]);
	const patientNumInputRef = useRef<HTMLInputElement>(null);

	const searchPatient = async () => {
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
			newSearchResult.push({ name: user.name, number: user.number, photoURL: user.photoURL });
		});
		if (newSearchResult.length === 0) {
			notify("No patient found");
		}
		setSearchResult(newSearchResult);
	};

	const PatientSearchModal: React.FC<PatientSearchModalProps> = ({}) => {
		return (
			<MyModal>
				<div className={styles.section}>
					<h1 className={styles.title}>Add Patient</h1>
					<Sizedbox height={30} />
					<div className={styles.inputRow}>
						<input ref={patientNumInputRef} className={styles.input} type='text' placeholder='Search...' />
						<div className={styles.SearchIconWrapper} onClick={searchPatient}>
							<Search size={16} strokeWidth={4} color='var(--background-light)' />
						</div>
					</div>
					<p>Please Enter patient&#39;s phone number</p>
					{searchResult.map((patient, _i) => {
						console.log("wa", patient);
						return (
							<div className={styles.resultRow}>
								<UserOverview
									key={_i}
									name={patient.name}
									number={patient.number}
									photoURL={patient.photoURL}
								/>
								<button className='pink-button'>Send Request</button>
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
