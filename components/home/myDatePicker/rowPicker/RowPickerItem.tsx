import clsx from "clsx";
import styles from "./RowPickerItem.module.css";

interface RowPickerItemProps {
	day: number;
	weekday?: string;
	isSelected: boolean;
}

const RowPickerItem: React.FC<RowPickerItemProps> = ({ day, weekday = "Tue", isSelected }) => {
	return (
		<div className={clsx(styles.container, isSelected && styles.selectedContainer)}>
			<div className={styles.container2}>
				<div className={clsx(styles.numberWrapper, isSelected && styles.selectedNumberWrapper)}>
					<p>{day}</p>
				</div>
				<p>{weekday}</p>
			</div>
		</div>
	);
};

export default RowPickerItem;
