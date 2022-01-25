export const getYYYYMMDD = (date: Date) => {
  //   const offset = date.getTimezoneOffset();
  //   date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
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
