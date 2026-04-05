import React, { useEffect } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingProvider } from "@/context/BookingContext";
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
    data: [{ id: 35, code: "BATH_BRUSH", name: "Bath&Brush", base_price: "40.00" }],
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
      onClick={() => onClick("service", service)}
    >
      {service.name}
    </button>
  ),
}));

vi.mock("./BookingSteps/PetStep", () => ({
  PetStep: ({ onValidityChange }: any) => {
    useEffect(() => onValidityChange(true), [onValidityChange]);
    return <div>pet-step</div>;
  },
}));

vi.mock("./BookingSteps/DateTimeStep", () => ({
  DateTimeStep: ({ onValidityChange }: any) => {
    useEffect(() => onValidityChange(true), [onValidityChange]);
    return <div>datetime-step</div>;
  },
}));

vi.mock("./BookingSteps/PersonalStep", () => ({
  PersonalStep: ({ onValidityChange }: any) => {
    useEffect(() => onValidityChange(true), [onValidityChange]);
    return <div>personal-step</div>;
  },
}));

vi.mock("./BookingSteps/ReviewStep", () => ({
  ReviewStep: () => <div>review-step</div>,
}));

describe("MultiStepFormModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderModal = () =>
    render(
      <BookingProvider>
        <MultiStepFormModal open onOpenChange={vi.fn()} />
      </BookingProvider>,
    );

  async function goToReviewStep() {
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

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
          first_name: expect.any(String),
          last_name: expect.any(String),
          service_id: 35,
          breed_id: 10,
          weight_class_id: 2,
          stylist_id: 2,
        }),
      );
      expect(navigateMock).toHaveBeenCalledWith(`${CONFIRMATION}99`);
    });
  });

  it("navigates to confirmation when appointment is created", async () => {
    createAppointmentMutateAsyncMock.mockResolvedValue({ id: 40 });

    renderModal();
    await goToReviewStep();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createAppointmentMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(`${CONFIRMATION}40`);
    });
  });

  it("navigates to error when appointment creation fails", async () => {
    createAppointmentMutateAsyncMock.mockRejectedValue(new Error("boom"));

    renderModal();
    await goToReviewStep();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createAppointmentMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(ERROR);
    });
  });
});
