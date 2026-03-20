import React from "react";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
  defaultImage
} from "../constants";
import { ServiceCard } from "./ServiceCard";
import { PersonalStep } from "./BookingSteps/PersonalStep";
import { PetStep } from "./BookingSteps/PetStep";
import { DateTimeStep } from "./BookingSteps/DateTimeStep";
import { ReviewStep } from "./BookingSteps/ReviewStep";

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
export function MultiStepFormModal({
  open,
  onOpenChange
}: MultiStepFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepIsValid, setStepIsValid] = useState(false);
  const [showPersonalErrors, setShowPersonalErrors] = useState(false);
  const [showPetErrors, setShowPetErrors] = useState(false);
  const [stepForm, setStepForm] = useState({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "Kai",
    lastName: "Liu",
    email: "derekkailiu@gmail.com",
    phone: "6476172401",

    petName: "test Pet",
    serviceId: 36,
    breedId: 3,
    weightClassId: 4,

    startDate: "",
    stylistId: "",
    description: ""
  });
  const { bookingData, updateBookingData } = useBooking();

  const [personalForm, setPersonalForm] = useState({
    firstName: bookingData.personalInfo?.firstName || "",
    lastName: bookingData.personalInfo?.lastName || "",
    email: bookingData.personalInfo?.email || "",
    phone: bookingData.personalInfo?.phone || ""
  });

  const { t } = useTranslation();
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      label: t("bookingModal.serviceStep")
    },
    {
      id: 2,
      label: t("bookingModal.personalStep")
    },
    {
      id: 3,
      label: t("bookingModal.petStep")
    },
    {
      id: 4,
      label: t("bookingModal.dateTimeStep")
    },
    {
      id: 5,
      label: t("bookingModal.reviewStep")
    }
  ];

  const {
    data: serviceData = [],
    isLoading: servicesIsLoading,
    error: servicesError
  } = useServices();

  const {
    data: breedsData = [],
    isLoading: breedsIsLoading,
    error: breedsError
  } = useBreeds();

  const {
    data: weightClassesData = [],
    isLoading: weightClassesIsLoading,
    error: weightClassesError
  } = useWeightClasses();

  const {
    data: stylistAvailability = [],
    isLoading: availabilityIsLoading,
    error: availabilityError
  } = useAvailabiltyByStylistId(DEFAULT_STYLIST);

  const {
    data: timeOffsData = [],
    isLoading: timeOffsIsLoading,
    error: timeOffsError
  } = useUpcomingTimeOffsByStylistId(DEFAULT_STYLIST);

  const {
    data: stylistAppointmentsData = [],
    isLoading: appIsLoading,
    error: appError
  } = useUpcomingAppointmentsByStylistId(DEFAULT_STYLIST);

  const {
    data: configData = {},
    isLoading: configIsLoading,
    error: configError
  } = useConfigByFKs({
    serviceId: formData.serviceId,
    breedId: formData.breedId,
    weightClassId: formData.weightClassId
  });

  const services = serviceData.map((service) => {
    const match = staticServiceData.find((s) => s.code === service.code);
    return {
      name: service.name,
      price: `From $${service.base_price}`,
      description: service.description,
      code: service.code
    };
  });

  const updateFormData = (field: keyof FormData, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    console.log(formData);
  };

  const updatePersonalForm = (field: keyof FormData, value) => {
    setPersonalForm((prev) => ({ ...prev, [field]: value }));
    console.log(personalForm);
  };

  const updateStepForm = (field: keyof FormData, value) => {
    setStepForm((prev) => ({ ...prev, [field]: value }));
    console.log(`stepform:`);
    console.log(stepForm);
    console.log("booking data: ");
    console.log(bookingData);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return stepForm.serviceId;
      case 2:
        return (
          stepForm.firstName &&
          stepForm.lastName &&
          stepForm.phone &&
          stepIsValid
        );
      case 3:
        return formData.petName && formData.breedId && formData.weightclassId;
      case 4:
        return formData.startDate;
      default:
        return false;
    }
  };

const handleNext = (form: FormData) => {
    if (currentStep === 2) {
      setShowPersonalErrors(true);
    }
    if (currentStep === 3) {
      setShowPetErrors(true);
    }
    if (validateStep && currentStep < totalSteps) {
      updateBookingData({...form});
      setStepForm({});
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
    setStepForm({});
    setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log("Form submitted:", formData);
      // Reset form and close modal
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        petName: "",
        serviceId: "",
        breedid: "",
        weightclassid: "",

        startDate: "",
        stylistId: "",
        description: ""
      });
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
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",

          petName: "",
          serviceId: "",
          breedid: "",
          weightclassid: "",

          startDate: "",
          stylistId: "",
          description: ""
        });
      }, RESET_DELAY_MS);
    }
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (bookingData.serviceId) {
      setCurrentStep(2);
    }
  }, [bookingData.serviceId]);

  useEffect(() => {
    if (currentStep !== 2 && showPersonalErrors) {
      setShowPersonalErrors(false);
    }

    if (currentStep !== 3 && showPetErrors) {
      setShowPetErrors(false);
    }
  }, [currentStep, showPersonalErrors, showPetErrors]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
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
                        const nextForm = { ...stepForm, [field]: value };
                        handleNext(nextForm);
                      }}
                    />
                  );
                })}
            </div>
          </div>
        );
      case 2:
        return (
          <PersonalStep
            formData={stepForm}
            // updateFormData={updateFormData}
            updateFormData={updateStepForm}
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showPersonalErrors}
          />
        );

      case 3:
        return (
          <PetStep
            formData={stepForm}
            updateFormData={updateStepForm}
            weightClassesData={weightClassesData}
            breedsData={breedsData}
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showPetErrors}
          />
        );

      case 4:
        return (
          <DateTimeStep
            formData={formData}
            updateFormData={updateFormData}
            availabilityData={stylistAvailability}
            timeOffsData={timeOffsData}
            appointmentsData={stylistAppointmentsData}
            configData={configData}
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showPetErrors}
          />
        );
      case 5:
        return <ReviewStep formData={formData} />;
        return null;
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
                // disabled={currentStep === 1}
              >
                {t("general.cancel")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                // disabled={currentStep === 1}
              >
                {t("general.back")}
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={currentStep === 2 && !validateStep()}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="disabled:opacity-60 disabled:cursor-not-allowed"
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
