import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { CookiesHelper } from "../../../../classes/CookiesHelper";
import { FireStoreHelper } from "../../../../classes/FireStoreHelper";
import MyUser from "../../../../classes/MyUser";
import { db } from "../../../../firebase/initFirebase";
import isConnectedToDevice from "../../../../function/isConnectedToDevice";
import logError from "../../../../function/logError";
import notify from "../../../../function/notify";
import DeviceData from "../../../../types/DeviceData";
import AddOption from "../../options/addOption/AddOption";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import useCodeInputModal from "./codeInputModal/useCodeInputModal";
import usePickTypeOfScanModal from "./pickTypeOfScanModal/usePickTypeOfScanModal";
import useScanFromCamModal from "./scanFromCamModal/useScanFromCamModal";
import ScanFromFile from "./scanFromFile/ScanFromFile";
import useGeneralSettingsBlock from "./useGeneralSettingsBlock";

interface GeneralSettingsBlockProps {
	user: MyUser;
}

const GeneralSettingsBlock: React.FC<GeneralSettingsBlockProps> = ({ user }) => {
	const {
		openPickTypeOfScanModal,
		unpairDevice,
		PickTypeOfScanModal,
		scanFromFile,
		openScanFromCamModal,
		ScanFromCamModal,
		onSuccessScan,
		CodeInputModal,
		qrFromFileRef,
	} = useGeneralSettingsBlock(user);

	return (
		<>
			<SettingsBlock hint='General'>
				<SettingsRow title='Pair Healthmon Device' subtitle={isConnectedToDevice() ? "Connected" : undefined}>
					<AddOption
						isAdd={!isConnectedToDevice()}
						addCallback={openPickTypeOfScanModal}
						removeCallback={unpairDevice}
					/>
				</SettingsRow>
			</SettingsBlock>

			<PickTypeOfScanModal onFileIconClick={scanFromFile} onCameraIconClick={openScanFromCamModal} />
			<ScanFromCamModal onSuccessScan={onSuccessScan} />
			<CodeInputModal />
			<ScanFromFile onSuccessScan={onSuccessScan} qrFromFileRef={qrFromFileRef} />
		</>
	);
};

export default GeneralSettingsBlock;
