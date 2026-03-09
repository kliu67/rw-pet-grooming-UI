export const computeIntervals = (timeRange, date, intMinutes) => {
  const { start, end } = timeRange;
  let startTimeMin =
    date.getHours() * 60 +
    date.getMinutes() +
    Number(start.substring(0, 2)) * 60 +
    Number(start.substring(3, 5));
  let endTimeMin =
    date.getHours() * 60 +
    date.getMinutes() +
    Number(end.substring(0, 2)) * 60 +
    Number(end.substring(3, 5));

  const intervals = [];
  while ((endTimeMin - startTimeMin) >= intMinutes) {
    // let intervalStart = startTimeMinutes + interval;
    // let intervalEnd =
    let intStartHr = Math.trunc(startTimeMin / 60);
    intStartHr =
      intStartHr < 10 ? `0${intStartHr}` : `${intStartHr}`;
    let intStartMin = startTimeMin % 60;
    intStartMin =
      intStartMin < 10
        ? `0${intStartMin}`
        : `${intStartMin}`;

    let intEndHr = Math.trunc((startTimeMin + intMinutes) / 60);
    intEndHr =
      intEndHr < 10 ? `0${intEndHr}` : `${intEndHr}`;
    let intEndMin = (startTimeMin + intMinutes) % 60;
    intEndMin =
      intEndMin < 10
        ? `0${intEndMin}`
        : `${intEndMin}`;

    let interval = {
      start: `${intStartHr}:${intStartMin}`,
      end: `${intEndHr}:${intEndMin}`
    };
    intervals.push(interval);
    startTimeMin += intMinutes;
  }

  return intervals;
};


const toHourString = (date) => {
    let hour = date.getHours();
    return hour < 10? `0${hour}` : `${hour}`
}

const toMinuteString = (date) => {
    let minute = date.getMinutes();
    return minute < 10? `0${minute}` : `${minute}`;
}
export const computeDateTimeIntervals = (timeRange, date, intMinutes) => {
  const { start, end } = timeRange;
  let startTimeMin =
    date.getHours() * 60 +
    date.getMinutes() +
    Number(start.substring(0, 2)) * 60 +
    Number(start.substring(3, 5));
  let endTimeMin =
    date.getHours() * 60 +
    date.getMinutes() +
    Number(end.substring(0, 2)) * 60 +
    Number(end.substring(3, 5));

  const intervals = [];
  while ((endTimeMin - startTimeMin) >= intMinutes) {

    let start = new Date(date);
    start.setHours(Math.trunc(startTimeMin / 60));
    start.setMinutes(startTimeMin % 60);

    let end = new Date(date);
    end.setHours(Math.trunc((startTimeMin + intMinutes) / 60));
    end.setMinutes((startTimeMin + intMinutes) % 60);

    let interval = {
      start, end,
      startString: `${toHourString(start)}:${toMinuteString(start)}`,
      endString: `${toHourString(end)}:${toMinuteString(end)}`
    };
    intervals.push(interval);
    startTimeMin += intMinutes;
  }

  return intervals;
};
