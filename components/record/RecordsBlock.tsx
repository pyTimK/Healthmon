import { useEffect, useState } from "react";
import { FireStoreHelper } from "../../classes/FireStoreHelper";
import MyUser from "../../classes/MyUser";
import logError from "../../function/logError";
import notify from "../../function/notify";
import Record, { RecordData } from "./Record";
import styles from "./RecordsBlock.module.css";

interface RecordsProps {
	user: MyUser;
}

const RecordsBlock: React.FC<RecordsProps> = ({ user }) => {
	const [records, setRecords] = useState<RecordData[]>([]);

	const getRecordListener = (id: string) => {
		try {
			const unsub = FireStoreHelper.recordDataListener(id, setRecords);
			return () => unsub();
		} catch (_e) {
			logError(_e);
			notify("Could not get records online");
		}
	};

	useEffect(() => {
		return getRecordListener(user.id);
	}, [user]);

	return (
		<div className={styles.container}>
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
