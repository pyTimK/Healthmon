import { Search } from "akar-icons";
import dynamic from "next/dynamic";
import { useRef } from "react";
import MyModalSection from "../../../../myModal/myModalSection/MyModalSection";
import useMyModal from "../../../../myModal/useMyModal";
import Sizedbox from "../../../../Sizedbox";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });
import styles from "./PatientSearchModal.module.css";

interface PatientSearchModalProps {}

type usePatientSearchModal = () => [React.FC<PatientSearchModalProps>, () => void, () => void, boolean];

const usePatientSearchModal: usePatientSearchModal = () => {
	const [MyModal, openPatientSearchModal, closePatientSearchModal, isPatientSearchModalOpen] = useMyModal();
	const patientNumInputRef = useRef<HTMLInputElement>(null);

	const PatientSearchModal: React.FC<PatientSearchModalProps> = ({}) => {
		return (
			<MyModal>
				<div className={styles.section}>
					<h1 className={styles.title}>Add Patient</h1>
					<Sizedbox height={30} />
					<div className={styles.inputRow}>
						<input className={styles.input} type='text' placeholder='Search...' />
						<div className={styles.SearchIconWrapper}>
							<Search size={16} strokeWidth={4} color='var(--background-light)' />
						</div>
					</div>
					<p>Please Enter patient&quot;s phone number</p>
				</div>
				{/* <MyModalSection description="Please Enter patient's phone number"></MyModalSection> */}
			</MyModal>
		);
	};

	return [PatientSearchModal, openPatientSearchModal, closePatientSearchModal, isPatientSearchModalOpen];
};

export default usePatientSearchModal;
