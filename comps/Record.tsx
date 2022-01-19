import { ReactElement } from "react";
import styles from "../styles/Record.module.css";

const Record: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.time}>8:00</div>
      <div className={styles.data}>
        <Data measurement='36.7' units=' °C' name='Temp' />
        <Data measurement='74' units='BPM' name='PR' />
        <Data
          measurement='96'
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
