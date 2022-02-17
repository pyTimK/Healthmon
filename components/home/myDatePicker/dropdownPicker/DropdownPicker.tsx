import { ChevronDown } from "akar-icons";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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

	useEffect(() => {
		console.log("blah");
	}, []);

	return (
		<motion.div className={styles.container}>
			<div className={styles.monthYearButtonContainer} onClick={toggleIsPickingDate}>
				<p className='unselectable'>{getMonthYearFromStr(month, year)}</p>
				<ChevronDown size={16} />
			</div>
			<AnimatePresence>
				{isPickingDate && (
					<div>
						<motion.div
							key='datePicker'
							animate={{ height: "fit-content" }}
							initial={{ height: 0 }}
							exit={{ height: 0, transition: { duration: 0.1 } }}
							className={clsx(styles.datePickerWrapper, "unselectable")}>
							<DatePicker selected={new Date(userConfig.date)} onChange={changeDate} />
						</motion.div>
						<Overlay onClick={toggleIsPickingDate} />
					</div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default DropdownPicker;
