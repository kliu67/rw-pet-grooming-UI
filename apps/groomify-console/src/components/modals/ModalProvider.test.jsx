import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalProvider, useModal } from "./ModalProvider";

vi.mock("./ModalRoot", () => ({
  default: ({ modal }) => (
    <div data-testid="modal-root-state">
      {modal.open ? `${modal.type}:${modal.props?.entityName || ""}` : "closed"}
    </div>
  )
}));

function Consumer() {
  const modal = useModal();

  return (
    <div>
      <button onClick={() => modal.openModal("DELETE", { entityName: "Bath" })}>open</button>
      <button onClick={() => modal.closeModal()}>close</button>
    </div>
  );
}

describe("ModalProvider", () => {
  it("provides openModal and closeModal through context", () => {
    render(
      <ModalProvider>
        <Consumer />
      </ModalProvider>
    );

    expect(screen.getByTestId("modal-root-state")).toHaveTextContent("closed");

    fireEvent.click(screen.getByText("open"));
    expect(screen.getByTestId("modal-root-state")).toHaveTextContent("DELETE:Bath");

    fireEvent.click(screen.getByText("close"));
    expect(screen.getByTestId("modal-root-state")).toHaveTextContent("closed");
  });
});
