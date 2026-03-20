import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalStep } from "./PersonalStep";

const mockUpdateBookingData = vi.fn();
let mockBookingData: Record<string, any> = {};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

vi.mock("@/context/BookingContext", () => ({
  useBooking: () => ({
    bookingData: mockBookingData,
    updateBookingData: mockUpdateBookingData
  })
}));

describe("PersonalStep", () => {
  beforeEach(() => {
    mockUpdateBookingData.mockClear();
    mockBookingData = {
      firstName: "",
      lastName: "",
      phone: "",
      email: ""
    };
  });

  it("shows first name required error on blur", () => {
    render(<PersonalStep onValidityChange={vi.fn()} />);

    const firstNameInput = screen.getByLabelText(/bookingModal\.firstName/i);
    fireEvent.blur(firstNameInput);

    expect(screen.getByText("clients.errors.notEmpty")).toBeInTheDocument();
  });

  it("shows email validation error for invalid email on blur", () => {
    mockBookingData = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "not-an-email"
    };
    render(<PersonalStep onValidityChange={vi.fn()} />);

    const emailInput = screen.getByLabelText(/bookingModal\.email/i);
    fireEvent.blur(emailInput);

    expect(screen.getByText("clients.errors.email")).toBeInTheDocument();
  });

  it("calls updateBookingData when typing in an input", () => {
    render(<PersonalStep onValidityChange={vi.fn()} />);

    const firstNameInput = screen.getByLabelText(/bookingModal\.firstName/i);
    fireEvent.change(firstNameInput, { target: { value: "Kai" } });

    expect(mockUpdateBookingData).toHaveBeenCalledWith({ firstName: "Kai" });
  });

  it("shows required errors when showErrors is true", async () => {
    render(<PersonalStep onValidityChange={vi.fn()} showErrors />);

    await waitFor(() => {
      expect(screen.getAllByText("clients.errors.notEmpty").length).toBeGreaterThan(0);
    });
  });

  it("calls onValidityChange with true when required fields are valid", async () => {
    const onValidityChange = vi.fn();
    mockBookingData = {
      firstName: "Kai",
      lastName: "Liu",
      phone: "6476172401",
      email: "kai@example.com"
    };

    render(<PersonalStep onValidityChange={onValidityChange} />);

    await waitFor(() => {
      expect(onValidityChange).toHaveBeenCalledWith(true);
    });
  });
});
