import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPet, deletePet, getPets, updatePet } from "./pets";

describe("pets api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("gets pets", async () => {
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getPets()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/pets");
  });

  it("throws fetch error for getPets", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "No pets" })
    });

    await expect(getPets()).rejects.toThrow("No pets");
  });

  it("creates a pet", async () => {
    const data = { name: "Buddy" };
    const payload = { id: 2 };
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(createPet(data)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  });

  it("throws raw error object for createPet", async () => {
    const error = { error: "Bad pet" };
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue(error)
    });

    await expect(createPet({})).rejects.toEqual(error);
  });

  it("updates a pet", async () => {
    const data = { name: "Max" };
    const payload = { ok: true };
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(updatePet(2, data)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/pets/2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  });

  it("throws fallback error for updatePet", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error("bad json"))
    });

    await expect(updatePet(2, {})).rejects.toThrow("Failed to update pet");
  });

  it("deletes a pet", async () => {
    const payload = { ok: true };
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(deletePet(3)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/pets/3", {
      method: "DELETE"
    });
  });

  it("returns null when deletePet response body is empty", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("empty"))
    });

    await expect(deletePet(3)).resolves.toBeNull();
  });
});
