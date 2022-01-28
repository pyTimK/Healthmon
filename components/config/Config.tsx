import { Camera, CirclePlusFill, CircleXFill, File } from "akar-icons";
import { doc, FieldValue, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { FormEventHandler, HTMLInputTypeAttribute, ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import { ToastContainer } from "react-toastify";
import { CookiesHelper } from "../../classes/CookiesHelper";
import { db } from "../../firebase/initFirebase";
import notify from "../../functions/notify";
import styles from "./Config.module.css";
import HealthWorker from "../../types/healthWorker";
import MyUser from "../../types/myUser";
import Sizedbox from "../Sizedbox";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });
if (typeof window != "undefined") {
	var QrReaderFile = require("react-qr-reader");
}

const ConfigScreen: NextPage = () => {
	const [user, setUser] = useState(CookiesHelper.get<MyUser>("user", new MyUser()));

	useEffect(() => {
		CookiesHelper.set("user", user);
	}, [user]);

	const [PairDeviceModal, openPairDeviceModal, closePairDeviceModal, isPairDeviceModalOpen] = useModal("__next", {
		preventScroll: true,
	});
	const [ScanQRModal, openScanQRModal, closeScanQRModal, isScanQRModalOpen] = useModal("__next", {
		preventScroll: true,
	});
	const [CodeInputModal, openCodeInputModal, closeCodeInputModal, isCodeInputModalOpen] = useModal("__next", {
		preventScroll: true,
	});
	const [parsedQR, setParsedQR] = useState<string | null>(CookiesHelper.get("deviceid", ""));
	const qrRef = useRef<QrReader | null>(null);
	const codeInputRef = useRef<HTMLInputElement>(null);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const numberInputRef = useRef<HTMLInputElement>(null);
	const healthWorkerInputRef = useRef<HTMLInputElement>(null);
	const healthWorkerNumberInputRef = useRef<HTMLInputElement>(null);
	console.log(parsedQR);

	//TODO REMOVE
	if (user.healthWorkers.length !== 1) {
		setUser((user) => {
			return { ...user, healthWorkers: [{ name: "", number: "" } as HealthWorker] };
		});
	}

	const addHealthWorker = () => {
		setUser((user) => {
			return { ...user, healthWorkers: [...user.healthWorkers, { name: "", number: "" } as HealthWorker] };
		});
	};

	const submitCode: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!codeInputRef.current) return;

		const authenticateDoc = await getDoc(doc(db, "authenticate", parsedQR!));
		const deviceData = authenticateDoc.data() as AuthenticateData;
		if (deviceData.code.toString() !== codeInputRef.current.value) {
			notify("Code did not match");
			setParsedQR(null);
			closeCodeInputModal();
			return;
		}

		const paired = await pairDevice();
		if (!paired) return;

		CookiesHelper.set("deviceid", parsedQR!);
		notify("Successfully linked device", { type: "success" });
		closeCodeInputModal();
	};

	const successScan = async (qr: string) => {
		const res = await askPairDevice(qr);
		if (!res) return;
		setParsedQR(qr);
		openCodeInputModal();
	};

	const handleFileScan = (qrdata: string | null) => {
		// console.log("umabot here");
		if (!qrdata) {
			notify("Cannot read qr code");
			return;
		}

		successScan(qrdata);
	};

	const handleCamScan = (qrdata: string | null) => {
		if (!qrdata) return;
		successScan(qrdata);
		closeScanQRModal();
		closePairDeviceModal();
	};

	const handleScanError = (_e: any) => {
		const e = _e as Error;
		console.error(e);
	};

	const onScanFile = () => {
		try {
			// console.log("WAT", qrRef.curren);
			// console.log(QrReader.contextTypes);
			qrRef.current?.openImageDialog();
			// QrReader.openImageDialog();
			// console.log("umabot here 1");
		} catch (_e) {
			const e = _e as Error;
			console.log(e);
		}
		closePairDeviceModal();
	};

	const onUnpairDevie = () => {
		if (!parsedQR) return;

		notify("Device disconnected", { type: "warning" });
		setParsedQR(null);
		CookiesHelper.set("deviceid", "");
		unPairDevice(parsedQR);
	};

	//? Firestore
	const askPairDevice = async (deviceCode: string) => {
		try {
			await updateDoc(doc(db, "devices", deviceCode), {
				new_name: user.name,
				new_id: user.id,
				new_healthWorkers: user.healthWorkers,
				confirmed: false,
				code: 0,
				request_timestamp: serverTimestamp(),
			} as Partial<DeviceData>);

			return true;
		} catch (_e) {
			console.log(_e);
			notify("Invalid qr code");
			return false;
		}
	};

	const pairDevice = async () => {
		const paired_doc: DeviceData = {
			name: user.name,
			id: user.id,
			healthWorkers: user.healthWorkers,
			new_name: "",
			new_id: "",
			new_healthWorkers: [],
			confirmed: true,
			request_timestamp: serverTimestamp(),
		};
		try {
			await updateDoc(doc(db, "devices", parsedQR!), {
				...paired_doc,
			});

			return true;
		} catch (_e) {
			notify("Pair failed");

			return false;
		}
	};

	const unPairDevice = async (deviceCode: string) => {
		const deviceDoc = await getDoc(doc(db, "devices", parsedQR!));
		const deviceData = deviceDoc.data() as DeviceData;

		if (user.id !== deviceData.id) return;
		const clearedDeviceData = {
			name: "",
			id: "",
			healthWorkers: [],
			new_name: "",
			new_id: "",
			new_healthWorkers: [],
			confirmed: false,
		};
		await updateDoc(doc(db, "devices", deviceCode), clearedDeviceData);
	};

	const updateRecord = async (deviceName: string) => {
		//TODO dont update device info if not connected
		const paired_doc: DeviceData = {
			name: nameInputRef.current?.value ?? user.name,
			id: user.id,
			healthWorkers: [
				{
					name: healthWorkerInputRef.current?.value ?? "",
					number: healthWorkerNumberInputRef.current?.value ?? "",
				} as HealthWorker,
			],
			new_name: "",
			new_id: "",
			new_healthWorkers: [],
			confirmed: false,
			request_timestamp: serverTimestamp(),
		};

		try {
			await updateDoc(doc(db, "devices", deviceName), { ...paired_doc });

			await updateDoc(doc(db, "users", user.id), {
				name: nameInputRef.current?.value ?? user.name,
				healthWorkers: [
					{
						name: healthWorkerInputRef.current?.value ?? "",
						number: healthWorkerNumberInputRef.current?.value ?? "",
					} as HealthWorker,
				],
				id: user.id,
				isPatient: true,
				number: numberInputRef.current?.value ?? "",
			});

			return true;
		} catch (_e) {
			notify("Pair failed");

			return false;
		}
	};

	const goToDashboard = async () => {
		CookiesHelper.set("user", {
			name: nameInputRef.current?.value ?? user.name,
			healthWorkers: [
				{
					name: healthWorkerInputRef.current?.value ?? "",
					number: healthWorkerNumberInputRef.current?.value ?? "",
				} as HealthWorker,
			],
			id: user.id,
			isPatient: true,
			number: numberInputRef.current?.value ?? "",
		} as MyUser);
		await updateRecord("healthmonmikee1");
		// const route = useRouter();
		// route.replace("/");
	};

	return (
		<div>
			<SettingsBlock hint='General'>
				<SettingsRow title='Pair Healthmon Device' subtitle={parsedQR ? "(Connected)" : undefined}>
					<AddOption
						isAdd={CookiesHelper.get("deviceid", "") === ""}
						addCallback={openPairDeviceModal}
						removeCallback={onUnpairDevie}
					/>
				</SettingsRow>
			</SettingsBlock>

			<SettingsBlock hint='Personal Details'>
				<SettingsRow title='Name'>
					<InputOption inputRef={nameInputRef} defaultValue={user.name} />
				</SettingsRow>
				<SettingsRow title='Phone'>
					<InputOption inputRef={numberInputRef} defaultValue={user.number} />
				</SettingsRow>
			</SettingsBlock>

			<Sizedbox height={40} />
			<div className={styles.block}>
				<h5 className={styles.hint}>Health Worker</h5>
				{/* <CirclePlusFill size={24} color='var(--pink)' cursor='pointer' onClick={addHealthWorker} /> */}
				{user.healthWorkers.map((healthWorker, _i) => {
					return (
						<div key={_i}>
							<div className={styles.item}>
								<h3 className={styles.itemtext}>Name</h3>
								<div className={styles.option}>
									<input
										ref={healthWorkerInputRef}
										type='text'
										defaultValue={user.healthWorkers[0].name}
									/>
								</div>
							</div>
							<Sizedbox height={20} />
							<div className={styles.item}>
								<h3 className={styles.itemtext}>Phone</h3>
								<div className={styles.option}>
									<input
										ref={healthWorkerNumberInputRef}
										type='text'
										defaultValue={user.healthWorkers[0].number}
									/>
								</div>
							</div>
							<Sizedbox height={20} />
						</div>
					);
				})}
			</div>

			<SettingsBlock hint='Personal Details'>
				<SettingsRow title='Name'>
					<InputOption inputRef={nameInputRef} defaultValue={user.name} />
				</SettingsRow>
				<SettingsRow title='Phone'>
					<InputOption inputRef={numberInputRef} defaultValue={user.number} />
				</SettingsRow>
			</SettingsBlock>

			<button onClick={goToDashboard}>Proceed</button>
			{/* PAIR MODAL */}
			<PairDeviceModal>
				<div className={styles.modal}>
					<div className={styles.modalLeft} onClick={onScanFile}>
						<File className={styles.svg} size={"10vw"} strokeWidth={1} />
						<p className={styles.modalTxt}>From image file</p>
					</div>
					<div className={styles.modalRight} onClick={openScanQRModal}>
						<Camera className={styles.svg} size={"10vw"} strokeWidth={1} />
						<p className={styles.modalTxt}>Use camera</p>
					</div>
				</div>
			</PairDeviceModal>
			{/* SCAN QR MODAL */}
			<ScanQRModal>
				<div className={styles.modal}>
					<div className={styles.modalLeft}>
						{isScanQRModalOpen && (
							<QrReader
								delay={3000}
								onError={handleScanError}
								onScan={handleCamScan}
								style={{ width: "100%" }}
							/>
						)}
						<p className={styles.modalTxt}>Place QR Code inside the red box</p>
					</div>
				</div>
			</ScanQRModal>
			{/* CODE INPUT MODAL */}
			<CodeInputModal>
				<div className={styles.modal}>
					<div className={styles.modalLeft}>
						<p className={styles.modalTxt}>Please enter the code sent to your device</p>
						<form onSubmit={submitCode}>
							<input ref={codeInputRef} required type='text' name='code' placeholder='Input code...' />
							<input type='submit' value='Submit' />
						</form>
					</div>
				</div>
			</CodeInputModal>
			{/* QR READER */}
			{typeof window != "undefined" && (
				<QrReaderFile
					legacyMode
					showViewFinder={false}
					className={styles.qrfilereader}
					// delay={300}
					ref={qrRef}
					onError={handleScanError}
					onScan={handleFileScan}
					style={{ width: "100%" }}
				/>
			)}
			<ToastContainer theme='colored' autoClose={2} />
		</div>
	);
};

interface InputOptionProps {
	inputRef: RefObject<HTMLInputElement>;
	type?: HTMLInputTypeAttribute;
	defaultValue?: string;
}

const InputOption: React.FC<InputOptionProps> = ({ inputRef, type = "text", defaultValue }) => {
	return (
		<div className={styles.option}>
			<input ref={inputRef} type={type} defaultValue={defaultValue} />
		</div>
	);
};

interface AddOptionProps {
	isAdd: boolean;
	addCallback: () => void;
	removeCallback: () => void;
}

const AddOption: React.FC<AddOptionProps> = ({ isAdd, addCallback, removeCallback }) => {
	return (
		<div className={styles.option}>
			{isAdd ? (
				<CirclePlusFill size={24} color='var(--pink)' cursor='pointer' onClick={addCallback} />
			) : (
				<CircleXFill size={24} color='var(--red)' cursor='pointer' onClick={removeCallback} />
			)}
		</div>
	);
};
interface SettingsBlockProps {
	hint: string;
}

const SettingsBlock: React.FC<SettingsBlockProps> = ({ hint, children }) => {
	return (
		<div className={styles.block}>
			<Sizedbox height={40} />
			<h5 className={styles.blockHint}>{hint}</h5>
			{children}
		</div>
	);
};

interface SettingsRowProps {
	title: string;
	subtitle?: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ title, subtitle, children }) => {
	return (
		<div className={styles.row}>
			<h3 className={styles.rowTitle}>{title}</h3>
			{subtitle && <p className={styles.rowSubTitle}> (Connected)</p>}
			{children}
		</div>
	);
};

export default ConfigScreen;
export interface DeviceData {
	name: string;
	id: string;
	healthWorkers: HealthWorker[];
	new_name: string;
	new_id: string;
	new_healthWorkers: HealthWorker[];
	confirmed: boolean;
	request_timestamp: FieldValue;
}

export interface AuthenticateData {
	code: number;
}
