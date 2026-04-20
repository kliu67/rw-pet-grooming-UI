import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useBooking } from "@/context/BookingContext";
import { Dog, Cat } from "lucide-react";
import { SPECIES } from "@/constants";

export const SpeciesStep = ({ onValidityChange }) => {
  const { bookingData, updateBookingData } = useBooking();

  const { t } = useTranslation();
  const { DOG, CAT } = SPECIES;
  const species = bookingData?.petSpecies || "";
  const stepIsValid = !!species;
  const cardBaseClasses =
    "group relative overflow-hidden p-7 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-xl";

  useEffect(() => {
    onValidityChange(stepIsValid);
  }, [stepIsValid, onValidityChange]);


  const handleSpeciesChange = (nextSpecies) => {
    if (nextSpecies !== bookingData.petSpecies) {
      const { firstName, lastName, phone, email } = bookingData;
      updateBookingData({
        petSpecies: nextSpecies,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        phone: phone ?? "",
        email: email ?? "",
        petName: "",
        service: {
          id: null,
          name: "",
          base_price: "",
          code: "",
          description: "",
          uuid: "",
        },
        breed: "",
        weightClass: {
          id: null,
          code: "",
          label: "",
          weight_bounds: [-1, -1],
        },
        serviceConfig: {
          id: null,
          duration_minutes: null,
          buffer_minutes: -1,
          price: "",
        },
        startTime: "",
        description: "",
      });
    }
  };


  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold">{t('speciesStep.selectSpecies')}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => handleSpeciesChange(DOG)}
          className={`${cardBaseClasses} ${
            species === DOG
              ? "border-emerald-500 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 ring-2 ring-emerald-200"
              : "border-gray-300 bg-gradient-to-br from-gray-100 via-gray-50 to-emerald-50/50 hover:border-emerald-300 hover:bg-gradient-to-br hover:from-gray-100 hover:to-emerald-100/50"
          }`}
        >
          <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-emerald-200/30 blur-2xl transition-opacity group-hover:opacity-100 opacity-70" />
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 group-hover:scale-110 border ${
                species === DOG
                  ? "bg-emerald-100 border-emerald-200 shadow-sm"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <Dog
                className={`w-12 h-12 ${
                  species === DOG ? "text-emerald-600" : "text-gray-600"
                }`}
              />
            </div>
            <span className="font-medium text-lg">{t('speciesStep.dog')}</span>
          </div>
          <AnimatePresence>
            {species === DOG && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-3 right-3 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-md"
              >
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          type="button"
          onClick={() => handleSpeciesChange(CAT)}
          className={`${cardBaseClasses} ${
            species === CAT
              ? "border-emerald-500 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 ring-2 ring-emerald-200"
              : "border-gray-300 bg-gradient-to-br from-gray-100 via-gray-50 to-emerald-50/50 hover:border-emerald-300 hover:bg-gradient-to-br hover:from-gray-100 hover:to-emerald-100/50"
          }`}
        >
          <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-emerald-200/30 blur-2xl transition-opacity group-hover:opacity-100 opacity-70" />
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 group-hover:scale-110 border ${
                species === CAT
                  ? "bg-emerald-100 border-emerald-200 shadow-sm"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <Cat
                className={`w-12 h-12 ${
                  species === CAT ? "text-emerald-600" : "text-gray-600"
                }`}
              />
            </div>
            <span className="font-medium text-lg">{t('speciesStep.cat')}</span>
          </div>
          <AnimatePresence>
            {species === CAT && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-3 right-3 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-md"
              >
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};
