import clsx from "clsx";
import { MutableRefObject } from "react";
import styles from "./RowPickerItem.module.css";

interface RowPickerItemProps {
	day: number;
	weekday?: string;
	isSelected: boolean;
	selectedDayRef: MutableRefObject<HTMLDivElement | null>;
	onClick: (day: number) => void;
}

const RowPickerItem: React.FC<RowPickerItemProps> = ({ day, weekday = "Tue", isSelected, selectedDayRef, onClick }) => {
	return (
		<div
			ref={isSelected ? selectedDayRef : undefined}
			className={clsx(styles.container, isSelected && styles.selectedContainer)}
			onClick={() => onClick(day)}>
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
