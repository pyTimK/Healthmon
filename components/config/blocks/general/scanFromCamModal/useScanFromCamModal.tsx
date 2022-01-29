import dynamic from "next/dynamic";
import logError from "../../../../../function/logError";
import MyModalSection from "../../../../myModal/myModalSection/MyModalSection";
import useMyModal from "../../../../myModal/useMyModal";
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });
// import styles from "./ScanFromCamModal.module.css";

interface ScanFromCamModalProps {
	onSuccessScan: (qr: string) => Promise<void>;
}

type useScanFromCamModal = () => [React.FC<ScanFromCamModalProps>, () => void, () => void, boolean];

const useScanFromCamModal: useScanFromCamModal = () => {
	const [MyModal, openScanFromCamModal, closeScanFromCamModal, isScanFromCamModalOpen] = useMyModal();

	const ScanFromCamModal: React.FC<ScanFromCamModalProps> = ({ onSuccessScan }) => {
		const handleCamScan = (qrdata: string | null) => {
			if (!qrdata) return;
			onSuccessScan(qrdata);
			closeScanFromCamModal();
		};

		return (
			<MyModal>
				<MyModalSection description='Place QR Code inside the red box'>
					<QrReader delay={3000} onError={logError} onScan={handleCamScan} style={{ width: "100%" }} />
				</MyModalSection>
			</MyModal>
		);
	};

	return [ScanFromCamModal, openScanFromCamModal, closeScanFromCamModal, isScanFromCamModalOpen];
};

export default useScanFromCamModal;
