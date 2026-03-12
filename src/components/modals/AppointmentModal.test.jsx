import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }) => <div>{children}</div>,
  DropdownMenuTrigger: () => null,
  DropdownMenuContent: ({ children }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onSelect }) => (
    <button type="button" onClick={() => onSelect?.()}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />
}));

vi.mock("../ui/calendar", () => ({
  Calendar: ({ onSelect }) => (
    <button
      type="button"
      onClick={() => onSelect?.(new Date("2026-03-15T00:00:00"))}
    >
      Pick date
    </button>
  )
}));

vi.mock("../DrowndownSearch", () => ({
  DropdownSearch: ({ searchTerm, onChange }) => (
    <input
      aria-label="dropdown-search"
      value={searchTerm}
      onChange={onChange}
    />
  )
}));

vi.mock("@/hooks/availability", () => ({
  useAvailabiltyById: () => ({
    data: [{ day_of_week: 0, start_time: "09:00", end_time: "12:00" }],
    isLoading: false,
    error: null
  })
}));

vi.mock("@/hooks/timeOffs", () => ({
  useTimeOffById: () => ({
    data: [],
    isLoading: false,
    error: null
  })
}));

vi.mock("@/hooks/openTimeRanges", () => ({
  useOpenTimeRanges: ({ date }) =>
    date ? [{ start: "09:00", end: "11:00" }] : [],
  getOpenTimeRanges: () => [{ start: "09:00", end: "11:00" }]
}));

vi.mock("@/hooks/timeIntervals", () => ({
  getDaysInMonth: () => [new Date("2026-03-15T00:00:00")],
  computeDateTimeIntervals: () => [
    {
      start: new Date("2026-03-15T09:00:00.000Z"),
      end: new Date("2026-03-15T10:00:00.000Z"),
      startStrAMPM: "09:00AM",
      endStrAMPM: "10:00AM"
    }
  ]
}));

const { default: AppointmentModal } = await import("./AppointmentModal");

const inputs = {
  service: { displayName: "Service" },
  stylist: { displayName: "Stylist" },
  client: { displayName: "Client" },
  pet: { displayName: "Pet" }
};

const services = [{ id: 1, name: "Bath", description: "Basic bath" }];
const stylists = [{ id: 2, first_name: "Sam", last_name: "Smith" }];
const clients = [{ id: 3, first_name: "Jane", last_name: "Doe" }];
const pets = [
  {
    id: 4,
    name: "Buddy",
    owner: 3,
    breed: 7,
    weight_class_id: 9
  }
];
const configs = [
  {
    id: 5,
    breed_id: 7,
    service_id: 1,
    weight_class_id: 9,
    duration_minutes: 60
  }
];

const baseProps = {
  onClose: vi.fn(),
  inputs,
  row: {},
  mode: "create",
  onSubmit: vi.fn(),
  configs,
  services,
  clients,
  breeds: [],
  pets,
  stylists,
  appointmentsData: [],
  isLoading: false
};

const editRow = {
  id: 10,
  client_id: 3,
  pet_id: 4,
  service_id: 1,
  service_configuration_id: 5,
  stylist_id: 2,
  startTime: "2026-03-15T09:00:00.000Z",
  description: "Existing notes",
  client: clients[0],
  pet: pets[0],
  service: services[0],
  stylist: stylists[0]
};

const selectRequiredFields = () => {
  fireEvent.click(screen.getByRole("button", { name: "Bath" }));
  fireEvent.click(screen.getByRole("button", { name: "Sam Smith" }));
  fireEvent.click(screen.getByRole("button", { name: "Doe, Jane" }));
  fireEvent.click(screen.getByRole("button", { name: "Buddy" }));
  fireEvent.click(screen.getByText("Pick date"));
};

describe("AppointmentModal", () => {
  it("submits create payload and closes modal", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<AppointmentModal {...baseProps} onSubmit={onSubmit} onClose={onClose} />);

    selectRequiredFields();
    fireEvent.change(screen.getByPlaceholderText("appointments.placeholderText.remarks"), {
      target: { value: "Nail trim add-on" }
    });
    fireEvent.click(screen.getByRole("button", { name: "09:00AM - 10:00AM" }));
    fireEvent.click(screen.getByText("general.create"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        client_id: 3,
        pet_id: 4,
        service_id: 1,
        service_configuration_id: 5,
        stylist_id: 2,
        startTime: "2026-03-15T09:00:00.000Z",
        description: "Nail trim add-on"
      });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps submit disabled until a time is selected", () => {
    render(<AppointmentModal {...baseProps} />);

    selectRequiredFields();

    expect(screen.getByText("general.create")).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "09:00AM - 10:00AM" }));

    expect(screen.getByText("general.create")).not.toBeDisabled();
  });

  it("shows server error when submit fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue({ error: "Unable to save appointment" });
    const onClose = vi.fn();

    render(<AppointmentModal {...baseProps} onSubmit={onSubmit} onClose={onClose} />);

    selectRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "09:00AM - 10:00AM" }));
    fireEvent.click(screen.getByText("general.create"));

    await waitFor(() => {
      expect(screen.getByText("Unable to save appointment")).toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("disables edit submit until a change is made", () => {
    render(
      <AppointmentModal
        {...baseProps}
        mode="edit"
        row={editRow}
      />
    );

    expect(screen.getByDisplayValue("Existing notes")).toBeInTheDocument();
    expect(screen.getByText("general.update")).toBeDisabled();
  });

  it("submits only changed edit fields and closes modal", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <AppointmentModal
        {...baseProps}
        mode="edit"
        row={editRow}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText("appointments.placeholderText.remarks"),
      {
        target: { value: "Updated notes" }
      }
    );

    fireEvent.click(screen.getByText("general.update"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        description: "Updated notes"
      });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
