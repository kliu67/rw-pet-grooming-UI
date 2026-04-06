import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PetModal from "./PetModal";

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }) => <>{children}</>,
  DropdownMenuContent: ({ children }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onSelect }) => (
    <button type="button" onClick={() => onSelect?.()}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />
}));

const inputs = {
  name: {
    displayName: "Name",
    placeholder: "Pet name"
  },
  owner: {
    displayName: "Owner",
    placeholder: "Select owner"
  },
  breed: {
    displayName: "Breed",
    placeholder: "Select breed"
  },
  weightClass: {
    displayName: "Weight Class",
    placeholder: "Select weight class"
  }
};

const clientData = [{ id: 1, first_name: "Jane", last_name: "Doe" }];
const breedData = [{ id: 10, name: "Poodle" }];
const weightClassData = [{ id: 100, label: "Small" }];

const baseProps = {
  onClose: vi.fn(),
  inputs,
  petData: {},
  mode: "create",
  onSubmit: vi.fn(),
  clientData,
  breedData,
  weightClassData,
  isLoading: false
};

describe("PetModal", () => {
  it("submits create payload and closes modal", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<PetModal {...baseProps} onSubmit={onSubmit} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Pet name"), {
      target: { value: "  Buddy  " }
    });
    fireEvent.click(screen.getByText("Doe, Jane"));
    fireEvent.click(screen.getByText("Poodle"));
    fireEvent.click(screen.getByText("Small"));
    fireEvent.click(screen.getByText("general.create"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Buddy",
        owner: 1,
        breed: 10,
        weight_class_id: 100
      });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps submit disabled in edit mode when nothing changes", () => {
    render(
      <PetModal
        {...baseProps}
        mode="edit"
        petData={{
          id: 99,
          name: "Buddy",
          owner: clientData[0],
          breed: breedData[0],
          weightClass: weightClassData[0]
        }}
      />
    );

    expect(screen.getByText("general.update")).toBeDisabled();
  });

  it("submits only changed fields in edit mode", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <PetModal
        {...baseProps}
        mode="edit"
        onSubmit={onSubmit}
        onClose={onClose}
        petData={{
          id: 99,
          name: "Buddy",
          owner: clientData[0],
          breed: breedData[0],
          weightClass: weightClassData[0]
        }}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Pet name"), {
      target: { value: "  Max  " }
    });
    fireEvent.click(screen.getByText("general.update"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: "Max" });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows name validation error and disables submit", () => {
    render(<PetModal {...baseProps} />);

    fireEvent.change(screen.getByPlaceholderText("Pet name"), {
      target: { value: "Buddy" }
    });
    fireEvent.change(screen.getByPlaceholderText("Pet name"), {
      target: { value: "x".repeat(256) }
    });
    fireEvent.blur(screen.getByPlaceholderText("Pet name"));

    expect(screen.getByText("pets.errors.nameLengthViolation")).toBeInTheDocument();
    expect(screen.getByText("general.create")).toBeDisabled();
  });

  it("shows server error when submit fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue({ error: "Request failed" });
    const onClose = vi.fn();

    render(<PetModal {...baseProps} onSubmit={onSubmit} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Pet name"), {
      target: { value: "Buddy" }
    });
    fireEvent.click(screen.getByText("Doe, Jane"));
    fireEvent.click(screen.getByText("Poodle"));
    fireEvent.click(screen.getByText("Small"));
    fireEvent.click(screen.getByText("general.create"));

    await waitFor(() => {
      expect(screen.getByText("Request failed")).toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
