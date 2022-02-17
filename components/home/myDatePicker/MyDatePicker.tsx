import { useContext } from "react";
import { parseUserConfigDate } from "../../../function/dateConversions";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { HomeContext } from "../../../pages/home";
import Sizedbox from "../../Sizedbox";
import styles from "./MyDatePicker.module.css";
import RowPicker from "./rowPicker/RowPicker";

interface MyDatePickerProps {}

const MyDatePicker: React.FC<MyDatePickerProps> = () => {
	const { userConfig } = useContext(HomeContext);
	const { isSmartphone } = useWindowDimensions();
	const { day, month, year } = parseUserConfigDate(userConfig.date);

	return (
		<div className={styles.container}>
			<Sizedbox height={isSmartphone ? 10 : 30} />
			<RowPicker userConfig={userConfig} chosenDay={day} month={month} year={year} />
		</div>
	);
};

export default MyDatePicker;
