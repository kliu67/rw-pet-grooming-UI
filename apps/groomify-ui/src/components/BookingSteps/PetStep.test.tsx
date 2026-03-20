import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_PET_NAME_LENGTH } from "../../constants";
import { PetStep } from "./PetStep";

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

describe("PetStep", () => {
  beforeEach(() => {
    mockUpdateBookingData.mockClear();
    mockBookingData = {
      petName: "",
      breed: undefined,
      weightClass: undefined
    };
  });

  it("shows required pet name error on blur", () => {
    render(<PetStep onValidityChange={vi.fn()} />);

    const petNameInput = screen.getByLabelText(/bookingModal\.petName/i);
    fireEvent.blur(petNameInput);

    expect(screen.getByText("pets.errors.notEmpty")).toBeInTheDocument();
  });

  it("shows max-length error for overly long pet name", () => {
    mockBookingData = {
      petName: "a".repeat(MAX_PET_NAME_LENGTH + 1),
      breed: undefined,
      weightClass: undefined
    };
    render(<PetStep onValidityChange={vi.fn()} />);

    const petNameInput = screen.getByLabelText(/bookingModal\.petName/i);
    fireEvent.blur(petNameInput);

    expect(screen.getByText("pets.errors.nameLengthViolation")).toBeInTheDocument();
  });

  it("calls updateBookingData when pet name changes", () => {
    render(<PetStep onValidityChange={vi.fn()} />);

    const petNameInput = screen.getByLabelText(/bookingModal\.petName/i);
    fireEvent.change(petNameInput, { target: { value: "Buddy" } });

    expect(mockUpdateBookingData).toHaveBeenCalledWith({ petName: "Buddy" });
  });

  it("renders breed and weight selects when options are provided", () => {
    render(
      <PetStep
        onValidityChange={vi.fn()}
        breedsData={[
          { id: "1", name: "Labrador" },
          { id: "2", name: "Poodle" }
        ]}
        weightClassesData={[
          { id: "1", label: "Small", weight_bounds: [0, 20] },
          { id: "2", label: "Large", weight_bounds: [21, 80] }
        ]}
      />
    );

    expect(screen.getByText("bookingModal.breed")).toBeInTheDocument();
    expect(screen.getByText("bookingModal.weight")).toBeInTheDocument();
    expect(screen.getByText("placeholder.breed")).toBeInTheDocument();
    expect(screen.getByText("placeholder.weight")).toBeInTheDocument();
  });

  it("calls onValidityChange with true when petName exists", async () => {
    const onValidityChange = vi.fn();
    mockBookingData = {
      petName: "Milo",
      breed: undefined,
      weightClass: undefined
    };

    render(<PetStep onValidityChange={onValidityChange} />);

    await waitFor(() => {
      expect(onValidityChange).toHaveBeenCalledWith(true);
    });
  });
});
