export const getYYYYMMDD = (date: Date) => {
	const offset = date.getTimezoneOffset();
	date = new Date(date.getTime() - offset * 60 * 1000);
	// console.log(date);
	// console.log(date.toISOString());
	// console.log(date.toISOString().split("T"));
	return date.toISOString().split("T")[0];
};

export const MonthAbbrev = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getMonthYearFromStr = (month: number, year: number) => {
	return `${MonthAbbrev[month - 1]}, ${year}`;
};
export const getHHMMSS = (date: Date) => {
	//   const offset = date.getTimezoneOffset();
	//   date = new Date(date.getTime() - offset * 60 * 1000);
	const preparsed = date.toISOString().split("T")[1].split(":");
	let hour = parseInt(preparsed[0]);
	const min = preparsed[1];
	const isMorning = hour < 12;
	hour %= 12;
	return `${hour}:${min} ${isMorning ? "AM" : "PM"}`;
};

// Month is 1 indexed
export function daysInMonth(month: number, year: number) {
	return new Date(year, month, 0).getDate();
}

export function daysInMonthArray(month: number, year: number) {
	const days: number[] = [];
	for (let i = 1; i <= daysInMonth(month, year); i++) {
		days.push(i);
	}
	return days;
}
