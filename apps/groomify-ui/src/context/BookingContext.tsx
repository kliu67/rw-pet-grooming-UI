import { createContext, useContext, useState, ReactNode } from "react";
import { DEFAULT_STYLIST, DEFAULT_STATUS } from "@/constants";
export interface BookingData {
  service?: {
    id: number;
    name: string;
    base_price: string;
    code: string;
    description: string;
    uuid: string;
  };
  date?: string;
  time?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  petName: string;
  petSpecies: string;
  weightClass: {
    id: number;
    code: string;
    label: string;
    weight_bounds: [number, number];
  };
  breed: {
    id: number;
    name: string;
  };
  serviceConfig: {
    id: number;
    buffer_minutes: number;
    duration_minutes: number;
    price: string;
  };
  stylist_id: number;
  startTime: string;
  status: string;
  description?: string;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
  removeStartTime: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  
    const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    petName: "",
    petSpecies: "",
    service: {
      base_price: "",
      code: "",
      description: "",
      id: null,
      name: "",
      uuid: "",
    },
    weightClass: {
      code: "",
      id: null,
      label: "",
      weight_bounds: [-1, -1],
    },
    breed: {
      id: null,
      name: "",
    },
    serviceConfig:{
      id: null,
      duration_minutes: null,
      buffer_minutes: -1,
      price: "",
    },
    stylist_id: DEFAULT_STYLIST,
    startTime: "",
    status: DEFAULT_STATUS,
  });


  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData({});
  };

  const removeStartTime = () => {
    const { startTime, ...rest } = bookingData;
    setBookingData({ ...rest });
  };

  return (
    <BookingContext.Provider
      value={{ bookingData, updateBookingData, resetBooking, removeStartTime }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}
