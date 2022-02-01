import { doc, getDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import { FireStoreHelper } from "../../../../../classes/FireStoreHelper";
import MyUser from "../../../../../classes/MyUser";
import { db } from "../../../../../firebase/initFirebase";
import logError from "../../../../../function/logError";
import notify from "../../../../../function/notify";
import AuthenticateData from "../../../../../types/AuthenticateData";
import useMyModal from "../../../../myModal/useMyModal";
import Sizedbox from "../../../../Sizedbox";
import styles from "./CodeInputModal.module.css";
const ReactCodeInput = dynamic(import("react-code-input"));

interface CodeInputModalProps {}

type UseCodeInputModal = (
	user: MyUser,
	parsedQR: string | null,
	setParsedQR: Dispatch<SetStateAction<string | null>>
) => [React.FC<CodeInputModalProps>, () => void, () => void, boolean];

//* Responsible for pairing up user to device
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

		//* Pair in Firestore
		try {
			await FireStoreHelper.pairDevice(user, parsedQR);
			user.device = parsedQR;
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
