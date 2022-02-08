import { daysInMonthArray } from "../../../../function/dateConversions";
import { UserConfig } from "../../../../types/userConfig";
import styles from "./RowPicker.module.css";
import RowPickerItem from "./RowPickerItem";
interface RowPickerProps {
	userConfig: UserConfig;
	chosenDay: number;
	month: number;
	year: number;
}

const RowPicker: React.FC<RowPickerProps> = ({ userConfig, chosenDay, month, year }) => {
	return (
		<div className={styles.container}>
			{daysInMonthArray(month, year).map((day, i) => (
				<RowPickerItem day={day} isSelected={day === chosenDay} />
			))}
		</div>
	);
};

export default RowPicker;
