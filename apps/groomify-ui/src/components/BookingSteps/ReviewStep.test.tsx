import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewStep } from "./ReviewStep";
import { BOOKING_STEPS } from "@/constants";

let mockBookingData: Record<string, any> = {};

vi.mock("@/context/BookingContext", () => ({
  useBooking: () => ({
    bookingData: mockBookingData,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      resolvedLanguage: "en",
      changeLanguage: vi.fn(),
    },
  }),
  Trans: ({ i18nKey }: { i18nKey?: string }) => i18nKey ?? null,
}));

describe("ReviewStep", () => {
  beforeEach(() => {
    mockBookingData = {
      service: { id: 1, name: "Bath&Brush", base_price: "40.00" },
      startTime: "2026-03-26T17:00:00.000Z",
      serviceConfig: {
        id: 190,
        duration_minutes: 90,
        buffer_minutes: 20,
        price: "50.00",
      },
      petName: "Lou",
      breed: { id: 10, name: "Akita" },
      weightClass: { id: 2, label: "medium" },
      description: "Handle gently please",
      firstName: "Kai",
      lastName: "Liu",
      email: "kai@example.com",
      phone: "1234567890",
    };
  });

  it("renders summary sections when required booking data exists", () => {
    render(<ReviewStep />);

    expect(screen.getByText("reviewStep.summary")).toBeInTheDocument();
    expect(screen.getByText("reviewStep.serviceDetails")).toBeInTheDocument();
    expect(screen.getByText("reviewStep.dateTime")).toBeInTheDocument();
    expect(screen.getByText("reviewStep.customerInfo")).toBeInTheDocument();
    expect(screen.getByText("reviewStep.priceEstimate")).toBeInTheDocument();
    expect(screen.getByText("Bath&Brush")).toBeInTheDocument();
    expect(screen.getByText("Lou")).toBeInTheDocument();
    expect(screen.getByText("reviewStep.disclaimer")).toBeInTheDocument();
  });

  it("returns null when required booking data is missing", () => {
    mockBookingData = {
      service: null,
      startTime: null,
      serviceConfig: null,
      petName: "",
      breed: null,
      weightClass: null,
    };

    const { container } = render(<ReviewStep />);
    expect(container).toBeEmptyDOMElement();
  });

  it("calls onEdit with expected steps", () => {
    const onEdit = vi.fn();
    render(<ReviewStep onEdit={onEdit} />);

    const editButtons = screen.getAllByRole("button").filter((button) => {
      const label = button.textContent?.trim();
      return label === "general.edit" || label === "Edit";
    });

    fireEvent.click(editButtons[0]); // service
    expect(onEdit).toHaveBeenCalledWith(BOOKING_STEPS.SERVICE);

    fireEvent.click(editButtons[1]); // date/time
    expect(onEdit).toHaveBeenCalledWith(BOOKING_STEPS.DATE_TIME);

    fireEvent.click(editButtons[2]); // personal
    expect(onEdit).toHaveBeenCalledWith(BOOKING_STEPS.PERSONAL);
  });
});
