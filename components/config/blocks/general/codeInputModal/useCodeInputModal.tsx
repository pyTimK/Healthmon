import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Dispatch, FormEventHandler, SetStateAction, useRef } from "react";
import { CookiesHelper } from "../../../../../classes/CookiesHelper";
import MyUser from "../../../../../classes/MyUser";
import { db } from "../../../../../firebase/initFirebase";
import notify from "../../../../../functions/notify";
import AuthenticateData from "../../../../../types/AuthenticateData";
import DeviceData from "../../../../../types/DeviceData";
import useMyModal from "../../../../myModal/useMyModal";
import styles from "./CodeInputModal.module.css";
import dynamic from "next/dynamic";
import { ReactCodeInputProps } from "react-code-input";
import Sizedbox from "../../../../Sizedbox";
import { FireStoreHelper } from "../../../../../classes/FireStoreHelper";
import logError from "../../../../../functions/logError";
const ReactCodeInput = dynamic(import("react-code-input"));

interface CodeInputModalProps {}

type UseCodeInputModal = (
	user: MyUser,
	parsedQR: string | null,
	setParsedQR: Dispatch<SetStateAction<string | null>>
) => [React.FC<CodeInputModalProps>, () => void, () => void, boolean];

// Responsible for pairing up user to device
const useCodeInputModal: UseCodeInputModal = (user, parsedQR, setParsedQR) => {
	const [MyModal, openCodeInputModal, closeCodeInputModal, isCodeInputModalOpen] = useMyModal();

	const submitCode = async (inputCode: string) => {
		if (!parsedQR) return;

		const authenticateDoc = await getDoc(doc(db, "authenticate", parsedQR));
		const deviceData = authenticateDoc.data() as AuthenticateData;

		//* Wrong code
		if (deviceData.code.toString() !== inputCode) {
			notify("Code did not match");
			setParsedQR(null);
			closeCodeInputModal();
			return;
		}

		//* Pair in Firestore and save to cookies device
		try {
			await FireStoreHelper.pairDevice(user, parsedQR);
			CookiesHelper.set("deviceid", parsedQR);
			notify("Successfully linked device", { type: "success" });
		} catch (_e) {
			logError(_e);
			notify("Pair failed");
		}
		closeCodeInputModal();
	};

	const handleCodeInputChange = (inputCode: string) => {
		if (inputCode.length === 6) submitCode(inputCode);
	};

	const CodeInputModal: React.FC<CodeInputModalProps> = () => (
		<MyModal flexColumn>
			<h1 className={styles.title}>Verification</h1>
			<p className={styles.description}>Please enter the code sent to your device</p>
			<ReactCodeInput
				type='number'
				fields={6}
				name='a'
				// {...props}
				className={styles.reactCodeInput}
				inputMode='numeric'
				onChange={handleCodeInputChange}
			/>
			<Sizedbox height={50} />
		</MyModal>
	);

	return [CodeInputModal, openCodeInputModal, closeCodeInputModal, isCodeInputModalOpen];
};

// const props: Partial<ReactCodeInputProps> = {
// 	inputStyleInvalid: {
// 		fontFamily: "monospace",
// 		margin: "4px",
// 		width: "15px",
// 		borderRadius: "3px",
// 		fontSize: "14px",
// 		height: "26px",
// 		paddingLeft: "7px",
// 		backgroundColor: "black",
// 		color: "red",
// 		border: "1px solid red",
// 	},
// };

export default useCodeInputModal;
