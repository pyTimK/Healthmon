import { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { UserConfig } from "../../../types/userConfig";
import Sizedbox from "../../Sizedbox";
import DropdownPicker from "./dropdownPicker/DropdownPicker";
import styles from "./MyDatePicker.module.css";
import RowPicker from "./rowPicker/RowPicker";

interface MyDatePickerProps {
	userConfig: UserConfig;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({ userConfig }) => {
	const splitDate = userConfig.date.split("-");
	const day = parseInt(splitDate[2]);
	const month = parseInt(splitDate[1]);
	const year = parseInt(splitDate[0]);

	return (
		<div className={styles.container}>
			<DropdownPicker userConfig={userConfig} month={month} year={year} />
			<Sizedbox height={30} />
			<RowPicker userConfig={userConfig} chosenDay={day} month={month} year={year} />
		</div>
	);
};

export default MyDatePicker;
