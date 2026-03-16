import {
  createBreed,
  deleteBreed,
  getBreeds,
  updateBreed
} from "./breeds";

describe("api/breeds", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getBreeds returns breeds list on success", async () => {
    const payload = [{ id: 1, name: "Poodle" }];
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(payload) });

    await expect(getBreeds()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/breeds");
  });

  it("getBreeds throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Bad request" })
    });

    await expect(getBreeds()).rejects.toThrow("Bad request");
  });

  it("createBreed posts payload and returns created breed", async () => {
    const input = { name: "Bulldog" };
    const created = { id: 10, name: "Bulldog" };
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(created) });

    await expect(createBreed(input)).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/breeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
  });

  it("createBreed throws raw backend error object", async () => {
    const backendError = { message: "Duplicate breed" };
    fetch.mockResolvedValue({ ok: false, json: vi.fn().mockResolvedValue(backendError) });

    await expect(createBreed({ name: "Poodle" })).rejects.toEqual(backendError);
  });

  it("updateBreed sends PUT and throws fallback message when response has no json", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error("no json body"))
    });

    await expect(updateBreed(1, { name: "Mix" })).rejects.toThrow("Failed to update breed");
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/breeds/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Mix" })
    });
  });

  it("deleteBreed returns null when delete response has no body", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("empty body"))
    });

    await expect(deleteBreed(1)).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/breeds/1", {
      method: "DELETE"
    });
  });
});
