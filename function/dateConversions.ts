import firebase from "firebase/compat/app";

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
export const getTimeFromDate = (date: Date) => {
	//   const offset = date.getTimezoneOffset();
	//   date = new Date(date.getTime() - offset * 60 * 1000);
	const preparsed = date.toISOString().split("T")[1].split(":");
	let hour = parseInt(preparsed[0]);
	const min = preparsed[1];
	const isMorning = hour < 12;
	hour %= 12;
	if (hour === 0) hour = 12;
	return `${hour}:${min} ${isMorning ? "AM" : "PM"}`;
};

// Month is 1 indexed
export function daysInMonth(month: number, year: number) {
	return new Date(year, month, 0).getDate();
}

// Month is 1 indexed
export function daysInMonthArray(month: number, year: number) {
	const days: number[] = [];
	for (let i = 1; i <= daysInMonth(month, year); i++) {
		days.push(i);
	}
	return days;
}

export const DayAbbrev = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Month is 1 indexed
export function getDay(day: number, month: number, year: number) {
	return DayAbbrev[new Date(year, month, day).getDay()];
}

//Month is 1 indexed
export const getDayMonthFromYYYYMMDD = (date: string) => {
	const preparsed = date.split("-");
	const month = parseInt(preparsed[1]);
	const day = parseInt(preparsed[2]);

	return `${MonthAbbrev[month - 1]} ${day}`;
};

export const getTimeFromHHMMSS = (time: string) => {
	const preparsed = time.split("-");
	let hour = parseInt(preparsed[0]);
	const min = preparsed[1];
	const isMorning = hour < 12;
	hour %= 12;
	if (hour === 0) hour = 12;
	return `${hour}:${min} ${isMorning ? "AM" : "PM"}`;
};

export const getCommentAge = (timestamp: firebase.firestore.Timestamp | null) => {
	//TODO ADD PER WEEK / PER MONTH / PER YEAR
	if (!timestamp) return;
	const commentBirth = timestamp.toDate();

	const now = new Date();
	let commentAge_ms = Math.abs(now.getTime() - commentBirth.getTime());

	const days = Math.floor(commentAge_ms / 1000 / 60 / 60 / 24);
	commentAge_ms -= days * 1000 * 60 * 60 * 24;
	const hours = Math.floor(commentAge_ms / 1000 / 60 / 60);
	commentAge_ms -= hours * 1000 * 60 * 60;
	const minutes = Math.floor(commentAge_ms / 1000 / 60);
	commentAge_ms -= minutes * 1000 * 60;
	const seconds = Math.floor(commentAge_ms / 1000);
	commentAge_ms -= seconds * 1000;

	if (days > 0) return `${days}d ago`;
	if (hours > 0) return `${hours}h ago`;
	if (minutes > 0) return `${minutes}m ago`;
	return "Just now";
};

export const parseUserConfigDate = (date: string) => {
	const splitDate = date.split("-");
	const day = parseInt(splitDate[2]);
	const month = parseInt(splitDate[1]);
	const year = parseInt(splitDate[0]);
	return { day, month, year };
};
