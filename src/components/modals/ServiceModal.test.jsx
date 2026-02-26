import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ServiceModal from "./ServiceModal";

const inputs = {
  name: {
    displayName: "Name",
    placeholder: "Service name"
  },
  base_price: {
    displayName: "Base price",
    placeholder: "0.00"
  },
  description: {
    displayName: "Description",
    placeholder: "Service description"
  }
};

describe("ServiceModal", () => {
  it("submits create payload and casts base_price to number", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <ServiceModal
        onClose={onClose}
        inputs={inputs}
        serviceData={{}}
        mode="create"
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Service name"), {
      target: { value: "  Bath  " }
    });
    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "25.50" }
    });
    fireEvent.change(screen.getByPlaceholderText("Service description"), {
      target: { value: "  Basic wash  " }
    });
    fireEvent.click(screen.getByText("general.create"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Bath",
        base_price: 25.5,
        description: "Basic wash"
      });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows base price validation error for invalid value", () => {
    render(
      <ServiceModal
        onClose={vi.fn()}
        inputs={inputs}
        serviceData={{}}
        mode="create"
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Service name"), {
      target: { value: "Bath" }
    });
    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "123456789.99" }
    });

    expect(screen.getByText("services.errors.base_price")).toBeInTheDocument();
    expect(screen.getByText("general.create")).toBeDisabled();
  });
});
