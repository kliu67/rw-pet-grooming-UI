import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createPet,
  deletePet,
  getPet,
  getPetByOwner,
  getPets,
  updatePet
} from "./pets";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("api/pets", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(apiFetch).mockReset();
  });

  it("getPets returns pets list", async () => {
    const payload = [{ id: 1, name: "Buddy" }];
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(getPets()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets");
  });

  it("getPets throws backend error message", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new Error("No pets"));

    await expect(getPets()).rejects.toThrow("No pets");
  });

  it("getPet returns a single pet", async () => {
    const payload = { id: 2, name: "Max" };
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(getPet(2)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets/2");
  });

  it("getPetByOwner returns owner pets", async () => {
    const payload = [{ id: 2, owner: 7, name: "Max" }];
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(getPetByOwner(7)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets/owner/7");
  });

  it("createPet posts payload and returns created pet", async () => {
    const data = { name: "Buddy", owner: 1 };
    const payload = { id: 10, ...data };
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(createPet(data)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets", {
      method: "POST",
      body: JSON.stringify(data)
    });
  });

  it("createPet throws backend error message", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new Error("Validation failed"));

    await expect(createPet({})).rejects.toThrow("Validation failed");
  });

  it("updatePet forwards payload and returns updated pet", async () => {
    const data = { name: "Milo" };
    const payload = { id: 1, ...data };
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(updatePet(1, data)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets/1", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  });

  it("updatePet throws backend error message", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new Error("Update failed"));

    await expect(updatePet(1, {})).rejects.toThrow("Update failed");
  });

  it("deletePet sends delete and returns payload", async () => {
    const payload = { ok: true };
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(deletePet(3)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/pets/3", {
      method: "DELETE"
    });
  });

  it("deletePet returns null for empty body responses", async () => {
    vi.mocked(apiFetch).mockResolvedValue(null);

    await expect(deletePet(3)).resolves.toBeNull();
  });
});
