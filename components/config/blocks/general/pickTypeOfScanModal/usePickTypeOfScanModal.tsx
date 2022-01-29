import { Camera, File } from "akar-icons";
import MyModalSection from "../../../../myModal/myModalSection/MyModalSection";
import useMyModal from "../../../../myModal/useMyModal";
import styles from "./PickTypeOfScanModal.module.css";

interface PickTypeOfScanModalProps {
	onFileIconClick: () => void;
	onCameraIconClick: () => void;
}

type UsePickTypeOfScanModal = () => [React.FC<PickTypeOfScanModalProps>, () => void, () => void, boolean];

const usePickTypeOfScanModal: UsePickTypeOfScanModal = () => {
	const [MyModal, openPickTypeOfScanModal, closePickTypeOfScanModal, isPickTypeOfScanModalOpen] = useMyModal();

	const PickTypeOfScanModal: React.FC<PickTypeOfScanModalProps> = ({ onFileIconClick, onCameraIconClick }) => (
		<MyModal>
			<MyModalSection onClick={onFileIconClick} description='From image file' highlightOnHover>
				<File className={styles.svg} size={"10vw"} strokeWidth={1} />
			</MyModalSection>

			<MyModalSection onClick={onCameraIconClick} description='Use camera' highlightOnHover>
				<Camera className={styles.svg} size={"10vw"} strokeWidth={1} />
			</MyModalSection>
		</MyModal>
	);

	return [PickTypeOfScanModal, openPickTypeOfScanModal, closePickTypeOfScanModal, isPickTypeOfScanModalOpen];
};

export default usePickTypeOfScanModal;
