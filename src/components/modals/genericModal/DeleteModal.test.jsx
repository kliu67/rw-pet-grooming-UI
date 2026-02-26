import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DeleteModal from "./DeleteModal";

vi.mock("i18next", () => ({
  t: (key) => key
}));

describe("DeleteModal", () => {
  it("requires matching entity name before submit", () => {
    const onSubmit = vi.fn();
    render(
      <DeleteModal
        closeModal={vi.fn()}
        onSubmit={onSubmit}
        isLoading={false}
        serverError={null}
        entityName="Bath"
        entityType="service"
      />
    );

    const submit = screen.getByText("general.delete");
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Entity Name"), {
      target: { value: "Bath" }
    });

    expect(submit).not.toBeDisabled();
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables submit and shows server error when serverError exists", () => {
    const onSubmit = vi.fn();
    render(
      <DeleteModal
        closeModal={vi.fn()}
        onSubmit={onSubmit}
        isLoading={false}
        serverError="cannot delete"
        entityName="Bath"
        entityType="service"
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Entity Name"), {
      target: { value: "Bath" }
    });

    expect(screen.getByText("cannot delete")).toBeInTheDocument();
    expect(screen.getByText("general.delete")).toBeDisabled();
    fireEvent.click(screen.getByText("general.delete"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
