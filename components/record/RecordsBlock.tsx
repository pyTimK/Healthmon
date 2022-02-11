import { useEffect, useState } from "react";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import { Patient } from "../../classes/MyUser";
import { getYYYYMMDD } from "../../function/dateConversions";
import { pulseStatus, spo2Status, tempStatus } from "../../function/healthRanges";
import logError from "../../function/logError";
import notify from "../../function/notify";
import HealthStatus from "../../types/HealthStatus";
import { UserConfig } from "../../types/userConfig";
import Record, { RecordData } from "./Record";
import RecordHeader from "./RecordHeader";
import styles from "./RecordsBlock.module.css";

interface RecordsProps {
	patient: Patient;
	userConfig: UserConfig;
	headerHidden?: boolean;
}

const RecordsBlock: React.FC<RecordsProps> = ({ patient, userConfig, headerHidden = false }) => {
	const [records, setRecords] = useState<RecordData[]>([]);
	const isPresent = getYYYYMMDD(new Date()) === userConfig.date;
	const allNormal = records.every(
		(record) =>
			pulseStatus(record.pulse) === HealthStatus.normal &&
			tempStatus(record.temp) === HealthStatus.normal &&
			spo2Status(record.spo2) === HealthStatus.normal
	);

	const getRecordListener = (id: string) => {
		try {
			const unsub = FireStoreHelper.recordDataListener(id, userConfig.date, setRecords);
			if (unsub) return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
	};

	useEffect(() => {
		return getRecordListener(patient.id);
	}, [patient, userConfig]);

	return (
		<div className={styles.container}>
			{!headerHidden && records.length > 0 && (
				<RecordHeader patient={patient} allNormal={allNormal} isPresent={isPresent} />
			)}
			{records.map((record, i) => (
				<Record
					key={i}
					timestamp={record.timestamp}
					temp={record.temp}
					pulse={record.pulse}
					spo2={record.spo2}
				/>
			))}
		</div>
	);
};

export default RecordsBlock;
