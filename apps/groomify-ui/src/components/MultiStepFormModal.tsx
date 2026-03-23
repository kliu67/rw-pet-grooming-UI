import React from "react";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
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
import { useServices } from "../hooks/services";
import { useBreeds } from "../hooks/breeds";
import { useWeightClasses } from "../hooks/weightClasses";
import { useAvailabiltyByStylistId } from "../hooks/availability";
import { useUpcomingAppointmentsByStylistId } from "@/hooks/appointments";
import { useUpcomingTimeOffsByStylistId } from "../hooks/timeOffs";
import { useConfigByFKs } from "@/hooks/serviceConfigurations";
import {
  DEFAULT_STYLIST,
  staticServiceData,
  serviceImageMap,
  defaultImage,
} from "../constants";
import { ServiceCard } from "./ServiceCard";
import { PersonalStep } from "./BookingSteps/PersonalStep";
import { PetStep } from "./BookingSteps/PetStep";
import { DateTimeStep } from "./BookingSteps/DateTimeStep";
import { ReviewStep } from "./BookingSteps/ReviewStep";
import { BOOKING_STEPS } from "../constants";

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
const { SERVICE, PET, DATE_TIME, PERSONAL, REVIEW, CONFIRMATION } =
  BOOKING_STEPS;

export function MultiStepFormModal({
  open,
  onOpenChange,
}: MultiStepFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepIsValid, setStepIsValid] = useState(false);
  const [showPersonalErrors, setShowPersonalErrors] = useState(false);
  const [showPetErrors, setShowPetErrors] = useState(false);
  const [showDateTimeErrors, setShowDateTimeErrors] = useState(false);
  const { bookingData, updateBookingData, resetBooking, removeStartTime } = useBooking();

  const { t } = useTranslation();
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;
  const steps = [
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
    data: configData = {},
    isLoading: configIsLoading,
    error: configError,
  } = useConfigByFKs({
    serviceId: bookingData.service?.id,
    breedId: bookingData?.breed?.id,
    weightClassId: bookingData?.weightClass?.id,
  });

  const validateStep = () => {
    switch (currentStep) {
      case SERVICE:
        return true;
      case PERSONAL:
        return (
          !!bookingData?.firstName &&
          !!bookingData?.lastName &&
          !!bookingData?.phone &&
          stepIsValid
        );
      case PET: {
        const { breed, weightClass } = bookingData;
        return (
          !!bookingData?.petName &&
          !!breed?.id &&
          !!weightClass?.id &&
          stepIsValid
        );
      }
      case DATE_TIME:
        return !!bookingData?.startTime && stepIsValid;
      case REVIEW: {
        const {
          firstName,
          lastName,
          phone,
          breed,
          weightClass,
          service,
          petName,
        } = bookingData;
        return (
          firstName &&
          lastName &&
          phone &&
          breed?.id &&
          weightClass?.id &&
          service?.id &&
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
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      console.log("bookingData");
      console.log(bookingData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log("Form submitted:", bookingData);
      resetBooking();
      setCurrentStep(1);
      onOpenChange(false);
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

  useEffect(() => {
    if (bookingData.serviceId) {
      setCurrentStep(2);
    }
  }, [bookingData.serviceId]);

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
    if (configData) {
      updateBookingData({ serviceConfig: configData });
    }
  }, [configData]);

  const renderStep = () => {
    switch (currentStep) {
      case SERVICE:
        return (
          <div className="space-y-4">
            <div
              id="services-container"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {serviceData.length > 1 &&
                serviceData.map((service, index) => {
                  const image = serviceImageMap[service?.code] ?? defaultImage;
                  return (
                    <ServiceCard
                      key={service?.id}
                      service={service}
                      image={image}
                      isSelected={
                        String(bookingData?.serviceId) === String(service?.id)
                      }
                      onClick={(field, value) => {
                        const serviceForm = {
                          svcId: value?.id,
                          svcName: value?.name,
                          svcBasePrice: value?.base_price,
                          svcCode: value.code,
                        };
                        const { startTime, ...rest } = bookingData;
                        removeStartTime();
                        updateBookingData({ service: service, ...rest });
                        handleNext();
                      }}
                    />
                  );
                })}
            </div>
          </div>
        );

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
        return <ReviewStep onSubmit={handleNavigate} onEdit={handleNavigate} />;
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
            Step {currentStep} of {totalSteps}
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
        {currentStep > 1 && (
          <DialogFooter className="flex-row justify-between sm:justify-between">
            {currentStep === 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="active:bg-gray-200 active:border-gray-300 active:text-gray-900 active:scale-95 transition"
              >
                {t("general.cancel")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="active:bg-gray-200 active:border-gray-300 active:text-gray-900 active:scale-95 transition"
              >
                {t("general.back")}
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="active:bg-emerald-600 active:border-emerald-600 active:text-white active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!validateStep()}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="active:bg-emerald-600 active:border-emerald-600 active:text-white active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!validateStep()}
              >
                Submit
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
