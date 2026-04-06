import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LogoutModal from "./LogoutModal";

const mockLogout = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    logout: mockLogout
  })
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("i18next", () => ({
  t: (key) => key
}));

describe("LogoutModal", () => {
  beforeEach(() => {
    mockLogout.mockReset();
  });

  it("calls logout, shows success toast, and closes", async () => {
    const closeModal = vi.fn();
    mockLogout.mockResolvedValueOnce();
    const { toast } = await import("sonner");

    render(
      <LogoutModal
        closeModal={closeModal}
        title="Logout"
        message="Are you sure?"
        primaryLabel="Confirm"
      />
    );

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalled();
      expect(closeModal).toHaveBeenCalledTimes(1);
    });
  });

  it("shows error toast on failure", async () => {
    const closeModal = vi.fn();
    mockLogout.mockRejectedValueOnce(new Error("boom"));

    const { toast } = await import("sonner");

    render(
      <LogoutModal
        closeModal={closeModal}
        title="Logout"
        message="Are you sure?"
        primaryLabel="Confirm"
      />
    );

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
