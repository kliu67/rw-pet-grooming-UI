import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UserModal from "./UserModal";

vi.mock("i18next", () => ({
  t: (key) => key
}));

describe("UserModal", () => {
  it("renders user fields and closes", () => {
    const closeModal = vi.fn();
    const user = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      phone: "1234567890",
      role: "Admin"
    };

    render(<UserModal closeModal={closeModal} user={user} />);

    expect(screen.getByText("userModal.heading")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();

    fireEvent.click(screen.getByText("general.close"));
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
