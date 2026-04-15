import React from "react";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CLASSNAMES } from "../styles/classNames";
import { useCreateClient, useLookupClient } from "@/hooks/clients";
import { useCreatePet } from "@/hooks/pets";
import { useCreateAppointment } from "@/hooks/appointments";
import { useServices } from "../hooks/services";
import { useBreeds } from "../hooks/breeds";
import { useWeightClasses } from "../hooks/weightClasses";
import { useAvailabiltyByStylistId } from "../hooks/availability";
import { useUpcomingAppointmentsByStylistId } from "@/hooks/appointments";
import { useUpcomingTimeOffsByStylistId } from "../hooks/timeOffs";
import {
  useServiceConfigurations,
  useConfigByFKs,
} from "@/hooks/serviceConfigurations";
import { DEFAULT_STYLIST } from "../constants";
import { CONFIRMATION, ERROR } from "@/static/paths";
import { SpeciesStep } from "./BookingSteps/SpeciesStep";
import { ServiceStep } from "./BookingSteps/ServiceStep";
import { PersonalStep } from "./BookingSteps/PersonalStep";
import { PetStep } from "./BookingSteps/PetStep";
import { DateTimeStep } from "./BookingSteps/DateTimeStep";
import { ReviewStep } from "./BookingSteps/ReviewStep";
import { LoadingSpinnerButton } from "./LoadingSpinner";
import {
  BOOKING_STEPS,
  DEFAULT_STATUS,
  SPECIES as PET_SPECIES,
} from "../constants";

interface MultiStepFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Step 2
  petName: string;
  serviceId: number;
  breedId: number;
  weightClassId: number;

  // Step 3
  startDate: Date;
  stylistId: number;
  description: string;
}
const { BOOKING_MODAL_FIELD_TWO: BOOKING_MODAL_FIELD } = CLASSNAMES;
const { SPECIES, SERVICE, PET, DATE_TIME, PERSONAL, REVIEW } = BOOKING_STEPS;
const { DOG, CAT } = PET_SPECIES;

const TOTAL_STEPS = 6;

export function MultiStepFormModal({
  open,
  onOpenChange,
}: MultiStepFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepIsValid, setStepIsValid] = useState(false);
  const [showPersonalErrors, setShowPersonalErrors] = useState(false);
  const [showPetErrors, setShowPetErrors] = useState(false);
  const [showDateTimeErrors, setShowDateTimeErrors] = useState(false);
  const { bookingData, updateBookingData, resetBooking, removeStartTime } =
    useBooking();

  const { t } = useTranslation();
  const createClientMutation = useCreateClient();
  const createPetMutation = useCreatePet();
  const createAppMutation = useCreateAppointment();
  const navigate = useNavigate();

  const progress = (currentStep / TOTAL_STEPS) * 100;
  const clientLookupParams = {
    firstName: bookingData.firstName,
    lastName: bookingData.lastName,
    phone: bookingData.phone,
  };

  const steps = [
    {
      id: SPECIES,
      label: t("bookingModal.speciesStep"),
    },
    {
      id: SERVICE,
      label: t("bookingModal.serviceStep"),
    },
    {
      id: PET,
      label: t("bookingModal.petStep"),
    },
    {
      id: DATE_TIME,
      label: t("bookingModal.dateTimeStep"),
    },
    {
      id: PERSONAL,
      label: t("bookingModal.personalStep"),
    },
    {
      id: REVIEW,
      label: t("bookingModal.reviewStep"),
    },
  ];

  const {
    data: serviceData = [],
    isLoading: servicesIsLoading,
    error: servicesError,
  } = useServices();

  const {
    data: breedsData = [],
    isLoading: breedsIsLoading,
    error: breedsError,
  } = useBreeds();

  const {
    data: weightClassesData = [],
    isLoading: weightClassesIsLoading,
    error: weightClassesError,
  } = useWeightClasses();

  const {
    data: stylistAvailability = [],
    isLoading: availabilityIsLoading,
    error: availabilityError,
  } = useAvailabiltyByStylistId(DEFAULT_STYLIST);

  const {
    data: timeOffsData = [],
    isLoading: timeOffsIsLoading,
    error: timeOffsError,
  } = useUpcomingTimeOffsByStylistId(DEFAULT_STYLIST);

  const {
    data: stylistAppointmentsData = [],
    isLoading: appIsLoading,
    error: appError,
  } = useUpcomingAppointmentsByStylistId(DEFAULT_STYLIST);

  const {
    data: configData,
    isLoading: configIsLoading,
    error: configError,
  } = useConfigByFKs({
    serviceId: bookingData.service?.id,
    weightClassId: bookingData.weightClass?.id
  });

  const { refetch: lookupClientRefetch, isFetching: isLookingUpClient } =
    useLookupClient(clientLookupParams); // manual by default

  const isSubmitting =
    isLookingUpClient ||
    createClientMutation.isPending ||
    createPetMutation.isPending ||
    createAppMutation.isPending;

  const validateStep = () => {
    switch (currentStep) {
      case SPECIES:
        return bookingData?.petSpecies && stepIsValid;
      case SERVICE:
        return !!bookingData?.service?.id;
      case PERSONAL:
        return (
          !!bookingData?.firstName &&
          !!bookingData?.lastName &&
          !!bookingData?.phone &&
          stepIsValid
        );
      case PET: {
        const { petName, breed, weightClass, petSpecies } = bookingData;
        let petComplete = false;
        if (petSpecies === DOG) {
          petComplete = !!petName && !!weightClass?.id;
        }
        if (petSpecies == CAT) {
          petComplete = !!petName;
        }
        return petComplete && stepIsValid;
      }
      case DATE_TIME:
        return !!bookingData?.startTime && stepIsValid;
      case REVIEW: {
        const {
          petSpecies,
          firstName,
          lastName,
          phone,
          weightClass,
          service,
          petName,
          serviceConfig,
        } = bookingData;
        return (
          petSpecies &&
          firstName &&
          lastName &&
          phone &&
          weightClass?.id &&
          service?.id &&
          serviceConfig?.id &&
          petName
        );
      }
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === PET) {
      setShowPetErrors(true);
    }
    if (currentStep === DATE_TIME) {
      setShowDateTimeErrors(true);
    }
    if (currentStep === PERSONAL) {
      setShowPersonalErrors(true);
    }
    if (validateStep() && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      const { petName, breed, weightClass } = bookingData;
      try {
        const {
          firstName,
          lastName,
          phone,
          email,
          service,
          startTime,
          serviceConfig,
          status,
        } = bookingData;
        const appointmentForm = {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: email,
          pet_name: petName,
          breed: breed,
          weight_class_id: weightClass?.id,
          service_id: service?.id,
          stylist_id: bookingData.stylist_id || DEFAULT_STYLIST,
          start_time: startTime,
          description: bookingData.description || null,
          status: status || DEFAULT_STATUS,
        };
        const appointment =
          await createAppMutation.mutateAsync(appointmentForm);
        if (appointment) {
          navigate(`${CONFIRMATION}${appointment?.id}`);
        } else navigate(ERROR);
      } catch (err) {
        navigate(ERROR);
      } finally {
        resetBooking();
      }
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      const RESET_DELAY_MS = 200;
      setTimeout(() => {
        setCurrentStep(1);
        setStepIsValid(false);
        setShowPersonalErrors(false);
        setShowPetErrors(false);
        setShowDateTimeErrors(false);
        resetBooking();
      }, RESET_DELAY_MS);
    }
    onOpenChange(nextOpen);
  };

  const handleNavigate = (step: number) => {
    setCurrentStep(step);
  };

  // useEffect(() => {
  //   if (bookingData.service?.id) {
  //     setCurrentStep(PET);
  //   }
  // }, [bookingData.service?.id]);

  useEffect(() => {
    const {petSpecies} = bookingData;
    if(petSpecies === CAT){
      updateBookingData({weightClass: {
      code: "",
      id: 1,
      label: "",
      weight_bounds: [-1, -1],
      }})
    }
  }, [bookingData.petSpecies])
  useEffect(() => {
    if (currentStep !== PERSONAL && showPersonalErrors) {
      setShowPersonalErrors(false);
    }

    if (currentStep !== PET && showPetErrors) {
      setShowPetErrors(false);
    }

    if (currentStep !== DATE_TIME && showDateTimeErrors) {
      setShowDateTimeErrors(false);
    }
  }, [currentStep, showPersonalErrors, showPetErrors, showDateTimeErrors]);

  useEffect(() => {
    if (
      !configData?.id ||
      !configData?.weight_class_id ||
      !configData?.service_id
    )
      return;
    const { id, duration_minutes, buffer_minutes, price } = configData;
    if (
      bookingData?.serviceConfig?.id === id &&
      bookingData?.serviceConfig?.duration_minutes === duration_minutes &&
      bookingData?.serviceConfig?.buffer_minutes === buffer_minutes &&
      bookingData?.serviceConfig?.price === price
    )
      return;
    updateBookingData({
      serviceConfig: { id, duration_minutes, buffer_minutes, price },
    });
  }, [configData, updateBookingData]);

  const renderStep = () => {
    switch (currentStep) {
      case SPECIES:
        return (
          <SpeciesStep
            onValidityChange={(isValid) => setStepIsValid(isValid)}
          />
        );
      case SERVICE:
        return <ServiceStep serviceData={serviceData} />;
      case PET:
        return (
          <PetStep
            weightClassesData={weightClassesData}
            breedsData={breedsData}
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showPetErrors}
          />
        );

      case DATE_TIME:
        return (
          <DateTimeStep
            availabilityData={stylistAvailability}
            timeOffsData={timeOffsData}
            appointmentsData={stylistAppointmentsData}
            configData={configData}
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showDateTimeErrors}
          />
        );
      case PERSONAL:
        return (
          <PersonalStep
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showPersonalErrors}
          />
        );

      case REVIEW:
        return <ReviewStep onEdit={handleNavigate} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("bookingModal.title")}</DialogTitle>
          <DialogDescription>
            {t('bookingModal.step', {current: currentStep, total: TOTAL_STEPS})}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className={BOOKING_MODAL_FIELD}>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center size-8 rounded-full border-2 transition-colors ${
                    currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted-foreground/25 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="size-4" />
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="py-4">{renderStep()}</div>
        {currentStep >= 1 && (
          <DialogFooter className="flex-row justify-between sm:justify-between">
            {currentStep === SPECIES ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="w-1/2 active:bg-gray-200 active:border-gray-300 active:text-gray-900 active:scale-95 transition"
              >
                {t("general.cancel")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="w-1/2 active:bg-gray-200 active:border-gray-300 active:text-gray-900 active:scale-95 transition"
              >
                {t("general.back")}
              </Button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="w-1/2 active:bg-emerald-600 active:border-emerald-600 active:text-white active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!validateStep() || isSubmitting}
              >
                {t('general.next')}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="w-1/2 active:bg-emerald-600 active:border-emerald-600 active:text-white active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={!validateStep() || isSubmitting}
                >
                  {isSubmitting ? <LoadingSpinnerButton size="sm" /> : t('general.submit')}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
