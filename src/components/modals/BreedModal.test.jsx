import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BreedModal from "./BreedModal";

const inputs = {
  name: {
    id: "breed-name",
    name: "name",
    displayName: "Breed Name",
    placeholder: "Breed name"
  }
};

describe("BreedModal", () => {
  it("submits create payload and closes modal", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <BreedModal
        onClose={onClose}
        inputs={inputs}
        breedData={{}}
        mode="create"
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Breed name"), {
      target: { value: "  Poodle  " }
    });
    fireEvent.click(screen.getByText("general.create"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: "Poodle" });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps submit disabled in edit mode when there are no changes", () => {
    render(
      <BreedModal
        onClose={vi.fn()}
        inputs={inputs}
        breedData={{ id: 1, name: "Poodle" }}
        mode="edit"
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText("general.update")).toBeDisabled();
  });
});
