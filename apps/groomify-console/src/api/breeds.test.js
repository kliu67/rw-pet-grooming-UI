import {
  createBreed,
  deleteBreed,
  getBreeds,
  updateBreed
} from "./breeds";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("api/breeds", () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getBreeds returns breeds list on success", async () => {
    const payload = [{ id: 1, name: "Poodle" }];
    apiFetch.mockResolvedValue(payload);

    await expect(getBreeds()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/breeds");
  });

  it("getBreeds throws backend error message", async () => {
    apiFetch.mockRejectedValue(new Error("Bad request"));

    await expect(getBreeds()).rejects.toThrow("Bad request");
  });

  it("createBreed posts payload and returns created breed", async () => {
    const input = { name: "Bulldog" };
    const created = { id: 10, name: "Bulldog" };
    apiFetch.mockResolvedValue(created);

    await expect(createBreed(input)).resolves.toEqual(created);
    expect(apiFetch).toHaveBeenCalledWith("/api/breeds", {
      method: "POST",
      body: JSON.stringify(input)
    });
  });

  it("createBreed throws backend error message", async () => {
    apiFetch.mockRejectedValue(new Error("Duplicate breed"));

    await expect(createBreed({ name: "Poodle" })).rejects.toThrow("Duplicate breed");
  });

  it("updateBreed sends PUT and throws fallback message when response has no json", async () => {
    apiFetch.mockRejectedValue(new Error("Request failed"));

    await expect(updateBreed(1, { name: "Mix" })).rejects.toThrow("Request failed");
    expect(apiFetch).toHaveBeenCalledWith("/api/breeds/1", {
      method: "PUT",
      body: JSON.stringify({ name: "Mix" })
    });
  });

  it("deleteBreed returns null when delete response has no body", async () => {
    apiFetch.mockResolvedValue(null);

    await expect(deleteBreed(1)).resolves.toBeNull();
    expect(apiFetch).toHaveBeenCalledWith("/api/breeds/1", {
      method: "DELETE"
    });
  });
});
