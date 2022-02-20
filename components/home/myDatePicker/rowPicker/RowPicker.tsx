import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import useDraggableScroll from "use-draggable-scroll";
import { daysInMonthArray, getDay } from "../../../../function/dateConversions";
import useIsMounted from "../../../../hooks/useIsMounted";
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
	const myScrollContainer = useRef<HTMLDivElement>(null);
	const selectedDayRef = useRef<HTMLDivElement>(null);
	const [isClickingDate, setIsClickingDate] = useState(true);
	const today = new Date();
	const isMounted = useIsMounted();
	const { onMouseDown } = useDraggableScroll(myScrollContainer);
	// Picked date centerer
	useEffect(() => {
		if (!selectedDayRef.current || !myScrollContainer.current) return;
		const leftSelected = selectedDayRef.current.offsetLeft;
		const widthSelected = selectedDayRef.current.clientWidth;
		const leftContainer = myScrollContainer.current.offsetLeft;
		const widthContainer = myScrollContainer.current.clientWidth;
		const centerScroll = leftSelected - leftContainer - widthContainer / 2 + widthSelected / 2;

		//used in scrollBy (since it is relattive)
		const currentScroll = myScrollContainer.current.scrollLeft;
		const centerScrollBy = centerScroll - currentScroll;

		if (isMounted()) {
			if (currentScroll === 0 && centerScroll > 300) {
				myScrollContainer.current.scrollTo(centerScroll, 0);
			} else {
				myScrollContainer.current.scrollBy({ left: centerScrollBy, behavior: "smooth" });
			}
		}
	}, [userConfig]);

	const changeDate = (day: number) => {
		if (!isClickingDate) return;
		const date = new Date(year, month - 1, day);
		userConfig.updateDate(date);
	};

	return (
		// <ScrollContainer innerRef={myScrollContainer} className='scroll-container'>
		<div
			ref={myScrollContainer}
			className={clsx(styles.container, "unselectable")}
			onMouseDown={(e) => {
				onMouseDown(e);
				setIsClickingDate(true);
			}}
			onScroll={() => setIsClickingDate(false)}>
			{daysInMonthArray(month, year).map((day, i) => (
				<RowPickerItem
					key={i}
					day={day}
					weekday={getDay(day, month, year)}
					isSelected={day === chosenDay}
					isToday={today.getDate() === day && today.getMonth() === month - 1 && today.getFullYear() === year}
					selectedDayRef={selectedDayRef}
					onClick={changeDate}
				/>
			))}
		</div>
		// </ScrollContainer>
	);
};

export default RowPicker;
