import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { Progress } from "./ui/progress";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CLASSNAMES } from "../styles/classNames";
import { Calendar } from "./ui/calendar";
import { useServices } from "../hooks/services";
import { useBreeds } from "../hooks/breeds";
import { useWeightClasses } from "../hooks/weightClasses";
import { useAvailabiltyById } from "../hooks/availability";
import { useTimeOffById } from "../hooks/timeOffs";
import {
  DEFAULT_STYLIST,
  staticServiceData,
  serviceImageMap,
  defaultImage
} from "../constants";
import { ServiceCard } from "./ServiceCard";
import { PersonalStep } from "./PersonalStep";
import { PetStep } from "./PetStep";

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
  appStartDate: Date;
  appStylistId: number;
  appRemarks: string;
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
  const [formData, setFormData] = useState<FormData>({
    firstName: "Kai",
    lastName: "Liu",
    email: "derekkailiu@gmail.com",
    phone: "6476172401",

    petName: "test Pet",
    serviceId: "1",
    breedId: 1,
    weightClassId: 1,

    startDate: "",
    stylistId: "",
    message: ""
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
    data: availabilityData = [],
    isLoading: availabilityIsLoading,
    error: availabilityError
  } = useAvailabiltyById(DEFAULT_STYLIST);

  const {
    data: timeOffsData = [],
    isLoading: timeOffsIsLoading,
    error: timeOffsError
  } = useTimeOffById(DEFAULT_STYLIST);

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

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.serviceId;
      case 2:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.phone &&
          stepIsValid
        );
      case 3:
        return formData.petName &&
        formData.breedid &&
        formData.weightclassid;
      case 4:
        return formData.interests && formData.message;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      setShowPersonalErrors(true);
    }
    if (currentStep === 3) {
      setShowPetErrors(true);
    }
    if (validateStep && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // if (currentStep > 1) {
    setCurrentStep((prev) => prev - 1);
    // }
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
        message: ""
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
          message: ""
        });
      }, RESET_DELAY_MS);
    }
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (formData.serviceId) {
      setCurrentStep(2);
    }
  }, [formData.serviceId]);

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
                        String(formData.serviceId) === String(service?.id)
                      }
                      onClick={(field, value) => {
                        setCurrentStep(2);
                        updateFormData(field, value);
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
            formData={formData}
            updateFormData={updateFormData}
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showPersonalErrors}
          />
        );

      case 3:
        return (
          <PetStep
            formData={formData}
            updateFormData={updateFormData}
            weightClassesData={weightClassesData}
            breedsData={breedsData}
            onValidityChange={(isValid) => setStepIsValid(isValid)}
            showErrors={showPetErrors}
          />
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="date">{t("bookingModal.date")}</Label>
              <Calendar></Calendar>
            </div>
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="message">{t("bookingModal.message")}</Label>
              <Textarea
                id="message"
                placeholder={t("placeholder.message")}
                className="min-h-32"
                value={formData.message}
                onChange={(e) => updateFormData("message", e.target.value)}
              />
            </div>
          </div>
        );
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
