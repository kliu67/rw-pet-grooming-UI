import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Layout } from "./Layout";

vi.mock("react-router", () => ({
  Outlet: () => <div data-testid="layout-outlet">outlet-content</div>,
  useLocation: () => ({ pathname: "/" }),
  NavLink: ({ to, onClick, className, children }) => {
    const computedClass =
      typeof className === "function"
        ? className({ isActive: to === "/" })
        : className;

    return (
      <a href={to} onClick={onClick} className={computedClass}>
        {children}
      </a>
    );
  }
}));

describe("Layout", () => {
  it("renders brand and outlet content", () => {
    render(<Layout />);

    expect(screen.getAllByText("Groomify").length).toBeGreaterThan(0);
    expect(screen.getByTestId("layout-outlet")).toHaveTextContent("outlet-content");
  });

  it("opens sidebar from mobile menu and closes after nav click", () => {
    const { container } = render(<Layout />);

    const aside = container.querySelector("aside");
    const menuButton = container.querySelector("header button");
    expect(aside?.className).toContain("-translate-x-full");

    fireEvent.click(menuButton as HTMLElement);
    expect(aside?.className).toContain("translate-x-0");

    fireEvent.click(screen.getByText("Appointments"));
    expect(aside?.className).toContain("-translate-x-full");
  });
});
