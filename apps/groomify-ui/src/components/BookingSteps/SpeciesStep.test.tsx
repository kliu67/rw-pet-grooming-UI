import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SpeciesStep } from "./SpeciesStep";

const mockUpdateBookingData = vi.fn();
let mockBookingData: Record<string, any> = {};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/context/BookingContext", () => ({
  useBooking: () => ({
    bookingData: mockBookingData,
    updateBookingData: mockUpdateBookingData,
  }),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("SpeciesStep", () => {
  beforeEach(() => {
    mockUpdateBookingData.mockClear();
    mockBookingData = {
      petSpecies: "",
      firstName: "Jane",
      lastName: "Doe",
      phone: "1234567890",
      email: "jane@example.com",
      petName: "Buddy",
      service: {
        id: 35,
        name: "Bath&Brush",
        base_price: "40.00",
        code: "BATH_BRUSH",
        description: "",
        uuid: "svc-uuid",
      },
      breed: { id: 10, name: "Akita" },
      weightClass: {
        id: 2,
        code: "MEDIUM",
        label: "Medium",
        weight_bounds: [21, 40],
      },
      serviceConfig: {
        id: 190,
        duration_minutes: 90,
        buffer_minutes: 20,
        price: "50.00",
      },
      startTime: "2026-04-10T17:00:00.000Z",
      description: "Existing note",
    };
  });

  it("calls onValidityChange with false when no species is selected", async () => {
    const onValidityChange = vi.fn();

    render(<SpeciesStep onValidityChange={onValidityChange} />);

    await waitFor(() => {
      expect(onValidityChange).toHaveBeenCalledWith(false);
    });
  });

  it("calls onValidityChange with true when a species already exists", async () => {
    const onValidityChange = vi.fn();
    mockBookingData = {
      ...mockBookingData,
      petSpecies: "DOG",
    };

    render(<SpeciesStep onValidityChange={onValidityChange} />);

    await waitFor(() => {
      expect(onValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it("resets dependent booking fields when changing species", () => {
    mockBookingData = {
      ...mockBookingData,
      petSpecies: "DOG",
    };

    render(<SpeciesStep onValidityChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /speciesStep\.cat/i }));

    expect(mockUpdateBookingData).toHaveBeenCalledWith({
      petSpecies: "CAT",
      firstName: "Jane",
      lastName: "Doe",
      phone: "1234567890",
      email: "jane@example.com",
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
  });

  it("falls back to empty personal fields when changing species with undefined values", () => {
    mockBookingData = {
      ...mockBookingData,
      petSpecies: "DOG",
      firstName: undefined,
      lastName: undefined,
      phone: undefined,
      email: undefined,
    };

    render(<SpeciesStep onValidityChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /speciesStep\.cat/i }));

    expect(mockUpdateBookingData).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      }),
    );
  });

  it("does not update booking data when selecting the same species", () => {
    mockBookingData = {
      ...mockBookingData,
      petSpecies: "DOG",
    };

    render(<SpeciesStep onValidityChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /speciesStep\.dog/i }));

    expect(mockUpdateBookingData).not.toHaveBeenCalled();
  });
});
