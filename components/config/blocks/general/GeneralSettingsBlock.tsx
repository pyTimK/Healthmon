import MyUser from "../../../../classes/MyUser";
import isConnectedToDevice from "../../../../function/isConnectedToDevice";
import AddOption from "../../options/addOption/AddOption";
import SettingsBlock from "../../settingsBlock/SettingsBlock";
import SettingsRow from "../../settingsRow/SettingsRow";
import ScanFromFile from "./scanFromFile/ScanFromFile";
import useGeneralSettingsBlock from "./useGeneralSettingsBlock";

interface GeneralSettingsBlockProps {
	user?: MyUser;
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
				<SettingsRow
					title='Pair Healthmon Device'
					subtitle={user && isConnectedToDevice(user) ? "Connected" : undefined}>
					<AddOption
						isAdd={!user || !isConnectedToDevice(user)}
						addCallback={openPickTypeOfScanModal}
						removeCallback={unpairDevice}
					/>
				</SettingsRow>
			</SettingsBlock>

			{user && (
				<>
					<PickTypeOfScanModal onFileIconClick={scanFromFile} onCameraIconClick={openScanFromCamModal} />
					<ScanFromCamModal onSuccessScan={onSuccessScan} />
					<CodeInputModal />
					<ScanFromFile onSuccessScan={onSuccessScan} qrFromFileRef={qrFromFileRef} />
				</>
			)}
		</>
	);
};

export default GeneralSettingsBlock;
