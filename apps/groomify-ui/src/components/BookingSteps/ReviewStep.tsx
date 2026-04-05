import { useTranslation } from "react-i18next";
import { useBooking } from "@/context/BookingContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Edit2,
  Dog,
  Bone,
  PawPrint,
  MessageSquare,
} from "lucide-react";
import { BOOKING_STEPS } from "@/constants";
export const ReviewStep = ({ onEdit = (step) => {} }) => {
  const { SERVICE, PERSONAL, DATE_TIME } = BOOKING_STEPS;
  const handleEdit = (step) => {
    onEdit(step);
  };
  const locale = "en-US";
  const { t } = useTranslation();
  const { bookingData } = useBooking();
  const {
    service,
    startTime,
    serviceConfig,
    petName,
    breed,
    weightClass,
    description,
  } = bookingData;

  if (
    !bookingData.service ||
    !bookingData.startTime ||
    !bookingData.serviceConfig ||
    !bookingData.petName ||
    !bookingData.breed ||
    !bookingData.weightClass
  ) {
    return null;
    //TODO add error state
  }
  const dateTime = new Date(startTime);
  const localDateString = dateTime.toLocaleDateString(locale);
  const localTimeString = dateTime.toLocaleTimeString(locale);

  const priceModifier =
    Number(serviceConfig?.price || 0) - Number(service?.base_price || 0);
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleEdit(PERSONAL);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Booking Summary</h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Service Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Service Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleEdit(SERVICE);
                }}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-lg font-medium">{service?.name}</p>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Dog className="h-4 w-4" />
                  <span>{petName}</span>
                  <Bone className="h-4 w-4" />
                  <span>{breed.name}</span>
                  <PawPrint className="h-4 w-4" />
                  <span>{weightClass.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Date & Time
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleEdit(DATE_TIME);
                }}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {`${localDateString} - ${localTimeString}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{`${serviceConfig.duration_minutes} minutes`}</span>
                </div>
              </div>

              {description && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="h-4 w-4" />{" "}
                    <p className="text-sm text-gray-600">Message</p>
                    <span>{description}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                {t('reviewStep.customerInfo')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleEdit(PERSONAL);
                }}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium">
                  {bookingData.firstName} {bookingData.lastName}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{bookingData.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{bookingData.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="rounded-lg bg-indigo-50 p-5">
            <h3 className="mb-4">{t('reviewStep.priceEstimate')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('reviewStep.basePrice')}</span>
                <span className="font-medium">
                  ${(service.base_price * 1.0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('reviewStep.weightCharge')}</span>
                <span className="font-medium">${priceModifier.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">{t('reviewStep.totalAmount')}</span>
                <span className="font-medium text-indigo-600">
                  ${(serviceConfig.price * 1.0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-600">
              By confirming this booking, you agree to our{" "}
              <button className="text-indigo-600 hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-indigo-600 hover:underline">
                Cancellation Policy
              </button>
              .
              {/* You will receive a confirmation email at {bookingData.personalInfo.email}. */}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
