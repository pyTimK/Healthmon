import { useRef, useState } from "react";
import { FireStoreHelper } from "../../../../classes/FireStoreHelper";
import MyUser from "../../../../classes/MyUser";
import logError from "../../../../function/logError";
import notify from "../../../../function/notify";
import useCodeInputModal from "./codeInputModal/useCodeInputModal";
import usePickTypeOfScanModal from "./pickTypeOfScanModal/usePickTypeOfScanModal";
import useScanFromCamModal from "./scanFromCamModal/useScanFromCamModal";

const useGeneralSettingsBlock = (user: MyUser) => {
	const [parsedQR, setParsedQR] = useState<string | null>("");

	const [PickTypeOfScanModal, openPickTypeOfScanModal, closePickTypeOfScanModal, isPickTypeOfScanModalOpen] =
		usePickTypeOfScanModal();

	const [ScanFromCamModal, openScanFromCamModal, closeScanFromCamModal, isScanFromCamModalOpen] =
		useScanFromCamModal();

	const [CodeInputModal, openCodeInputModal, closeCodeInputModal, isCodeInputModalOpen] = useCodeInputModal(
		user,
		parsedQR,
		setParsedQR
	);

	//! FILE SCAN --------------------------------
	const qrFromFileRef = useRef<QrReader | null>(null);
	const scanFromFile = () => {
		try {
			qrFromFileRef.current?.openImageDialog();
		} catch (_e) {
			console.log(_e);
		}
	};

	const onSuccessScan = async (qr: string) => {
		try {
			await FireStoreHelper.askPairDevice(qr, user);
		} catch (_e) {
			logError(_e);
			notify("No Healthmon device associated with qr code");
			return;
		}
		setParsedQR(qr);
		openCodeInputModal();
		closePickTypeOfScanModal();
	};

	//! UNPAIRING --------------------------------
	const unpairDevice = async () => {
		if (user.device === "") return;

		try {
			await FireStoreHelper.unPairDevice(user, user.device);
			user!.device = "";
			setParsedQR(null);
			notify("Device disconnected", { type: "warning" });
		} catch (_e) {
			logError(_e);
			notify("Failed to unpair device");
		}
	};

	return {
		parsedQR,
		PickTypeOfScanModal,
		openPickTypeOfScanModal,
		closePickTypeOfScanModal,
		isPickTypeOfScanModalOpen,
		ScanFromCamModal,
		openScanFromCamModal,
		closeScanFromCamModal,
		isScanFromCamModalOpen,
		CodeInputModal,
		openCodeInputModal,
		closeCodeInputModal,
		isCodeInputModalOpen,
		qrFromFileRef,
		scanFromFile,
		onSuccessScan,
		unpairDevice,
	};
};

export default useGeneralSettingsBlock;
