import React from "react";
import { useBooking } from "@/context/BookingContext";
import {
  serviceImageMap,
  defaultImage,
} from "../../constants";
import { ServiceCard } from "../ServiceCard";

export const ServiceStep = ({ serviceData = [] }) => {
  const { bookingData, updateBookingData } = useBooking();
  const filteredServices = serviceData.filter((service)=> service.service_species === bookingData.petSpecies);
  const handleServiceChange = (service) => {
    const currentServiceId = bookingData?.service?.id;
    const nextServiceId = service?.id;
    if (String(currentServiceId) === String(nextServiceId)) {
      return;
    }

    updateBookingData({
      service,
      startTime: "",
      serviceConfig: {
        id: null,
        duration_minutes: null,
        buffer_minutes: -1,
        price: "",
      },
    });
  };
  return (
    <div className="space-y-4">
      <div
        id="services-container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {filteredServices.length > 0
          ? filteredServices
            .map((service) => {
              const image = serviceImageMap[service?.code] ?? defaultImage;
              return (
                <ServiceCard
                  key={service?.id}
                  service={service}
                  image={image}
                  isSelected={
                    String(bookingData?.service?.id) === String(service?.id)
                  }
                  onClick={() => handleServiceChange(service)}
                />
              );
            })
          : <p>No services available</p>}
      </div>
    </div>
  );
};
