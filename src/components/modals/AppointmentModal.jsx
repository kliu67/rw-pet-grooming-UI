import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MAX_PET_NAME_LENGTH, INTERVAL_MINUTES } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { DROPDOWN_BUTTON, TIME_BTN_ACTIVE, TIME_BTN_DISABLED } from "@/styles/classNames";
import { getNameLexicalOrder, getNameStandard } from "@/utils";
import { useAvailabiltyById } from "@/hooks/availability";
import { useTimeOffById } from "@/hooks/timeOffs";
import { getOpenTimeRanges, useOpenTimeRanges } from "@/hooks/openTimeRanges";
import { Calendar } from "../ui/calendar";
import {
  computeDateTimeIntervals,
  computeIntervals
} from "@/hooks/timeIntervals";

export const DropdownSearch = ({ searchTerm, onChange }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => onChange(e)}
        />
      </div>
    </div>
  );
};
export default function AppointmentModal({
  onClose,
  inputs,
  appointment = {},
  mode,
  onSubmit,
  configs,
  services,
  clients,
  breeds,
  pets,
  stylists,
  isLoading
}) {
  //States
  const [form, setForm] = useState({});
  const [client, setClient] = useState();
  const [pet, setPet] = useState();
  const [stylist, setStylist] = useState();
  const [service, setService] = useState();
  const [touched, setTouched] = useState();
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [serverError, setServerError] = useState(null);
  const [petsById, setPetsById] = useState(pets);
  const [appointmentAt, setAppointmentAt] = useState();
  const [date, setDate] = useState();
  const [timeSelected, setTimeSelected] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  // const [timeIntervals, setTimeIntervals] = useState([]);
  const [config, setConfig] = useState('');
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const hasValidationErrors = errors.name;
  const modalTexts = {
    heading: isEdit ? t("pets.edit") : t("pets.create"),
    primaryButtonLabel: isEdit ? t("general.update") : t("general.create")
  };

  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStylists = stylists.filter(
    (stylist) =>
      stylist.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stylist.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(
    (client) =>
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPets = petsById.filter((pet) =>
    pet.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //queries
  const {
    data: availabilityData = [],
    isLoading: availabilityIsLoading,
    error: availabilityError
  } = useAvailabiltyById(stylist?.id);

  const {
    data: timeOffsData = [],
    isLoading: timeOffsIsLoading,
    error: timeOffsError
  } = useTimeOffById(stylist?.id);

  const openTimeRanges = useOpenTimeRanges({
    availabilityData,
    timeOffsData,
    date
  });

  const validateFields = (field, value) => {
    if (isDirty) {
      if (field === "name") {
        if (!value) {
          return t("pets.errors.notEmpty", { input: "Name" });
        } else if (value.length > MAX_PET_NAME_LENGTH) {
          return t("pets.errors.nameLengthViolation", {
            max: MAX_PET_NAME_LENGTH
          });
        }
      }
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerError(null);
    setIsDirty(true);

    const errorMsg = validateFields(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setSearchTerm("");
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const hasChanges = (current) => {
    // return (
    //   (petData?.name || "").trim() !== current.name.trim() ||
    //   (petData?.owner?.id || "") !== current.owner.id ||
    //   (petData?.breed?.id || "") !== current.breed.id ||
    //   ((petData?.weightClass?.id || "") !== current.weightClass?.id &&
    //     !!current.weightClass?.id)
    // );
  };

  function getDaysInMonth(year, monthIndex) {
    var date = new Date(year, monthIndex, 1);
    var days = [];
    while (date.getMonth() === monthIndex) {
      days.push(new Date(date)); // Push a copy of the date object
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  const monthAvailability = useMemo(() => {
    if (!availabilityData?.length) return [];

    const thisMonth = calendarMonth.getMonth();
    const thisYear = calendarMonth.getFullYear();

    return getDaysInMonth(thisYear, thisMonth).map((day) =>
      getOpenTimeRanges({
        availabilityData,
        timeOffsData,
        date: day
      })
    );
  }, [availabilityData, timeOffsData, calendarMonth]);

  const monthBookableDates = useMemo(() => {
    if (!availabilityData?.length) return new Set();

    const thisMonth = calendarMonth.getMonth();
    const thisYear = calendarMonth.getFullYear();
    const monthDays = getDaysInMonth(thisYear, thisMonth);

    return new Set(
      monthDays
        .filter((_, index) => monthAvailability[index]?.length > 0)
        .map((day) => day.toDateString())
    );
  }, [availabilityData, calendarMonth, monthAvailability]);

  const isTimeDisabled = !stylist || !config;
  const isDateDisabled = useCallback(
    (day) => {
      if (isTimeDisabled) return true;

      const todayDate = new Date();
      const normalizedToday = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate()
      );
      const normalizedDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      if (normalizedDay < normalizedToday) return true;

      if (
        availabilityIsLoading ||
        timeOffsIsLoading ||
        availabilityError ||
        timeOffsError
      ) {
        return false;
      }

      if (!availabilityData?.length) return true;

      return !monthBookableDates.has(normalizedDay.toDateString());
    },
    [
      stylist,
      pet,
      service,
      config,
      availabilityIsLoading,
      timeOffsIsLoading,
      availabilityError,
      timeOffsError,
      availabilityData,
      monthBookableDates
    ]
  );

  const canSubmit =
    !isLoading &&
    !hasValidationErrors &&
    form.name &&
    form.owner &&
    form.breed &&
    ((mode === "edit" && hasChanges(form)) || mode === "create");


  //sets a new service config whenever service or pet changes
  useEffect(() => {
    if (service && pet) {
      setConfig(
        ...configs.filter(
          (c) =>
            c.breed_id === pet.breed &&
            c.service_id === service.id &&
            c.weight_class_id === pet.weight_class_id
        )
      );
      setForm((prev) => ({
        ...prev,
        service_configuration_id: config.id
      }));

    }
    else setConfig('');
  }, [service, pet, client]);

  //whenever config, date or stylist changes, compute new date time intervals;
  const timeIntervals = useMemo(() => {
  if (!openTimeRanges || !date || !config) return [];

  return openTimeRanges.flatMap((range) =>
    computeDateTimeIntervals(
      range,
      date,
      config.duration_minutes,
      INTERVAL_MINUTES
    )
  );
}, [openTimeRanges, date, config]);
  // useEffect(() => {
  //   if (openTimeRanges && date && config) {
  //     setTimeIntervals(
  //       ...openTimeRanges.map((range) =>
  //         computeDateTimeIntervals(range, date, config.duration_minutes, INTERVAL_MINUTES)
  //       )
  //     );
  //   }
  // }, [config, date, stylist]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      {/* <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6"> */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {modalTexts.title}
          </h2>
        </div>
        <form
          className="flex-1 overflow-y-auto px-6 py-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) return;
            let delta = {};
            if (appointment?.client_id !== form?.client_id) {
              delta.client_id = form?.client_id
            }
            if (appointment?.pet_id !== form?.pet_id) {
              delta.pet_id = form?.pet_id
            }
            if (appointment?.service_id !== form?.service_id) {
              delta.service_id = form?.service_id
            }
            if (appointment?.service_configuration_id !== form?.service_configuration_id) {
              delta.service_configuration_id = form?.service_configuration_id
            }
            if (appointment?.stylist_id !== form?.stylist_id) {
              delta.stylist_id = form?.stylist_id
            }
            try {
              await onSubmit(delta);
              setServerError(null);
              onClose();
            } catch (err) {
              setServerError(err);
            }
          }}
        >
          {/* Header */}

          <div className="flex-1 overflow-y-auto">

            <div className="flex">
              {/* service */}
              <div className="mt-4 mb-4 w-1/2">
                <label className="mr-2" htmlFor="pet">
                  {inputs.service.displayName}
                </label>
                <DropdownMenu id="service">
                  <DropdownMenuTrigger asChild>
                    <button className={DROPDOWN_BUTTON}>
                      {service ? service.name : t("general.select")}{" "}
                      <span aria-hidden="true">&#9662;</span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {filteredServices.map((serv) => (
                      <Fragment key={serv.id}>
                        <DropdownMenuItem
                          onSelect={() => {
                            if (serv.id !== service?.id) {
                              setService(serv);
                              setForm((prev) => {
                                const { startTime, ...rest } = prev;
                                return {
                                  ...rest,
                                  service_id: serv.id
                                }; // startTime and pet removed
                              });
                            }
                          }}
                        >
                          {serv.name}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* stylist */}
              <div className="mt-4 mb-4 w-1/2">
                <label className="mr-2" htmlFor="stylist">
                  {inputs.stylist.displayName}
                </label>
                <DropdownMenu id="stylist">
                  <DropdownMenuTrigger asChild>
                    <button className={DROPDOWN_BUTTON}>
                      {stylist ? getNameStandard(stylist) : t("general.select")}{" "}
                      <span aria-hidden="true">&#9662;</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownSearch
                      searchTerm={searchTerm}
                      onChange={handleSearchChange}
                    ></DropdownSearch>
                    {filteredStylists.map((sty) => (
                      <Fragment key={sty.id}>
                        <DropdownMenuItem
                          onSelect={() => {
                            if (sty.id !== stylist?.id) {
                              setStylist(sty);
                              setForm((prev) => {
                                const { startTime, ...rest } = prev;
                                return {
                                  ...rest,
                                  stylist_id: sty.id
                                }; // startTime and pet removed
                              });
                            }
                          }}
                        >
                          {getNameStandard(sty)}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex">
              {/* client */}
              <div className="mt-4 mb-4 w-1/2">
                <label className="mr-2" htmlFor="client">
                  {inputs.client.displayName}
                </label>
                <DropdownMenu id="client">
                  <DropdownMenuTrigger asChild>
                    <button className={DROPDOWN_BUTTON}>
                      {client ? getNameLexicalOrder(client) : t("general.select")}{" "}
                      <span aria-hidden="true">&#9662;</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownSearch
                      searchTerm={searchTerm}
                      onChange={handleSearchChange}
                    ></DropdownSearch>
                    {filteredClients.map((cl) => (
                      <Fragment key={cl.id}>
                        <DropdownMenuItem
                          onSelect={() => {
                            if (cl.id !== client?.id) {
                              setClient(cl);
                              setPet('');
                              setPetsById(
                                pets.filter((pet) => pet.owner === cl.id)
                              );
                              setForm((prev) => {
                                const { startTime, pet_id, ...rest } = prev;
                                return {
                                  ...rest,
                                  client_id: cl.id
                                }; // startTime and pet removed
                              });
                            }
                          }}
                        >
                          {getNameLexicalOrder(cl)}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* pet */}
              <div className="mt-4 mb-4 w-1/2">
                <label className="mr-2" htmlFor="pet">
                  {inputs.pet.displayName}
                </label>
                <DropdownMenu id="pet">
                  <DropdownMenuTrigger disabled={!client} asChild>
                    <button className={DROPDOWN_BUTTON} disabled={!client}>
                      {pet ? pet.name : t("general.select")}{" "}
                      <span aria-hidden="true">&#9662;</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownSearch
                      searchTerm={searchTerm}
                      onChange={handleSearchChange}
                    ></DropdownSearch>
                    {filteredPets.map((p) => (
                      <Fragment key={p.id}>
                        <DropdownMenuItem
                          onSelect={() => {
                            //clear startimte
                            if (p.id !== pet?.id) {
                              setTimeSelected('');
                              setPet(p);
                              setForm((prev) => {
                                const { startTime, ...rest } = prev;
                                return {
                                  ...rest,
                                  pet_id: p.id
                                }; // startTime removed
                              });
                            }
                          }
                          }
                        >
                          {p.name}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* calendar */}
            <div className="flex gap-4">
              <div className="w-2/5 flex-shrink-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  className="rounded-md border"
                  disabled={isDateDisabled}
                />
              </div>
              <div className="w-3/5">
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
                              <div className={`${isTimeDisabled ? TIME_BTN_DISABLED : TIME_BTN_ACTIVE} 
                                ${timeSelected === time.start
                                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-200"
                                  : "bg-white hover:bg-gray-100"}`}>
                                <button
                                  type="button"
                                  // disabled={isDateDisabled}
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
          </div>


          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            {/* Server Error */}
            {serverError && (
              <p className="text-red-500 text-sm mb-2">
                {serverError?.error ||
                  serverError?.message ||
                  "Failed to save pet"}
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              {t("general.cancel")}
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
                disabled:bg-gray-400
                disabled:cursor-not-allowed
                disabled:opacity-60"
            >
              {modalTexts.primaryButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
