import React, { useEffect } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import { MultiStepFormModal } from "./MultiStepFormModal";
import { CONFIRMATION, ERROR } from "@/static/paths";

const navigateMock = vi.fn();
const createAppointmentMutateAsyncMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../hooks/services", () => ({
  useServices: () => ({
    data: [
      {
        id: 35,
        code: "BATH_BRUSH",
        name: "Bath&Brush",
        base_price: "40.00",
        service_species: "DOG",
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("../hooks/breeds", () => ({
  useBreeds: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock("../hooks/weightClasses", () => ({
  useWeightClasses: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock("../hooks/availability", () => ({
  useAvailabiltyByStylistId: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock("../hooks/timeOffs", () => ({
  useUpcomingTimeOffsByStylistId: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock("@/hooks/appointments", () => ({
  useUpcomingAppointmentsByStylistId: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
  useCreateAppointment: () => ({
    mutateAsync: (...args: any[]) => createAppointmentMutateAsyncMock(...args),
    isPending: false,
  }),
}));

vi.mock("@/hooks/serviceConfigurations", () => ({
  useConfigByFKs: () => ({
    data: {
      id: 190,
      breed_id: 10,
      weight_class_id: 2,
      service_id: 35,
      duration_minutes: 90,
      buffer_minutes: 20,
      price: "50.00",
    },
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@/hooks/clients", () => ({
  useLookupClient: () => ({
    refetch: vi.fn(),
    isFetching: false,
  }),
  useCreateClient: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/pets", () => ({
  useCreatePet: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/api/pets", () => ({
  getPetByOwner: vi.fn(),
}));

vi.mock("./ServiceCard", () => ({
  ServiceCard: ({ onClick, service }: any) => (
    <button
      type="button"
      data-testid={`service-card-${service.id}`}
      onClick={() => onClick()}
    >
      {service.name}
    </button>
  ),
}));

vi.mock("./BookingSteps/PetStep", async () => {
  const { useBooking } = await import("@/context/BookingContext");
  return {
    PetStep: ({ onValidityChange }: any) => {
      const { updateBookingData } = useBooking();
      useEffect(() => {
        updateBookingData({
          petName: "Test Pet",
          breed: { id: 10, name: "Akita" },
          weightClass: {
            id: 2,
            code: "MEDIUM",
            label: "Medium",
            weight_bounds: [21, 40],
          },
        });
        onValidityChange(true);
      }, []);
      return <div>pet-step</div>;
    },
  };
});

vi.mock("./BookingSteps/DateTimeStep", async () => {
  const { useBooking } = await import("@/context/BookingContext");
  return {
    DateTimeStep: ({ onValidityChange }: any) => {
      const { updateBookingData } = useBooking();
      useEffect(() => {
        updateBookingData({
          startTime: "2026-04-10T17:00:00.000Z",
          stylist_id: 2,
        });
        onValidityChange(true);
      }, []);
      return <div>datetime-step</div>;
    },
  };
});

vi.mock("./BookingSteps/PersonalStep", async () => {
  const { useBooking } = await import("@/context/BookingContext");
  return {
    PersonalStep: ({ onValidityChange }: any) => {
      const { updateBookingData } = useBooking();
      useEffect(() => {
        updateBookingData({
          firstName: "Jane",
          lastName: "Doe",
          phone: "1234567890",
          email: "jane@example.com",
        });
        onValidityChange(true);
      }, []);
      return <div>personal-step</div>;
    },
  };
});

vi.mock("./BookingSteps/ReviewStep", () => ({
  ReviewStep: () => <div>review-step</div>,
}));

vi.mock("./BookingSteps/SpeciesStep", async () => {
  const { useBooking } = await import("@/context/BookingContext");
  return {
    SpeciesStep: ({ onValidityChange }: any) => {
      const { updateBookingData } = useBooking();
      useEffect(() => {
        updateBookingData({ petSpecies: "DOG" });
        onValidityChange(true);
      }, []);
      return <div>species-step</div>;
    },
  };
});

describe("MultiStepFormModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function BookingStateProbe({
    onBookingDataChange,
  }: {
    onBookingDataChange: (data: any) => void;
  }) {
    const { bookingData } = useBooking();
    useEffect(() => {
      onBookingDataChange(bookingData);
    }, [bookingData, onBookingDataChange]);
    return null;
  }

  const renderModal = (onBookingDataChange: (data: any) => void = vi.fn()) =>
    render(
      <BookingProvider>
        <BookingStateProbe onBookingDataChange={onBookingDataChange} />
        <MultiStepFormModal open onOpenChange={vi.fn()} />
      </BookingProvider>,
    );

  async function clickNext() {
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  }

  async function goToReviewStep() {
    // Step 1 -> Step 2
    await clickNext();

    await waitFor(() => {
      expect(screen.getByTestId("service-card-35")).toBeInTheDocument();
    });

    // Step 2 selection
    fireEvent.click(screen.getByTestId("service-card-35"));

    // Step 2 -> 3, 3 -> 4, 4 -> 5, 5 -> 6 (Review)
    await clickNext();
    await clickNext();
    await clickNext();
    await clickNext();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });
  }

  it("submits appointment using existing client and existing pet", async () => {
    createAppointmentMutateAsyncMock.mockResolvedValue({ id: 99 });

    renderModal();
    await goToReviewStep();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createAppointmentMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(createAppointmentMutateAsyncMock).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "Jane",
          last_name: "Doe",
          pet_name: "Test Pet",
          service_id: 35,
          breed: expect.objectContaining({ id: 10 }),
          weight_class_id: 2,
          stylist_id: 2,
        }),
      );
      expect(navigateMock).toHaveBeenCalledWith(`${CONFIRMATION}99`);
    });
  });

  it("navigates to confirmation when appointment is created", async () => {
    createAppointmentMutateAsyncMock.mockResolvedValue({ id: 40 });
    const onBookingDataChange = vi.fn();

    renderModal(onBookingDataChange);
    await goToReviewStep();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createAppointmentMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(`${CONFIRMATION}40`);
    });

    await waitFor(() => {
      expect(
        onBookingDataChange.mock.calls.some(
          ([data]) =>
            data?.firstName === undefined &&
            data?.petName === undefined &&
            data?.service === undefined,
        ),
      ).toBe(true);
    });
  });

  it("navigates to error when appointment creation fails", async () => {
    createAppointmentMutateAsyncMock.mockRejectedValue(new Error("boom"));
    const onBookingDataChange = vi.fn();

    renderModal(onBookingDataChange);
    await goToReviewStep();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createAppointmentMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(ERROR);
    });

    await waitFor(() => {
      expect(
        onBookingDataChange.mock.calls.some(
          ([data]) =>
            data?.firstName === undefined &&
            data?.petName === undefined &&
            data?.service === undefined,
        ),
      ).toBe(true);
    });
  });
});
