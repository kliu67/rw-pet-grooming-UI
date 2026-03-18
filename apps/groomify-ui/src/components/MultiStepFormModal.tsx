import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CLASSNAMES } from "../styles/classNames";
import { DropdownMenu } from "./ui/dropdown-menu";
import { Calendar } from "./ui/calendar";
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
  breed: number;
  weight: number;

  // Step 3
  appStartDate: Date;
  appStylistId: number;
  appRemarks: string;
}
const { BOOKING_MODAL_FIELD_TWO: BOOKING_MODAL_FIELD } = CLASSNAMES;
export function MultiStepFormModal({
  open,
  onOpenChange,
}: MultiStepFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    petName: "",
    breed: "",
    weight: "",

    startDate: "",
    stylistId: "",
    message: "",
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;
  const { t } = useTranslation();

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return formData.company && formData.position && formData.experience;
      case 3:
        return formData.interests && formData.message;
      default:
        return false;
    }
  };

  const handleNext = () => {
    // if (validateStep() && currentStep < totalSteps) {
    setCurrentStep((prev) => prev + 1);
    // }
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
        breed: "",
        weight: "",

        startDate: "",
        stylistId: "",
        message: "",
      });
      setCurrentStep(1);
      onOpenChange(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="firstName">{t("bookingModal.firstName")}</Label>
              <Input
                id="firstName"
                placeholder={t("placeholder.firstName")}
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
              />
            </div>
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="lastName">{t("bookingModal.lastName")}</Label>
              <Input
                id="lastName"
                placeholder={t("placeholder.lastName")}
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
              />
            </div>
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="phone">{t("bookingModal.phone")}</Label>
              <Input
                id="phone"
                type="email"
                placeholder={t("placeholder.phone")}
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
              />
            </div>
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="email">{t("bookingModal.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("placeholder.phone")}
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="pet-name">{t("bookingModal.petName")}</Label>
              <Input
                id="pet-name"
                placeholder={t("placeholder.petName")}
                value={formData.petName}
                onChange={(e) => updateFormData("petName", e.target.value)}
              />
            </div>
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="breed">{t("bookingModal.breed")}</Label>
              <Select
                value={formData.breed}
                onValueChange={(value) => updateFormData("breed", value)}
              >
                <SelectTrigger id="breed">
                  <SelectValue placeholder={t("placeholder.breed")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="weight">{t("bookingModal.weight")}</Label>
              <Select
                value={formData.weight}
                onValueChange={(value) => updateFormData("weight", value)}
              >
                <SelectTrigger id="weight">
                  <SelectValue placeholder={t("placeholder.weight")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className={BOOKING_MODAL_FIELD}>
              <Label htmlFor="date">{t("bookingModal.date")}</Label>
              {/* <Input
                id="interests"
                placeholder="e.g., Design, Development, Marketing"
                value={formData.interests}
                onChange={(e) => updateFormData("interests", e.target.value)}
              /> */}
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

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('bookingModal.title')}</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className={BOOKING_MODAL_FIELD}>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center size-8 rounded-full border-2 transition-colors ${
                    currentStep > step
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step
                        ? "border-primary text-primary"
                        : "border-muted-foreground/25 text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? (
                    <Check className="size-4" />
                  ) : (
                    <span className="text-sm">{step}</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {step === 1
                    ? t('bookingModal.personalStep')
                    : step === 2
                      ? t('bookingModal.petStep')
                      : t('bookingModal.dateTimeStep')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="py-4">{renderStep()}</div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            // disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              // disabled={!validateStep()}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!validateStep()}
            >
              Submit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
