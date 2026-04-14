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
          className={`group relative p-8 rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 ${
            species === DOG
              ? "border-emerald-500 bg-emerald-50 shadow-lg"
              : "border-gray-200 hover:border-emerald-300 bg-white"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 group-hover:scale-110 ${
                species === DOG ? "bg-emerald-100" : "bg-gray-100"
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
                className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          type="button"
          onClick={() => handleSpeciesChange(CAT)}
          className={`group relative p-8 rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 ${
            species === CAT
              ? "border-emerald-500 bg-emerald-50 shadow-lg"
              : "border-gray-200 hover:border-emerald-300 bg-white"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 group-hover:scale-110 ${
                species === CAT ? "bg-emerald-100" : "bg-gray-100"
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
                className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};
