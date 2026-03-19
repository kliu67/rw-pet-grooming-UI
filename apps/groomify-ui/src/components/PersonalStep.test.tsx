import React, { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonalStep } from "./PersonalStep";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const renderWithState = (props?: Partial<React.ComponentProps<typeof PersonalStep>>) => {
  const onValidityChange = props?.onValidityChange ?? vi.fn();

  function Harness() {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    });

    return (
      <PersonalStep
        formData={formData}
        updateFormData={(field, value) =>
          setFormData((prev) => ({ ...prev, [field]: value }))
        }
        onValidityChange={onValidityChange}
        showErrors={props?.showErrors}
      />
    );
  }

  return { onValidityChange, ...render(<Harness />) };
};

describe("PersonalStep", () => {
  it("shows field error on blur", () => {
    renderWithState();

    const firstNameInput = screen.getByLabelText(/bookingModal\.firstName/i);
    fireEvent.blur(firstNameInput);

    expect(screen.getByText("clients.errors.notEmpty")).toBeInTheDocument();
  });

  it("does not show error before blur when showErrors is false", () => {
    renderWithState();

    const phoneInput = screen.getByLabelText(/bookingModal\.phone/i);
    fireEvent.change(phoneInput, { target: { value: "12" } });

    expect(screen.queryByText("clients.errors.phone")).not.toBeInTheDocument();
  });

  it("shows errors immediately when showErrors is true", async () => {
    renderWithState({ showErrors: true });

    await waitFor(() => {
      expect(screen.getAllByText("clients.errors.notEmpty").length).toBeGreaterThan(0);
    });
  });

  it("calls onValidityChange with true when required fields are valid", async () => {
    const { onValidityChange } = renderWithState();

    fireEvent.change(screen.getByLabelText(/bookingModal\.firstName/i), {
      target: { value: "Sam" }
    });
    fireEvent.change(screen.getByLabelText(/bookingModal\.lastName/i), {
      target: { value: "Paws" }
    });
    fireEvent.change(screen.getByLabelText(/bookingModal\.phone/i), {
      target: { value: "123456" }
    });

    await waitFor(() => {
      expect(onValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it("shows email validation error for invalid email on blur", () => {
    renderWithState();

    const emailInput = screen.getByLabelText(/bookingModal\.email/i);
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.blur(emailInput);

    expect(screen.getByText("clients.errors.email")).toBeInTheDocument();
  });
});
