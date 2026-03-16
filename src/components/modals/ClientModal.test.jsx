import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ClientModal from "./ClientModal";

const inputs = {
  first_name: { displayName: "First Name", placeholder: "First name" },
  last_name: { displayName: "Last Name", placeholder: "Last name" },
  phone: { displayName: "Phone", placeholder: "Phone" },
  email: { displayName: "Email", placeholder: "Email" },
  description: { displayName: "Description", placeholder: "Description" }
};

describe("ClientModal", () => {
  it("submits create payload with normalized values and closes modal", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <ClientModal
        onClose={onClose}
        inputs={inputs}
        clientData={{}}
        mode="create"
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "  Jane " }
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: " Doe  " }
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "  +1-555-1234  " }
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: " Jane@Example.Com " }
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "  VIP client  " }
    });

    fireEvent.click(screen.getByText("general.create"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        first_name: "Jane",
        last_name: "Doe",
        phone: "+1-555-1234",
        email: "jane@example.com",
        description: "VIP client"
      });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows phone validation error on blur and keeps submit disabled", () => {
    render(
      <ClientModal
        onClose={vi.fn()}
        inputs={inputs}
        clientData={{}}
        mode="create"
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "Jane" }
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" }
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "abc" }
    });
    fireEvent.blur(screen.getByPlaceholderText("Phone"));

    expect(screen.getByText("clients.errors.phone")).toBeInTheDocument();
    expect(screen.getByText("general.create")).toBeDisabled();
  });
});
