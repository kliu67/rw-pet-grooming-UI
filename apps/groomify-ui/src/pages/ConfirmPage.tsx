import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getConfirm } from "@/api/appointmentConfirmations";
import {
  CheckCircle2,
  Calendar,
  Dog,
  Clock,
  Download,
  Mail,
  Phone,
  PawPrint,
  Loader
} from "lucide-react";
import { LOCALE, CONTACT_INFO } from "@/constants";
import { handleDownloadPdf } from "@shared-utils/pdf";

export const ConfirmPage = ({}) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { appId } = useParams();
  const { data: confirmData } = useQuery({
    queryKey: ["appointmentConfirmation", appId],
    queryFn: () => getConfirm(appId),
    enabled: !!appId,
  });

  const email = confirmData?.client_email;
  const phone = confirmData?.client_phone;

  const appointmentNumber = confirmData?.appointment_number;
  const serviceName = confirmData?.service_name;

  const dateTime = confirmData?.start_time
    ? new Date(confirmData.start_time)
    : null;
  const hasValidDateTime = Boolean(
    dateTime && !Number.isNaN(dateTime.getTime()),
  );
  const localDateString = hasValidDateTime
    ? dateTime.toLocaleDateString(LOCALE)
    : "-";
  const localTimeString = hasValidDateTime
    ? dateTime.toLocaleTimeString(LOCALE)
    : "-";
  const duration = confirmData?.duration_snapshot;

  const petName = confirmData?.pet_name;
  const petBreed = confirmData?.breed_name;
  const petSize = confirmData?.weight_class_label;

  const basePrice = confirmData?.service_base_price;
  const priceModifier =
    Number(confirmData?.price_snapshot) -
    Number(confirmData?.service_base_price);
  const totalPrice = confirmData?.price_snapshot;
  const localeNameString = `${confirmData?.client_first_name || '-'} ${confirmData?.client_last_name || '-'}`;

  const onDownloadClick = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await handleDownloadPdf({
        t,
        confirmData,
        localDateString,
        localTimeString,
        priceModifier,
        localeNameString,
        email,
        phone,
      });
    } catch (error) {
      console.error("PDF download failed", error);
      window.alert("Unable to generate the PDF right now. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div>
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {t("confirmStep.confirm")}
            </h1>
            <p className="text-gray-600 mb-4">{t("confirmStep.thankYou")}</p>
            <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
              <p className="text-sm text-gray-600 mb-1">
                {t("confirmStep.confirmNumber")}
              </p>
              {appointmentNumber ? (
                <p className="text-2xl font-semibold text-gray-900">
                  {appointmentNumber}
                </p>
              ): <Loader/>}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("confirmStep.details")}
            </h2>

            <div className="space-y-6">
              <div>
                {serviceName && (
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {serviceName}
                  </h3>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasValidDateTime && (
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">{`${t("confirmStep.date")} - ${t("confirmStep.time")}`}</p>
                      <p className="font-medium text-gray-900">
                        {localDateString}
                      </p>
                      <p className="text-sm text-gray-600">{localTimeString}</p>
                    </div>
                  </div>
                )}
                {duration && (
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("confirmStep.duration")}
                      </p>
                      <p className="text-sm text-gray-600">{`${duration} ${t("confirmStep.minutes")}`}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {petName && (
                  <div className="flex items-start">
                    <Dog className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("confirmStep.pet")}
                      </p>
                      <p className="font-medium text-gray-900">{petName}</p>
                    </div>
                  </div>
                )}
                {petBreed && petSize && (
                  <div className="flex items-start">
                    <PawPrint className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">{petBreed}</p>
                      <p className="text-sm text-gray-600">{`${petSize}`}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("confirmStep.priceEstimate")}
            </h2>
            {
              // basePrice && totalPrice && priceModifier &&
              <div className="space-y-3">
                {basePrice !== undefined && basePrice !== null && (
                  <div className="flex justify-between text-gray-700">
                    <span>{t("confirmStep.basePrice")}</span>
                    <span>{`$${basePrice}`}</span>
                  </div>
                )}
                {!Number.isNaN(priceModifier) && (
                  <div className="flex justify-between text-gray-700">
                    <span>{t("confirmStep.weightCharge")}</span>
                    <span>{`$${priceModifier}`}</span>
                  </div>
                )}
                {totalPrice !== undefined && totalPrice !== null && (
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg text-gray-900">
                    <span>{t("confirmStep.totalAmount")}</span>
                    <span>{`$${totalPrice}`}</span>
                  </div>
                )}
              </div>
            }
          </div>

          {/* Guest Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("confirmStep.customerInfo")}
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">{t("general.name")}</p>
                <p className="text-gray-900">{localeNameString}</p>
              </div>
              {email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              {t("confirmStep.reminder", {
                email: CONTACT_INFO.email,
                phone: CONTACT_INFO.phone,
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
            type="button"
            onClick={onDownloadClick}
            disabled={isDownloading || !confirmData}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? "Generating PDF..." : t("confirmStep.download")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {t("confirmStep.bookAnother")}
          </button>
        </div>
      </div>
    </div>
  );
};
