import { ReactElement } from "react";
import styles from "../styles/Record.module.css";
import firebase from "firebase/compat/app";
import { getHHMMSS } from "../myfunctions/dateConversions";

export interface RecordData {
  name: string;
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
        <Data measurement={temp.toFixed(1)} units=' °C' name='Temp' />
        <Data measurement={Math.floor(pulse).toString()} units='BPM' name='PR' />
        <Data
          measurement={Math.floor(spo2).toString()}
          units='%'
          name={
            <>
              SpO<sub>2</sub>
            </>
          }
        />
      </div>
    </div>
  );
};

interface DataProps {
  measurement: string;
  units: string | ReactElement;
  name: string | ReactElement;
}

const Data: React.FC<DataProps> = ({ measurement, units, name }) => {
  return (
    <div className={styles.measurement}>
      <h2>
        {measurement} {units}
      </h2>
      <p>{name}</p>
    </div>
  );
};

export default Record;
