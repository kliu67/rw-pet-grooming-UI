import { createContext, useContext, useState, ReactNode } from 'react';

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
  // personalInfo?: {
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   phone: string;
  //   notes?: string;
  // };
   firstName: string;
    lastName: string;
    email: string;
    phone: string;
    petName: string;
    weightClass:{
      id: number;
      code: string;
      label: string
      weight_bounds: [number, number];
    };
    breed: {
      id: number;
      name: string;
    }
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: 'Kai',
    lastName: 'Liu',
    phone: '1234567890',
    email: 'derekkailiu@gmail.com',
    petName: 'Lou',
    service:{
      base_price: "40.00",
      code: "BATH_BRUSH",
      description: "description",
      id: 35,
      name: "Bath&Brush",
      uuid: "0855aa36-21b7-48ce-8625-252767cafe47"
    },
    weightClass:{
      code: "LARGE",
      id: 3,
      label: "large",
      weight_bounds: [41, 60]
    },
    breed:{
      id:15,
      name: "Alpine Spaniel"
    }
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData({});
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
