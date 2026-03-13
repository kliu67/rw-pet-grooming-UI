import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment
} from "./appointments";

describe("appointments api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("gets appointments", async () => {
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getAppointments()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/appointments");
  });

  it("throws fetch error for getAppointments", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "No appointments" })
    });

    await expect(getAppointments()).rejects.toThrow("No appointments");
  });

  it("creates an appointment", async () => {
    const data = { client_id: 1 };
    const payload = { id: 3 };
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(createAppointment(data)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  });

  it("throws raw error object for createAppointment", async () => {
    const error = { error: "Bad request" };
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue(error)
    });

    await expect(createAppointment({})).rejects.toEqual(error);
  });

  it("updates an appointment", async () => {
    const data = { status: "completed" };
    const payload = { ok: true };
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(updateAppointment(4, data)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/appointments/4/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  });

  it("throws fallback error for updateAppointment", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error("bad json"))
    });

    await expect(updateAppointment(4, {})).rejects.toThrow("Failed to update appointment");
  });

  it("deletes an appointment", async () => {
    const payload = { ok: true };
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(deleteAppointment(6)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/appointments/6", {
      method: "DELETE"
    });
  });

  it("returns null when delete response has no json body", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("empty"))
    });

    await expect(deleteAppointment(6)).resolves.toBeNull();
  });
});
