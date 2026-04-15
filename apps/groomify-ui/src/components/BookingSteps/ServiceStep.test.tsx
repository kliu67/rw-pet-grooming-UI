import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ServiceStep } from "./ServiceStep";

const mockUpdateBookingData = vi.fn();
let mockBookingData: Record<string, any> = {};

vi.mock("@/context/BookingContext", () => ({
  useBooking: () => ({
    bookingData: mockBookingData,
    updateBookingData: mockUpdateBookingData,
  }),
}));

vi.mock("../ServiceCard", () => ({
  ServiceCard: ({ service, onClick }: any) => (
    <button type="button" onClick={onClick} data-testid={`service-card-${service.id}`}>
      {service.name}
    </button>
  ),
}));

describe("ServiceStep", () => {
  const dogService = {
    id: 1,
    code: "BATH_BRUSH",
    name: "Bath & Brush",
    service_species: "DOG",
  };

  const catService = {
    id: 2,
    code: "BATH_BRUSH",
    name: "Cat Bath",
    service_species: "CAT",
  };

  beforeEach(() => {
    mockUpdateBookingData.mockClear();
    mockBookingData = {
      petSpecies: "DOG",
      service: dogService,
      startTime: "2026-04-10T17:00:00.000Z",
      serviceConfig: {
        id: 190,
        duration_minutes: 90,
        buffer_minutes: 20,
        price: "50.00",
      },
    };
  });

  it("does not update booking data when selecting the already selected service", () => {
    render(<ServiceStep serviceData={[dogService, catService]} />);

    fireEvent.click(screen.getByTestId("service-card-1"));

    expect(mockUpdateBookingData).not.toHaveBeenCalled();
  });

  it("resets startTime and serviceConfig when selecting a different service", () => {
    const anotherDogService = {
      id: 3,
      code: "FULL_GROOMING",
      name: "Full Grooming",
      service_species: "DOG",
    };

    render(<ServiceStep serviceData={[dogService, anotherDogService]} />);

    fireEvent.click(screen.getByTestId("service-card-3"));

    expect(mockUpdateBookingData).toHaveBeenCalledWith({
      service: anotherDogService,
      startTime: "",
      serviceConfig: {
        id: null,
        duration_minutes: null,
        buffer_minutes: -1,
        price: "",
      },
    });
  });

  it("renders only services matching selected pet species", () => {
    render(<ServiceStep serviceData={[dogService, catService]} />);

    expect(screen.getByTestId("service-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("service-card-2")).not.toBeInTheDocument();
  });

  it("shows empty-state message when service data is empty", () => {
    render(<ServiceStep serviceData={[]} />);

    expect(screen.getByText("No services available")).toBeInTheDocument();
  });

  it("shows empty-state message when no services match selected species", () => {
    render(<ServiceStep serviceData={[catService]} />);

    expect(screen.getByText("No services available")).toBeInTheDocument();
    expect(screen.queryByTestId("service-card-2")).not.toBeInTheDocument();
  });
});
