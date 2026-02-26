import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RowActionsMenu } from "./RowActionDropdown";

describe("RowActionsMenu", () => {
  it("opens dropdown and calls edit action", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<RowActionsMenu onEdit={onEdit} onDelete={onDelete} />);

    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByText("Edit"));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(<RowActionsMenu onEdit={vi.fn()} onDelete={vi.fn()} />);

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Delete")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });
});
