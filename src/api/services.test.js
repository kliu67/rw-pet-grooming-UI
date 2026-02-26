import {
  createService,
  deleteService,
  getServices,
  updateService
} from "./services";

describe("api/services", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getServices returns services list on success", async () => {
    const payload = [{ id: 1, name: "Bath" }];
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(payload) });

    await expect(getServices()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/services");
  });

  it("getServices throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Services unavailable" })
    });

    await expect(getServices()).rejects.toThrow("Services unavailable");
  });

  it("createService posts payload and returns created service", async () => {
    const input = { name: "Haircut", base_price: 25 };
    const created = { id: 7, ...input };
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(created) });

    await expect(createService(input)).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
  });

  it("createService throws raw backend error object", async () => {
    const backendError = { message: "Validation failed" };
    fetch.mockResolvedValue({ ok: false, json: vi.fn().mockResolvedValue(backendError) });

    await expect(createService({ name: "" })).rejects.toEqual(backendError);
  });

  it("updateService sends PUT and throws specific backend message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "Not found" })
    });

    await expect(updateService(5, { name: "Spa" })).rejects.toThrow("Not found");
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/services/5", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Spa" })
    });
  });

  it("deleteService throws fallback message when response is not json", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error("invalid json"))
    });

    await expect(deleteService(2)).rejects.toThrow("Failed to delete service");
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/services/2", {
      method: "DELETE"
    });
  });
});
