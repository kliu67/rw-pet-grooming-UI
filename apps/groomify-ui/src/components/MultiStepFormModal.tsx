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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Check } from "lucide-react";

interface MultiStepFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  
  // Step 2
  company: string;
  position: string;
  experience: string;
  
  // Step 3
  interests: string;
  message: string;
}

export function MultiStepFormModal({ isOpen, onOpenChange }: MultiStepFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    experience: "",
    interests: "",
    message: "",
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

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
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
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
        company: "",
        position: "",
        experience: "",
        interests: "",
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
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => updateFormData("company", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Enter your position"
                value={formData.position}
                onChange={(e) => updateFormData("position", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => updateFormData("experience", value)}
              >
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select experience level" />
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
            <div className="space-y-2">
              <Label htmlFor="interests">Areas of Interest</Label>
              <Input
                id="interests"
                placeholder="e.g., Design, Development, Marketing"
                value={formData.interests}
                onChange={(e) => updateFormData("interests", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Tell us about yourself</Label>
              <Textarea
                id="message"
                placeholder="Share your goals and what you're looking for..."
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="flex items-center gap-2"
              >
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
                  {step === 1 ? "Personal" : step === 2 ? "Professional" : "Additional"}
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
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!validateStep()}
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
