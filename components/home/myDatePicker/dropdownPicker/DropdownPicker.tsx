import { ChevronDown } from "akar-icons";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import DatePicker from "sassy-datepicker";
import { getMonthYearFromStr } from "../../../../function/dateConversions";
import { UserConfig } from "../../../../types/userConfig";
import Overlay from "../../../Overlay/Overlay";
import styles from "./DropdownPicker.module.css";
// const AnimatePresence = dynamic(() => import("framer-motion/types").then((mod)=>mod.AnimatePresence), { ssr: false });

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
		<motion.div className={styles.container}>
			<div className={styles.monthYearButtonContainer} onClick={toggleIsPickingDate}>
				<p className='unselectable'>{getMonthYearFromStr(month, year)}</p>
				<ChevronDown size={16} />
			</div>
			<AnimatePresence>
				{isPickingDate && (
					<div className={styles.datePickerContainer}>
						<motion.div
							key='datePicker'
							animate={{
								height: "fit-content",
							}}
							initial={{ height: 0 }}
							exit={{ height: 0, transition: { duration: 0.1 } }}
							className={clsx(styles.datePickerWrapper, "unselectable")}>
							<DatePicker selected={new Date(userConfig.date)} onChange={changeDate} />
						</motion.div>
						<Overlay opacity={0.6} onClick={toggleIsPickingDate} />
					</div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default DropdownPicker;
