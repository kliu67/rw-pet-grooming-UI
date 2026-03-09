import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MAX_PET_NAME_LENGTH } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { DROPDOWN_BUTTON } from "@/styles/classNames";
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
  const [stylistId, setStylistId] = useState();
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [config, setConfig] = useState();
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
  } = useAvailabiltyById(stylistId);

  const {
    data: timeOffsData = [],
    isLoading: timeOffsIsLoading,
    error: timeOffsError
  } = useTimeOffById(stylistId);

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

  const isDateDisabled = useCallback(
    (day) => {
      if (!stylist) return true;

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
      form.stylist,
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

  // ---------- Reset form when editing another row ----------
  useEffect(() => {
    setForm({
      //   name: petData?.name || "",
      //   owner: petData?.owner || "",
      //   breed: petData?.breed || "",
      //   weightClass: petData?.weightClass || ""
    });
    setErrors({
      name: "",
      owner: "",
      breed: "",
      weightClass: ""
    });

    setServerError(null);
  }, []);

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
    }
  }, [service, pet]);

  useEffect(() => {
    if (config) {
      setForm((prev) => ({
        ...prev,
        service_configuration_id: config.id
      }));
    }
  }, [config]);

  useEffect(() => {
    if (openTimeRanges && date && config) {
      console.log(openTimeRanges);
      // openTimeRanges.forEach((range) => computeIntervals(range, date, 90));
      setTimeIntervals(
        ...openTimeRanges.map((range) =>
          // computeIntervals(range, date, config.duration_minutes)
          computeDateTimeIntervals(range, date, config.duration_minutes)
        )
      );
    }
  }, [date]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <form
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

          {/* service */}
          <div className="flex">
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
                  {filteredServices.map((service) => (
                    <Fragment key={service.id}>
                      <DropdownMenuItem
                        onSelect={() => {
                          setService(service);
                          setForm((prev) => ({
                            ...prev,
                            service_id: service.id
                          }));
                        }}
                      >
                        {service.name}
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
                  {filteredStylists.map((stylist) => (
                    <Fragment key={stylist.id}>
                      <DropdownMenuItem
                        onSelect={() => {
                          setStylist(stylist);
                          setForm((prev) => ({
                            ...prev,
                            stylist_id: stylist.id
                          }));
                          setStylistId(stylist.id);
                        }}
                      >
                        {getNameStandard(stylist)}
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
                  {filteredClients.map((client) => (
                    <Fragment key={client.id}>
                      <DropdownMenuItem
                        onSelect={() => {
                          setClient(client);
                          setForm((prev) => ({
                            ...prev,
                            client_id: client.id
                          }));
                          setPetsById(
                            pets.filter((pet) => pet.owner === client.id)
                          );
                        }}
                      >
                        {getNameLexicalOrder(client)}
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
                  {filteredPets.map((pet) => (
                    <Fragment key={pet.id}>
                      <DropdownMenuItem
                        onSelect={() => {
                          setPet(pet);
                          setForm((prev) => ({
                            ...prev,
                            pet_id: pet.id
                          }));
                        }}
                      >
                        {pet.name}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div class="flex">
            <div className="w-1/2">
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
            <div className="w-1/2">
              {date && (
                <div className="rounded-md border p-3">
                  <p className="text-sm font-medium mb-2">Open time ranges</p>

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
                      <div className="flex flex-wrap gap-2">
                        {/* {openTimeRanges.map((range) => (
                          <span
                            key={`${range.start}-${range.end}`}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                          >
                            {range.start} - {range.end}
                          </span>
                        ))} */}
                        {timeIntervals?.length > 0 &&
                          timeIntervals.map((time) => (
                            <div className="w-full">
                              <button
                                type="button"
                                className={DROPDOWN_BUTTON}
                                onClick={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    startTime: time.start
                                  }));
                                }}
                              >{`${time.startString} - ${time.endString}`}</button>
                            </div>
                          ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm mb-2">
              {serverError?.error ||
                serverError?.message ||
                "Failed to save pet"}
            </p>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2">
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
