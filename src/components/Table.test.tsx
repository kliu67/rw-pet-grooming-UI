import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { createColumnHelper } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { Table } from "./Table";

type Row = {
  id: number;
  name: string;
};

const columnHelper = createColumnHelper<Row>();

describe("Table", () => {
  it("renders rows and paginates to next/previous pages", () => {
    const data = Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      name: `Service ${i + 1}`
    }));
    const columns = [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue()
      })
    ];

    render(<Table data={data} columns={columns} />);

    expect(screen.getByText("Service 1")).toBeInTheDocument();
    expect(screen.queryByText("Service 26")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "general.next" }));
    expect(screen.getByText("Service 26")).toBeInTheDocument();
    expect(screen.queryByText("Service 1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "general.prev" }));
    expect(screen.getByText("Service 1")).toBeInTheDocument();
  });

  it("sorts by clicking a header", () => {
    const data = [
      { id: 1, name: "Zulu" },
      { id: 2, name: "Alpha" }
    ];
    const columns = [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue()
      })
    ];

    render(<Table data={data} columns={columns} />);

    const firstRowBeforeSort = screen.getAllByRole("row")[1].textContent;
    expect(firstRowBeforeSort).toContain("Zulu");

    fireEvent.click(screen.getByText("Name"));
    const firstRowAfterSort = screen.getAllByRole("row")[1].textContent;
    expect(firstRowAfterSort).toContain("Alpha");
  });
});
