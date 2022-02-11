import { ReactElement } from "react";
import styles from "./Record.module.css";
import firebase from "firebase/compat/app";
import { getHHMMSS } from "../../function/dateConversions";
import HealthStatus from "../../types/HealthStatus";
import clsx from "clsx";
import { pulseStatus, spo2Status, tempStatus } from "../../function/healthRanges";

export interface RecordData {
	temp: number;
	pulse: number;
	spo2: number;
	timestamp: firebase.firestore.Timestamp;
}

export interface Props {
	temp: number;
	pulse: number;
	spo2: number;
	timestamp: firebase.firestore.Timestamp;
}

const Record: React.FC<Props> = ({ temp, pulse, spo2, timestamp }) => {
	return (
		<div className={styles.container}>
			<div className={styles.time}>{getHHMMSS(timestamp.toDate())}</div>
			<div className={styles.data}>
				<Data
					measurement={temp.toFixed(1)}
					units=' °C'
					name='Temp'
					imgName='thermometer'
					status={tempStatus(temp)}
				/>
				<Data
					measurement={Math.floor(pulse).toString()}
					units='BPM'
					name='PR'
					imgName='heartbeat'
					status={pulseStatus(pulse)}
				/>
				<Data
					measurement={Math.floor(spo2).toString()}
					units='%'
					name={
						<>
							SpO<sub>2</sub>
						</>
					}
					imgName='blood'
					status={spo2Status(spo2)}
				/>
			</div>
		</div>
	);
};

interface DataProps {
	measurement: string;
	imgName: string;
	units: string | ReactElement;
	name: string | ReactElement;
	status?: HealthStatus;
}

const Data: React.FC<DataProps> = ({ measurement, units, name, imgName, status = HealthStatus.normal }) => {
	let colorStyle: string;
	switch (status) {
		case HealthStatus.belowNormal:
			colorStyle = styles.blue;
			break;

		case HealthStatus.aboveNormal:
			colorStyle = styles.orange;
			break;

		default:
			colorStyle = styles.normal;
			break;
	}

	return (
		<div className={styles.measurement}>
			<img src={`/img/svg/${imgName}.svg`} width={50} height={50} />
			<h2 className={clsx(styles.number, colorStyle)}>
				{measurement} {units}
			</h2>
			{/* <p>{name}</p> */}
		</div>
	);
};

export default Record;
