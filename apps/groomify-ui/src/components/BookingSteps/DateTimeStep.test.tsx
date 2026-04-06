import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_APPOINTMENTS_DESC_LENGTH } from "../../constants";
import { DateTimeStep } from "./DateTimeStep";

const mockUpdateBookingData = vi.fn();
let mockBookingData: Record<string, any> = {};
const pickerPropsRef: { current: any } = { current: null };

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/context/BookingContext", () => ({
  useBooking: () => ({
    bookingData: mockBookingData,
    updateBookingData: mockUpdateBookingData,
  }),
}));

vi.mock("../DateTimePicker", () => ({
  DateTimePicker: (props: any) => {
    pickerPropsRef.current = props;
    return (
      <button
        type="button"
        data-testid="mock-datetime-picker-select"
        onClick={() =>
          props.onSelect({
            target: {
              name: "startTime",
              value: "2026-03-15T09:00:00.000Z",
            },
          })
        }
      >
        pick-slot
      </button>
    );
  },
}));

describe("DateTimeStep", () => {
  beforeEach(() => {
    mockUpdateBookingData.mockClear();
    pickerPropsRef.current = null;
    mockBookingData = {
      startTime: "",
      description: "",
    };
  });

  it("updates booking startTime when DateTimePicker emits onSelect", () => {
    render(<DateTimeStep onValidityChange={vi.fn()} />);

    fireEvent.click(screen.getByTestId("mock-datetime-picker-select"));

    expect(mockUpdateBookingData).toHaveBeenCalledWith({
      startTime: "2026-03-15T09:00:00.000Z",
    });
  });

  it("shows description length error on blur when description is too long", async () => {
    render(<DateTimeStep onValidityChange={vi.fn()} />);

    fireEvent.blur(screen.getByLabelText(/bookingModal\.message/i), {
      target: {
        name: "description",
        value: "a".repeat(MAX_APPOINTMENTS_DESC_LENGTH + 1),
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText("appointment.errors.descriptionLengthViolation"),
      ).toBeInTheDocument();
    });
  });

  it("passes selected Date to DateTimePicker when startTime exists", () => {
    mockBookingData = {
      startTime: "2026-03-15T09:00:00.000Z",
      description: "",
    };

    render(<DateTimeStep onValidityChange={vi.fn()} />);

    expect(pickerPropsRef.current.selected).toBeInstanceOf(Date);
    expect(pickerPropsRef.current.selected.toISOString()).toBe(
      "2026-03-15T09:00:00.000Z",
    );
  });

  it("calls onValidityChange with true for valid description length", async () => {
    const onValidityChange = vi.fn();
    mockBookingData = {
      startTime: "",
      description: "short note",
    };

    render(<DateTimeStep onValidityChange={onValidityChange} />);

    await waitFor(() => {
      expect(onValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it("passes loading and error flags to DateTimePicker", () => {
    render(
      <DateTimeStep onValidityChange={vi.fn()} isLoading isError />,
    );

    expect(pickerPropsRef.current.isLoading).toBe(true);
    expect(pickerPropsRef.current.isError).toBe(true);
  });
});
