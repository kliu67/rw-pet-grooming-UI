import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModalRoot from "./ModalRoot";

vi.mock("./modalRegistry", () => ({
  MODAL_COMPONENTS: {
    DELETE: ({ label }) => <div data-testid="mock-modal">mock-{label}</div>
  }
}));

describe("ModalRoot", () => {
  it("renders nothing when modal is closed", () => {
    const { container } = render(
      <ModalRoot modal={{ open: false, type: null, props: {} }} closeModal={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders mapped modal component and passes props", () => {
    render(
      <ModalRoot
        modal={{ open: true, type: "DELETE", props: { label: "breed" } }}
        closeModal={vi.fn()}
      />
    );

    expect(screen.getByTestId("mock-modal")).toHaveTextContent("mock-breed");
  });

  it("calls closeModal when backdrop is clicked", () => {
    const closeModal = vi.fn();
    const { container } = render(
      <ModalRoot
        modal={{ open: true, type: "DELETE", props: { label: "service" } }}
        closeModal={closeModal}
      />
    );

    fireEvent.click(container.querySelector(".absolute.inset-0"));
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
