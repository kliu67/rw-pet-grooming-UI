const toHourString = (date) => {
  let hour = date.getHours();
  if (hour < 10){
    return `${hour}`;
  }
  if (hour > 12){
    if(hour - 12 < 10){
      return `${hour - 12}`; 
    }
    else
    return `${hour - 12}`;
  }
  return `${hour}`
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

export const computeAMPMTimeString = (date) => {
  const hour = date.getHours();
  return `${toHourString(date)}:${toMinuteString(date)}${hour >= 12? 'PM':'AM'}`;
}


export const computeDateTimeIntervals = (timeRange, date, durationMinutes, intervalMinutes) => {
  const { start, end } = timeRange;
  const baseDate = new Date(date);
  baseDate.setHours(0);
  baseDate.setMinutes(0);
  baseDate.setMilliseconds(0);
  let rangeStart =
    baseDate.getHours() * 60 +
    baseDate.getMinutes() +
    Number(start.substring(0, 2)) * 60 +
    Number(start.substring(3, 5));
  let rangeEnd =
    baseDate.getHours() * 60 +
    baseDate.getMinutes() +
    Number(end.substring(0, 2)) * 60 +
    Number(end.substring(3, 5));
  

  const intervals = [];

    while ((rangeEnd - rangeStart) >= durationMinutes) {

      let start = new Date(baseDate);
      start.setHours(Math.trunc(rangeStart / 60));
      start.setMinutes(rangeStart % 60);

      let end = new Date(baseDate);
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

