import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_PET_NAME_LENGTH } from "../../constants";
import { PetStep } from "./PetStep";

const mockUpdateBookingData = vi.fn();
const mockRemoveStartTime = vi.fn();
let mockBookingData: Record<string, any> = {};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

vi.mock("@/context/BookingContext", () => ({
  useBooking: () => ({
    bookingData: mockBookingData,
    updateBookingData: mockUpdateBookingData,
    removeStartTime: mockRemoveStartTime
  })
}));

vi.mock("../ui/select", () => ({
  Select: ({ name, value, onValueChange, children }: any) => (
    <div>
      <label htmlFor={name}>{name}</label>
      <select
        id={name}
        data-testid={`${name}-select`}
        value={value ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">placeholder</option>
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children, disabled }: any) => (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  )
}));

describe("PetStep", () => {
  beforeEach(() => {
    mockUpdateBookingData.mockClear();
    mockRemoveStartTime.mockClear();
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

  it("updates breed when breed select value changes", () => {
    render(
      <PetStep
        onValidityChange={vi.fn()}
        breedsData={[
          { id: 1, name: "Labrador" },
          { id: 2, name: "Poodle" }
        ]}
      />
    );

    fireEvent.change(screen.getByTestId("breed-select"), {
      target: { value: "2" }
    });

    expect(mockUpdateBookingData).toHaveBeenCalledWith({
      breed: { id: 2, name: "Poodle" }
    });
  });

  it("renders non-permitted breeds as disabled options", () => {
    render(
      <PetStep
        onValidityChange={vi.fn()}
        breedsData={[
          { id: 1, name: "Labrador", permitted: true },
          { id: 2, name: "Wolfdog", permitted: false }
        ]}
      />
    );

    const wolfdogOption = screen.getByRole("option", {
      name: /Wolfdogpets\.notPermitted/i
    });

    expect(wolfdogOption).toBeDisabled();
  });

  it("updates weight class and removes startTime on weight select change", () => {
    render(
      <PetStep
        onValidityChange={vi.fn()}
        weightClassesData={[
          { id: 1, label: "Small", weight_bounds: [0, 20] },
          { id: 2, label: "Large", weight_bounds: [21, 80] }
        ]}
      />
    );

    fireEvent.change(screen.getByTestId("weightClass-select"), {
      target: { value: "1" }
    });

    expect(mockRemoveStartTime).toHaveBeenCalled();
    expect(mockUpdateBookingData).toHaveBeenCalledWith({
      weightClass: { id: 1, label: "Small", weight_bounds: [0, 20] }
    });
  });
});
