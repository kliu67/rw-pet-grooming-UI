const toHourString = (date) => {
  let hour = date.getHours();
  return hour < 10 ? `0${hour}` : `${hour}`
}

const toMinuteString = (date) => {
  let minute = date.getMinutes();
  return minute < 10 ? `0${minute}` : `${minute}`;
}

export const getDaysInMonth = (year, monthIndex) => {
  var date = new Date(year, monthIndex, 1);
  var days = [];
  while (date.getMonth() === monthIndex) {
    days.push(new Date(date)); // Push a copy of the date object
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export const computeDateTimeIntervals = (timeRange, date, durationMinutes, intervalMinutes) => {
  const { start, end } = timeRange;
  let rangeStart =
    date.getHours() * 60 +
    date.getMinutes() +
    Number(start.substring(0, 2)) * 60 +
    Number(start.substring(3, 5));
  let rangeEnd =
    date.getHours() * 60 +
    date.getMinutes() +
    Number(end.substring(0, 2)) * 60 +
    Number(end.substring(3, 5));
  

  const intervals = [];

    while ((rangeEnd - rangeStart) >= durationMinutes) {

      let start = new Date(date);
      start.setHours(Math.trunc(rangeStart / 60));
      start.setMinutes(rangeStart % 60);

      let end = new Date(date);
      end.setHours(Math.trunc((rangeStart + durationMinutes) / 60));
      end.setMinutes((rangeStart + durationMinutes) % 60);

      let interval = {
        start, end,
        startStr24Hr: `${toHourString(start)}:${toMinuteString(start)}`,
        endStr24Hr: `${toHourString(end)}:${toMinuteString(end)}`,
        startStrAMPM: computeAMPMTimeString(start),
        endStrAMPM: computeAMPMTimeString(end)
        
      };
      intervals.push(interval);
      rangeStart += intervalMinutes;
    }


  return intervals;
};

export const computeAMPMTimeString = (date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${toHourString(date)}:${toMinuteString(date)}${hour >= 12? 'PM':'AM'}`;
}
