import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "./dropdown-menu";

describe("DropdownMenu", () => {
  it("renders menu content and item metadata when open", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuItem inset variant="destructive">
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            Keep me signed in
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Choice A</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Options")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-label"
    );
    expect(screen.getByText("Delete")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-item"
    );
    expect(screen.getByText("Delete")).toHaveAttribute("data-variant", "destructive");
    expect(screen.getByText("Delete")).toHaveAttribute("data-inset", "true");
    expect(screen.getByText("Keep me signed in")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-checkbox-item"
    );
    expect(screen.getByText("Choice A")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-radio-item"
    );
    expect(screen.getByText("⌘K")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-shortcut"
    );
  });

  it("renders sub menu content when the sub menu is open", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>Sub item</DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("More")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-sub-trigger"
    );
    expect(screen.getByText("Sub item")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-sub-content"
    );
  });

  it("opens the menu when the trigger is clicked", () => {
    function ControlledMenu() {
      const [open, setOpen] = React.useState(false);

      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    render(<ControlledMenu />);

    expect(screen.queryByText("Profile")).not.toBeInTheDocument();

    const trigger = screen.getByText("Open");
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);

    expect(screen.getByText("Profile")).toBeInTheDocument();
  });
});
