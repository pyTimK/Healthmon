import { useEffect, useRef } from "react";
import ScrollContainer, { ScrollEvent } from "react-indiana-drag-scroll";
import { daysInMonthArray, getDay } from "../../../../function/dateConversions";
import { UserConfig } from "../../../../types/userConfig";
import styles from "./RowPicker.module.css";
import { getYYYYMMDD } from "../../../../function/dateConversions";
import RowPickerItem from "./RowPickerItem";
interface RowPickerProps {
	userConfig: UserConfig;
	chosenDay: number;
	month: number;
	year: number;
}

const RowPicker: React.FC<RowPickerProps> = ({ userConfig, chosenDay, month, year }) => {
	const myScrollContainer = useRef<HTMLElement | null>(null);
	const selectedDayRef = useRef<HTMLDivElement | null>(null);

	// Picked date centerer
	useEffect(() => {
		if (!selectedDayRef.current || !myScrollContainer.current) return;
		const leftSelected = selectedDayRef.current.offsetLeft;
		const widthSelected = selectedDayRef.current.clientWidth;
		const leftContainer = myScrollContainer.current.offsetLeft;
		const widthContainer = myScrollContainer.current.clientWidth;
		const centerScroll = leftSelected - leftContainer - widthContainer / 2 + widthSelected / 2;

		myScrollContainer.current.scrollTo(centerScroll, 0);
	}, [userConfig]);

	const changeDate = (day: number) => {
		const date = new Date(year, month - 1, day);
		userConfig.updateDate(date);
	};

	return (
		<ScrollContainer innerRef={myScrollContainer} className='scroll-container'>
			<div className={styles.container}>
				{daysInMonthArray(month, year).map((day, i) => (
					<RowPickerItem
						key={i}
						day={day}
						weekday={getDay(day, month, year)}
						isSelected={day === chosenDay}
						selectedDayRef={selectedDayRef}
						onClick={changeDate}
					/>
				))}
			</div>
		</ScrollContainer>
	);
};

export default RowPicker;
