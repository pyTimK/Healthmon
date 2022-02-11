import { recordHeaderDescriptions } from "../../classes/Constants";
import { Patient } from "../../classes/MyUser";
import generateRecordDescrip from "../../function/generateRecordDescrip";
import Avatar from "../Avatar";
import styles from "./RecordHeader.module.css";

interface RecordHeadingProps {
	patient: Patient;
	isPresent: boolean;
	allNormal: boolean;
}

const RecordHeader: React.FC<RecordHeadingProps> = ({ patient, isPresent, allNormal }) => {
	return (
		<div className={styles.container}>
			<Avatar letter={patient.name} nonclickable photoURL={patient.photoURL} />
			<div className={styles.descriptionWrapper}>
				<p className={styles.description}>
					{patient.name} {generateRecordDescrip(isPresent, allNormal)}
				</p>
			</div>
		</div>
	);
};

export default RecordHeader;
