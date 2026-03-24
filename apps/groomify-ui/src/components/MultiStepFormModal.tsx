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
import { getPetByOwner } from "@/api/pets";
import { useCreateAppointment } from "@/hooks/appointments";
import { useServices } from "../hooks/services";
import { useBreeds } from "../hooks/breeds";
import { useWeightClasses } from "../hooks/weightClasses";
import { useAvailabiltyByStylistId } from "../hooks/availability";
import { useUpcomingAppointmentsByStylistId } from "@/hooks/appointments";
import { useUpcomingTimeOffsByStylistId } from "../hooks/timeOffs";
import { useConfigByFKs } from "@/hooks/serviceConfigurations";
import {
  DEFAULT_STYLIST,
  serviceImageMap,
  defaultImage,
} from "../constants";
import { CONFIRMATION, ERROR } from "@/static/paths";
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
const { SERVICE, PET, DATE_TIME, PERSONAL, REVIEW } =
  BOOKING_STEPS;

const TOTAL_STEPS = 5;

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
  const [ownerId, setOwnerId] = useState<number | null>(null);

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
    breedId: bookingData.breed?.id,
    weightClassId: bookingData.weightClass?.id,
  });

  const { refetch: lookupClientRefetch, isFetching: isLookingUpClient } =
    useLookupClient(clientLookupParams); // manual by default

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
      let resolvedOwnerId = null;
      let resolvedPetId = null;
      const { petName, breed, weightClass } = bookingData;
      try {
        const client = await lookupClientRefetch();
        if (client.isSuccess) {
          //client is found
          resolvedOwnerId = client.data?.id ?? null;

          //look up pets owned by client
          const ownedPets = await getPetByOwner(resolvedOwnerId);
          if (ownedPets) {
            //pets are found
            console.log(ownedPets);
            const findPet = ownedPets.find(
              //find the pet by name, breed id, and wc id
              (pet) =>
                pet.name === petName &&
                pet.breed_id === breed.id &&
                pet.weight_class_id === weightClass?.id,
            );
            if (findPet) {
              resolvedPetId = findPet.id;
            } else {
              //create pet if not found, using client id as owner
              const petForm = {
                owner: resolvedOwnerId,
                name: petName,
                weight_class_id: weightClass.id,
                breed: breed.id,
              };
              const createPet = await createPetMutation.mutateAsync(petForm);
              if (createPet.id) {
                resolvedPetId = createPet.id;
              }
            }
          }
        } else {
          //if client not exist, create the client and pet
          const { firstName, lastName, phone, email } = bookingData;
          const clientForm = {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email || null,
          };

          const client = await createClientMutation.mutateAsync(clientForm);
          if (client) {
            console.log(client);
            resolvedOwnerId = client.id;
            const petForm = {
              name: petName,
              breed: breed?.id,
              weightClassId: weightClass?.id,
              owner: client?.id,
            };
            const createPet = await createPetMutation.mutateAsync(petForm);
            if (createPet.id) {
              resolvedPetId = createPet.id;
            }
          }
        }
        const { service, startTime, serviceConfig, status } = bookingData;
        const appointmentForm = {
          client_id: resolvedOwnerId,
          pet_id: resolvedPetId,
          service_id: service.id,
          service_configuration_id: serviceConfig?.id,
          stylist_id: bookingData.stylist_id,
          start_time: startTime,
          description: bookingData.description || null,
          status
        };
        const appointment = await createAppMutation.mutateAsync(appointmentForm);
        let path;
        if(appointment){
          console.log('success');
          path = `${CONFIRMATION}${appointment?.id}`;
        }
        else {
          path = ERROR;
        }
        navigate(path);
      } catch (err) {
        console.log(err);
        navigate(ERROR);
      }
      finally{
        resetBooking();
        setCurrentStep(1);
        onOpenChange(false);
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
    if (
      !configData?.id ||
      !configData?.breed_id ||
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
            Step {currentStep} of {TOTAL_STEPS}
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
            {currentStep < TOTAL_STEPS ? (
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
