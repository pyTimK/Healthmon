import { AnimateSharedLayout } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { constructEmptyBaseUser, Patient, Role } from "../../classes/MyUser";
import { getYYYYMMDD } from "../../function/dateConversions";
import { pulseStatus, spo2Status, tempStatus } from "../../function/healthRanges";
import logError from "../../function/logError";
import notify from "../../function/notify";
import { AppContext } from "../../pages/_app";
import HealthStatus from "../../types/HealthStatus";
import UserComment from "../../types/RecordComment";
import Record, { RecordData, RecordMetaData } from "./Record";
import RecordHeader from "./RecordHeader";
import styles from "./RecordsBlock.module.css";

export const RecordBlockContext = React.createContext({
	userCommentsOnPatient: [] as UserComment[],
	patient: constructEmptyBaseUser<Patient>(),
});

interface RecordsBlockProps {
	patient: Patient;
	headerHidden?: boolean;
	groupedCommentsBasedOnPatient?: {
		[key: string]: UserComment[];
	};
}

const RecordsBlock: React.FC<RecordsBlockProps> = ({
	patient,
	headerHidden = false,
	groupedCommentsBasedOnPatient,
}) => {
	const { userConfig, fireStoreHelper } = useContext(AppContext);
	let userCommentsOnPatient: UserComment[] = [];

	if (userConfig.role === Role.HealthWorker && groupedCommentsBasedOnPatient) {
		userCommentsOnPatient = groupedCommentsBasedOnPatient[patient.id] ?? [];
	}

	const [selectedRecord, setSelectedRecord] = useState<number>(-1);
	const [records, setRecords] = useState<RecordData[]>([]);
	const [recordsMetaData, setRecordsMetaData] = useState<RecordMetaData[]>([]);
	const isPresent = getYYYYMMDD(new Date()) === userConfig.date;
	const allNormal = records.every(
		(record) =>
			pulseStatus(record.pulse) === HealthStatus.normal &&
			tempStatus(record.temp) === HealthStatus.normal &&
			spo2Status(record.spo2) === HealthStatus.normal
	);

	const getRecordListener = (id: string) => {
		if (!fireStoreHelper) return;

		try {
			const unsub = fireStoreHelper.recordDataListener(id, userConfig.date, setRecords, setRecordsMetaData);
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
		<RecordBlockContext.Provider value={{ userCommentsOnPatient, patient }}>
			<div className={styles.container}>
				{!headerHidden && records.length > 0 && (
					<RecordHeader patient={patient} allNormal={allNormal} isPresent={isPresent} />
				)}
				<AnimateSharedLayout>
					{records.length === recordsMetaData.length &&
						records.map((record, i) => {
							return (
								<Record
									key={i}
									record={record}
									index={i}
									showCommentButtons={selectedRecord === i}
									setSelectedRecord={setSelectedRecord}
									recordMetaData={recordsMetaData[i]}
								/>
							);
						})}
				</AnimateSharedLayout>
			</div>
		</RecordBlockContext.Provider>
	);
};

export default RecordsBlock;
