import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPet, deletePet, getPets, updatePet } from "./pets";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("pets api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiFetch.mockReset();
  });

  it("gets pets", async () => {
    const payload = [{ id: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getPets()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets");
  });

  it("throws fetch error for getPets", async () => {
    apiFetch.mockRejectedValue(new Error("No pets"));

    await expect(getPets()).rejects.toThrow("No pets");
  });

  it("creates a pet", async () => {
    const data = { name: "Buddy" };
    const payload = { id: 2 };
    apiFetch.mockResolvedValue(payload);

    await expect(createPet(data)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets", {
      method: "POST",
      body: JSON.stringify(data)
    });
  });

  it("throws backend error message for createPet", async () => {
    apiFetch.mockRejectedValue(new Error("Bad pet"));

    await expect(createPet({})).rejects.toThrow("Bad pet");
  });

  it("updates a pet", async () => {
    const data = { name: "Max" };
    const payload = { ok: true };
    apiFetch.mockResolvedValue(payload);

    await expect(updatePet(2, data)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets/2", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  });

  it("throws backend error message for updatePet", async () => {
    apiFetch.mockRejectedValue(new Error("Failed to update pet"));

    await expect(updatePet(2, {})).rejects.toThrow("Failed to update pet");
  });

  it("deletes a pet", async () => {
    const payload = { ok: true };
    apiFetch.mockResolvedValue(payload);

    await expect(deletePet(3)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets/3", {
      method: "DELETE"
    });
  });

  it("returns null when deletePet response body is empty", async () => {
    apiFetch.mockResolvedValue(null);

    await expect(deletePet(3)).resolves.toBeNull();
  });
});
