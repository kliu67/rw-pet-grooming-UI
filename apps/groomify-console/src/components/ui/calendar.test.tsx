import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  it("applies the base and custom class names", () => {
    const { container } = render(<Calendar className="test-calendar" />);

    const root = container.firstChild as HTMLElement;

    expect(root).toHaveClass("p-3");
    expect(root).toHaveClass("test-calendar");
  });

  it("merges custom classNames into the DayPicker output", () => {
    const { container } = render(
      <Calendar classNames={{ months: "custom-months" }} />
    );

    expect(container.querySelector(".custom-months")).toBeInTheDocument();
  });
});
