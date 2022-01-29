import { MutableRefObject, useRef } from "react";
import logError from "../../../../../function/logError";
import notify from "../../../../../function/notify";
import styles from "./ScanFromFile.module.css";

if (typeof window != "undefined") {
	var QrReaderFile = require("react-qr-reader");
}

interface ScanFromFileProps {
	onSuccessScan: (qr: string) => Promise<void>;
	qrFromFileRef: MutableRefObject<QrReader | null>;
}

const ScanFromFile: React.FC<ScanFromFileProps> = ({ onSuccessScan, qrFromFileRef }) => {
	const handleFileScan = (qrdata: string | null) => {
		if (!qrdata) {
			notify("Cannot read qr code");
			return;
		}

		onSuccessScan(qrdata);
	};

	return (
		<>
			{typeof window != "undefined" && (
				<QrReaderFile
					legacyMode
					showViewFinder={false}
					className={styles.qrfilereader}
					// delay={300}
					ref={qrFromFileRef}
					onError={logError}
					onScan={handleFileScan}
					style={{ width: "100%" }}
				/>
			)}
		</>
	);
};

export default ScanFromFile;
