import { useContext } from "react";
import { parseUserConfigDate } from "../../../function/dateConversions";
import { DeviceType } from "../../../hooks/useIsSmartphone";
import { AppContext } from "../../../pages/_app";
import Sizedbox from "../../Sizedbox";
import styles from "./MyDatePicker.module.css";
import RowPicker from "./rowPicker/RowPicker";

interface MyDatePickerProps {}

const MyDatePicker: React.FC<MyDatePickerProps> = () => {
	const { userConfig, device } = useContext(AppContext);
	const { day, month, year } = parseUserConfigDate(userConfig.date);

	return (
		<div className={styles.container}>
			<Sizedbox height={device === DeviceType.Smartphone ? 10 : 30} />
			<RowPicker userConfig={userConfig} chosenDay={day} month={month} year={year} />
		</div>
	);
};

export default MyDatePicker;
