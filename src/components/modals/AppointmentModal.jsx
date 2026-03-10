import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MAX_PET_NAME_LENGTH, INTERVAL_MINUTES } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DROPDOWN_BUTTON,
  TIME_BTN_ACTIVE,
  TIME_BTN_DISABLED,
} from "@/styles/classNames";
import {
  getNameLexicalOrder,
  getNameStandard,
  isObjectNotEmpty,
} from "@/utils";
import { useAvailabiltyById } from "@/hooks/availability";
import { useTimeOffById } from "@/hooks/timeOffs";
import { getOpenTimeRanges, useOpenTimeRanges } from "@/hooks/openTimeRanges";
import { Calendar } from "../ui/calendar";
import { DropdownSearch } from "../DrowndownSearch";
import {
  computeDateTimeIntervals,
  getDaysInMonth,
} from "@/hooks/timeIntervals";

export default function AppointmentModal({
  onClose,
  inputs,
  row = {},
  mode,
  onSubmit,
  configs,
  services,
  clients,
  pets,
  stylists,
  isLoading,
}) {
  //States
  const [form, setForm] = useState({});
  const [service, setService] = useState(row.service);
  const [stylist, setStylist] = useState(row.stylist);
  const [client, setClient] = useState(row.client);
  const [pet, setPet] = useState(row.pet);
  const [config, setConfig] = useState();
  const [date, setDate] = useState(new Date(row.startTime));
  const [touched, setTouched] = useState();
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [serverError, setServerError] = useState(null);
  const [petsById, setPetsById] = useState(pets);
  const [timeSelected, setTimeSelected] = useState(() => {
    return !!row.startTime ? new Date(row.startTime) : new Date();
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    return !!row.startTime ? new Date(row.startTime) : new Date();
  });

  const { t } = useTranslation();

  const isEdit = mode === "edit";
  const hasValidationErrors = errors.name;
  const modalTexts = {
    heading: isEdit ? t("pets.edit") : t("appointments.create"),
    primaryButtonLabel: isEdit ? t("general.update") : t("general.create"),
  };

  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredStylists = stylists.filter(
    (stylist) =>
      stylist.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stylist.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredClients = clients.filter(
    (client) =>
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPets = petsById.filter((pet) =>
    pet.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //queries
  const {
    data: availabilityData = [],
    isLoading: availabilityIsLoading,
    error: availabilityError,
  } = useAvailabiltyById(stylist?.id);

  const {
    data: timeOffsData = [],
    isLoading: timeOffsIsLoading,
    error: timeOffsError,
  } = useTimeOffById(stylist?.id);

  const openTimeRanges = useOpenTimeRanges({
    availabilityData,
    timeOffsData,
    date,
  });

  const validateFields = (field, value) => {
    if (isDirty) {
      if (field === "description") {
        if (value && value.length > MAX_CLIENT_DESC_LENGTH) {
          return t("clients.errors.description");
        } else {
          return "";
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
      [name]: errorMsg,
    }));
    setForm((prev) => {
      const { description, ...rest } = prev;
      if (value === "") {
        return { ...rest };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTimestamp = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value.getTime();

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  };

  const toApiDateTime = (value) => {
    if (!value) return value;
    if (value instanceof Date) return value.toISOString();

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
  };

  const hasChanges = !(
    service?.id === row.service?.id &&
    stylist?.id === row.stylist?.id &&
    client?.id === row.client?.id &&
    pet?.id === row.pet?.id &&
    form?.description === row.description &&
    getTimestamp(timeSelected) === getTimestamp(row.startTime)
  );

  const canSubmit =
    !isLoading &&
    !hasValidationErrors &&
    ((form.client_id &&
      form.pet_id &&
      form.stylist_id &&
      form.service_configuration_id &&
      form.service_id &&
      form.startTime &&
      mode === "create") ||
      (mode === "edit" && hasChanges && isObjectNotEmpty(form)));

  const monthAvailability = useMemo(() => {
    if (!availabilityData?.length) return [];

    const thisMonth = calendarMonth.getMonth();
    const thisYear = calendarMonth.getFullYear();

    return getDaysInMonth(thisYear, thisMonth).map((day) =>
      getOpenTimeRanges({
        availabilityData,
        timeOffsData,
        date: day,
      }),
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
        .map((day) => day.toDateString()),
    );
  }, [availabilityData, calendarMonth, monthAvailability]);

  //whenever config, date or stylist changes, compute new date time intervals;
  const timeIntervals = useMemo(() => {
    if (!openTimeRanges || !date || !config) return [];

    return openTimeRanges.flatMap((range) =>
      computeDateTimeIntervals(
        range,
        date,
        config.duration_minutes,
        INTERVAL_MINUTES,
      ),
    );
  }, [openTimeRanges, date, config, stylist]);

  const isTimeDisabled = !stylist || !config;
  const isDateDisabled = useCallback(
    (day) => {
      if (isTimeDisabled) return true;

      const todayDate = new Date();
      const normalizedToday = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate(),
      );
      const normalizedDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
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
      monthBookableDates,
    ],
  );

  //sets a new service config whenever service or pet changes
  useEffect(() => {
    if (service && pet) {
      const matchedConfig = configs.find(
        (c) =>
          c.breed_id === pet.breed &&
          c.service_id === service.id &&
          c.weight_class_id === pet.weight_class_id,
      );

      if (matchedConfig) {
        setConfig(matchedConfig);
        if (form.service_id || form.pet_id) {
          setForm((prev) => ({
            ...prev,
            service_configuration_id: matchedConfig.id,
          }));
        }
      }
    } else setConfig("");
  }, [service, pet, client]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{modalTexts.heading}</h2>
        </div>
        <form
          className="flex-1 overflow-y-auto px-6 py-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) return;
            let delta = {};
            if (row?.client_id !== form?.client_id) {
              delta.client_id = form?.client_id;
            }
            if (row?.pet_id !== form?.pet_id) {
              delta.pet_id = form?.pet_id;
            }
            if (row?.service_id !== form?.service_id) {
              delta.service_id = form?.service_id;
            }
            if (
              row?.service_configuration_id !== form?.service_configuration_id
            ) {
              delta.service_configuration_id = form?.service_configuration_id;
            }
            if (row?.stylist_id !== form?.stylist_id) {
              delta.stylist_id = form?.stylist_id;
            }

            if (row?.startTime !== form?.startTime) {
              delta.startTime = toApiDateTime(form?.startTime);
            }

            if (row?.description !== form?.description) {
              delta.description = form?.description;
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
          <div className="flex-1 overflow-y-auto">
            <div className="flex">
              {/* service */}
              <div className="mt-4 mb-4 w-1/4">
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
                                  service_id: serv.id,
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
              <div className="mt-4 mb-4 w-1/4">
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
                                  stylist_id: sty.id,
                                }; // startTime removed
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

              {/* client */}
              <div className="mt-4 mb-4 w-1/4">
                <label className="mr-2" htmlFor="client">
                  {inputs.client.displayName}
                </label>
                <DropdownMenu id="client">
                  <DropdownMenuTrigger asChild>
                    <button className={DROPDOWN_BUTTON}>
                      {client
                        ? getNameLexicalOrder(client)
                        : t("general.select")}{" "}
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
                              setPet("");
                              setPetsById(
                                pets.filter((pet) => pet.owner === cl.id),
                              );
                              setForm((prev) => {
                                const { startTime, pet_id, ...rest } = prev;
                                return {
                                  ...rest,
                                  client_id: cl.id,
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
              <div className="mt-4 mb-4 w-1/4">
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
                              setTimeSelected(null);
                              setPet(p);
                              setForm((prev) => {
                                const { startTime, ...rest } = prev;
                                return {
                                  ...rest,
                                  pet_id: p.id,
                                }; // startTime removed
                              });
                            }
                          }}
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
            <div className="w-full mb-2">
              {/* <div className="mb-6"> */}
              <label
                htmlFor="remarks"
                className="block text-sm font-medium mb-1"
              >
                {t("general.remarks")}
              </label>
              <input
                id="remarks"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={t("appointments.placeholderText.remarks")}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* </div> */}
            </div>
            {/* calendar */}
            <div className="flex gap-4">
              <div className="w-1/3 flex-shrink-0">
                <label>{t("appointments.displayName.date")}</label>
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
              <div className="w-2/3">
                <label>{t("appointments.displayName.time")}</label>
                {!date && <div className="h-full">select a date</div>}
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
                              <div
                                key={time.start.toISOString()}
                                className={`${isTimeDisabled ? TIME_BTN_DISABLED : TIME_BTN_ACTIVE} 
                                ${
                                  getTimestamp(timeSelected) ===
                                  getTimestamp(time.start)
                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-200"
                                    : "bg-white hover:bg-gray-100"
                                }`}
                              >
                                <button
                                  type="button"
                                  // disabled={isDateDisabled}
                                  disabled={!stylist || !config}
                                  onClick={() => {
                                    if (
                                      getTimestamp(timeSelected) ===
                                      getTimestamp(time.start)
                                    ) {
                                      setTimeSelected(null);
                                      setForm((prev) => {
                                        const { startTime, ...rest } = prev;
                                        return rest; // startTime removed
                                      });
                                    } else {
                                      setTimeSelected(time.start);
                                      setForm((prev) => ({
                                        ...prev,
                                        startTime: time.start,
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
