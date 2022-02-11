import { ChevronDown } from "akar-icons";
import clsx from "clsx";
import { useState } from "react";
import DatePicker from "sassy-datepicker";
import { getMonthYearFromStr } from "../../../../function/dateConversions";
import { UserConfig } from "../../../../types/userConfig";
import Overlay from "../../../Overlay/Overlay";
import styles from "./DropdownPicker.module.css";

interface DropdownPickerProps {
	userConfig: UserConfig;
	month: number; //1 indexed
	year: number;
}

const DropdownPicker: React.FC<DropdownPickerProps> = ({ userConfig, month, year }) => {
	const [isPickingDate, setIsPickingDate] = useState(false);

	const changeDate = (date: Date) => {
		userConfig.updateDate(date);
	};

	const toggleIsPickingDate = () => {
		setIsPickingDate((prevIsPickingDate) => !prevIsPickingDate);
	};

	return (
		<div className={styles.container}>
			<div className={styles.monthYearButtonContainer} onClick={toggleIsPickingDate}>
				<p className='unselectable'>{getMonthYearFromStr(month, year)}</p>
				<ChevronDown size={16} />
			</div>
			{isPickingDate && (
				<div>
					<div className={clsx(styles.datePickerWrapper, "unselectable")}>
						<DatePicker selected={new Date(userConfig.date)} onChange={changeDate} />
					</div>
					<Overlay onClick={toggleIsPickingDate} />
				</div>
			)}
		</div>
	);
};

export default DropdownPicker;
