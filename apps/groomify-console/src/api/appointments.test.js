import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment
} from "./appointments";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("appointments api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiFetch.mockReset();
  });

  it("gets appointments", async () => {
    const payload = [{ id: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getAppointments()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/appointments");
  });

  it("throws fetch error for getAppointments", async () => {
    apiFetch.mockRejectedValue(new Error("No appointments"));

    await expect(getAppointments()).rejects.toThrow("No appointments");
  });

  it("creates an appointment", async () => {
    const data = { client_id: 1 };
    const payload = { id: 3 };
    apiFetch.mockResolvedValue(payload);

    await expect(createAppointment(data)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data)
    });
  });

  it("throws backend error message for createAppointment", async () => {
    apiFetch.mockRejectedValue(new Error("Bad request"));

    await expect(createAppointment({})).rejects.toThrow("Bad request");
  });

  it("updates an appointment", async () => {
    const data = { status: "completed" };
    const payload = { ok: true };
    apiFetch.mockResolvedValue(payload);

    await expect(updateAppointment(4, data)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/appointments/4/update", {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  });

  it("throws backend error message for updateAppointment", async () => {
    apiFetch.mockRejectedValue(new Error("Request failed"));

    await expect(updateAppointment(4, {})).rejects.toThrow("Request failed");
  });

  it("deletes an appointment", async () => {
    const payload = { ok: true };
    apiFetch.mockResolvedValue(payload);

    await expect(deleteAppointment(6)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/appointments/6", {
      method: "DELETE"
    });
  });

  it("returns null when delete response has no json body", async () => {
    apiFetch.mockResolvedValue(null);

    await expect(deleteAppointment(6)).resolves.toBeNull();
  });
});
