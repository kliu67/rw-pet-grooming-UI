import React, { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PetStep } from "./PetStep";
import { MAX_PET_NAME_LENGTH } from "../constants";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const renderWithState = (
  props?: Partial<React.ComponentProps<typeof PetStep>>
) => {
  const onValidityChange = props?.onValidityChange ?? vi.fn();

  function Harness() {
    const [formData, setFormData] = useState({
      petName: "",
      breed: "",
      weight: ""
    });

    return (
      <PetStep
        formData={formData}
        updateFormData={(field, value) =>
          setFormData((prev) => ({ ...prev, [field]: value }))
        }
        onValidityChange={onValidityChange}
        showErrors={props?.showErrors}
        breedsData={props?.breedsData ?? []}
        weightClassesData={props?.weightClassesData ?? []}
      />
    );
  }

  return { onValidityChange, ...render(<Harness />) };
};

describe("PetStep", () => {
  it("shows field error on blur", () => {
    renderWithState();

    const petNameInput = screen.getByLabelText("bookingModal.petName");
    fireEvent.blur(petNameInput);

    expect(screen.getByText("pets.errors.notEmpty")).toBeInTheDocument();
  });

  it("does not show error before blur when showErrors is false", () => {
    renderWithState();

    const petNameInput = screen.getByLabelText("bookingModal.petName");
    fireEvent.change(petNameInput, { target: { value: "Buddy" } });

    expect(screen.queryByText("pets.errors.notEmpty")).not.toBeInTheDocument();
  });

  it("shows errors immediately when showErrors is true", async () => {
    renderWithState({ showErrors: true });

    await waitFor(() => {
      expect(screen.getByText("pets.errors.notEmpty")).toBeInTheDocument();
    });
  });

  it("calls onValidityChange with true when pet name is valid", async () => {
    const { onValidityChange } = renderWithState();

    fireEvent.change(screen.getByLabelText("bookingModal.petName"), {
      target: { value: "Buddy" }
    });

    await waitFor(() => {
      expect(onValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it("shows length validation error when name is too long", () => {
    renderWithState();

    const petNameInput = screen.getByLabelText("bookingModal.petName");
    fireEvent.change(petNameInput, {
      target: { value: "a".repeat(MAX_PET_NAME_LENGTH + 1) }
    });
    fireEvent.blur(petNameInput);

    expect(screen.getByText("pets.errors.nameLengthViolation")).toBeInTheDocument();
  });
});
