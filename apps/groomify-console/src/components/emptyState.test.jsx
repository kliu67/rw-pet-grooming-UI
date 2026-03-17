import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./emptyState";

describe("EmptyState", () => {
  it("renders the brand heading", () => {
    render(<EmptyState />);

    expect(screen.getByRole("heading", { name: "Groomify" })).toBeInTheDocument();
  });

  it("renders the login required message", () => {
    render(<EmptyState />);

    expect(screen.getByText("general.loginRequireMessage")).toBeInTheDocument();
  });
});
