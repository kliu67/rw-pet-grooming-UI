import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthModal from "./AuthModal";

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister
  })
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("../../ui/tabs", () => ({
  Tabs: ({ children }) => <div>{children}</div>,
  TabsList: ({ children }) => <div>{children}</div>,
  TabsTrigger: ({ children }) => <button type="button">{children}</button>,
  TabsContent: ({ children }) => <div>{children}</div>
}));

describe("AuthModal", () => {
  it("submits login and navigates on success", async () => {
    const closeModal = vi.fn();
    mockLogin.mockResolvedValueOnce({ status: 200 });

    render(<AuthModal closeModal={closeModal} />);

    const emailInputs = screen.getAllByLabelText("login.email");
    const passwordInputs = screen.getAllByLabelText("login.password");

    fireEvent.change(emailInputs[0], {
      target: { value: "user@example.com" }
    });
    fireEvent.change(passwordInputs[0], {
      target: { value: "password123" }
    });

    const loginButtons = screen.getAllByRole("button", { name: "login.login" });
    const submitButton =
      loginButtons.find((button) => button.getAttribute("type") === "submit") ||
      loginButtons[0];
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123"
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(closeModal).toHaveBeenCalled();
  });

  it("shows password mismatch error on register", async () => {
    render(<AuthModal />);

    const emailInputs = screen.getAllByLabelText("login.email");
    const passwordInputs = screen.getAllByLabelText("login.password");

    fireEvent.change(emailInputs[1], {
      target: { value: "new@example.com" }
    });
    fireEvent.change(passwordInputs[1], {
      target: { value: "password123" }
    });
    fireEvent.change(screen.getByLabelText("login.confirmPassword"), {
      target: { value: "password999" }
    });

    fireEvent.change(screen.getByLabelText("login.firstName"), {
      target: { value: "Jane" }
    });
    fireEvent.change(screen.getByLabelText("login.lastName"), {
      target: { value: "Doe" }
    });
    fireEvent.change(screen.getByLabelText("login.phone"), {
      target: { value: "12345678" }
    });

    fireEvent.click(screen.getByRole("button", { name: "login.createAccount" }));

    expect(await screen.findByText("login.passwordMatchError")).toBeInTheDocument();
  });
});
