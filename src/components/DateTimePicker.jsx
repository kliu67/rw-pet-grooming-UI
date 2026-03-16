import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { INTERVAL_MINUTES } from "@/constants";
import { TIME_BTN_ACTIVE, TIME_BTN_DISABLED } from "@/styles/classNames";
import { useAvailabiltyById } from "@/hooks/availability";
import { useTimeOffById } from "@/hooks/timeOffs";
import { getOpenTimeRanges, useOpenTimeRanges } from "@/hooks/openTimeRanges";
import { Calendar } from "../ui/calendar";
import {
    computeDateTimeIntervals,
} from "@/hooks/timeIntervals";

export const DateTimePicker = ({
    openTimeRanges,
    date,
    config,
    stylist,
    timeDisabled,
    calendarDisabled
}) => {
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [date, setDate] = useState();
      const [timeIntervals, setTimeIntervals] = useState([]);


    // const getDaysInMonth = (year, monthIndex) => {
    //     var date = new Date(year, monthIndex, 1);
    //     var days = [];
    //     while (date.getMonth() === monthIndex) {
    //         days.push(new Date(date)); // Push a copy of the date object
    //         date.setDate(date.getDate() + 1);
    //     }
    //     return days;
    // }


    // const monthAvailability = useMemo(() => {
    //     if (!availabilityData?.length) return [];

    //     const thisMonth = calendarMonth.getMonth();
    //     const thisYear = calendarMonth.getFullYear();

    //     return getDaysInMonth(thisYear, thisMonth).map((day) =>
    //         getOpenTimeRanges({
    //             availabilityData,
    //             timeOffsData,
    //             date: day
    //         })
    //     );
    // }, [availabilityData, timeOffsData, calendarMonth]);

    // const monthBookableDates = useMemo(() => {
    //     if (!availabilityData?.length) return new Set();

    //     const thisMonth = calendarMonth.getMonth();
    //     const thisYear = calendarMonth.getFullYear();
    //     const monthDays = getDaysInMonth(thisYear, thisMonth);

    //     return new Set(
    //         monthDays
    //             .filter((_, index) => monthAvailability[index]?.length > 0)
    //             .map((day) => day.toDateString())
    //     );
    // }, [availabilityData, calendarMonth, monthAvailability]);

    useEffect(() => {
        if (openTimeRanges && date && config) {
            console.log(openTimeRanges);
            // openTimeRanges.forEach((range) => computeIntervals(range, date, 90));
            setTimeIntervals(
                ...openTimeRanges.map((range) =>
                    // computeIntervals(range, date, config.duration_minutes)
                    computeDateTimeIntervals(range, date, config.duration_minutes, INTERVAL_MINUTES)
                )
            );
        }
    }, [config, date, stylist]);
    return (
        <div className="flex gap-4">
            <div className="w-1/2 flex-shrink-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    className="rounded-md border"
                    disabled={calendarDisabled}
                />
            </div>
            <div className="w-1/2">
                {date && (
                    <div className="rounded-md border p-3 h-[300px] overflow-y-auto">
                        <p className="text-sm font-medium mb-2">Open time ranges</p>
                        {openTimeRanges.map((range) => (
                            <p
                                key={`${range.start}-${range.end}`}
                                className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                            >
                                {range.start} - {range.end}
                            </p>
                        ))}

                        {(availabilityIsLoading || timeOffsIsLoading) && (
                            <p className="text-sm text-gray-500">
                                Loading availability...
                            </p>
                        )}

                        {(availabilityError || timeOffsError) && (
                            <p className="text-sm text-red-600">
                                Failed to load availability data.
                            </p>
                        )}

                        {!availabilityIsLoading &&
                            !timeOffsIsLoading &&
                            !availabilityError &&
                            !timeOffsError &&
                            openTimeRanges.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    No open ranges for this date.
                                </p>
                            )}
                        {!availabilityIsLoading &&
                            !timeOffsIsLoading &&
                            !availabilityError &&
                            !timeOffsError &&
                            openTimeRanges.length > 0 && (
                                <div className="flex flex-wrap gap-2 overflow-y-auto">
                                    {timeIntervals?.length > 0 &&
                                        timeIntervals.map((time) => (
                                            <div className={`px-3 py-2 rounded-md border text-left 
                                              ${timeDisabled ? TIME_BTN_DISABLED : TIME_BTN_ACTIVE} 
                                ${timeSelected === time.start
                                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-200"
                                                    : "bg-white hover:bg-gray-100"}`}>
                                                <button
                                                    type="button"
                                                    // disabled={calendarDisabled}
                                                    disabled={!stylist || !config}
                                                    onClick={() => {
                                                        if (timeSelected === time.start) {
                                                            setTimeSelected('');
                                                            setForm((prev) => {
                                                                const { startTime, ...rest } = prev;
                                                                return rest; // startTime removed
                                                            });
                                                        }
                                                        else {
                                                            setTimeSelected(time.start);
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                startTime: time.start
                                                            }));
                                                        }
                                                    }}
                                                >{`${time.startStrAMPM} - ${time.endStrAMPM}`}</button>
                                            </div>
                                        ))}
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}