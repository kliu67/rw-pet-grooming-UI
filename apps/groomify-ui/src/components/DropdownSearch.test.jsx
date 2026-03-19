import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownSearch } from "./DropdownSearch";

describe("DropdownSearch", () => {
  it("renders the controlled input value", () => {
    render(<DropdownSearch searchTerm="buddy" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText("general.search")).toHaveValue("buddy");
  });

  it("forwards the change event when typing", () => {
    const onChange = vi.fn();

    render(<DropdownSearch searchTerm="" onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText("general.search"), {
      target: { value: "sam" }
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.any(Object)
    }));
  });
});
