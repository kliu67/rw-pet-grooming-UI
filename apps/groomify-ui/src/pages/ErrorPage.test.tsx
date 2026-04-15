import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorPage } from "./ErrorPage";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router",
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("ErrorPage", () => {
  it("renders the error heading and message", () => {
    render(<ErrorPage />);

    expect(
      screen.getByRole("heading", { name: "Booking Error" }),
    ).toBeInTheDocument();
    expect(screen.getByText("errorPage.message")).toBeInTheDocument();
  });

  it("navigates home when the return button is clicked", () => {
    render(<ErrorPage />);

    fireEvent.click(screen.getByRole("button", { name: "errorPage.returnHomeLabel" }));

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("renders the support and error code text", () => {
    render(<ErrorPage />);

    expect(screen.getByText("errorPage.contactSupport")).toBeInTheDocument();
    expect(
      screen.getByText(/errorPage\.errorCode BK-2024-E001/),
    ).toBeInTheDocument();
  });
});
