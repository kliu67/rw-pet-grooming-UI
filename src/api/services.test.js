import {
  createService,
  deleteService,
  getServices,
  updateService
} from "./services";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("api/services", () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getServices returns services list on success", async () => {
    const payload = [{ id: 1, name: "Bath" }];
    apiFetch.mockResolvedValue(payload);

    await expect(getServices()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/services");
  });

  it("getServices throws backend error message", async () => {
    apiFetch.mockRejectedValue(new Error("Services unavailable"));

    await expect(getServices()).rejects.toThrow("Services unavailable");
  });

  it("createService posts payload and returns created service", async () => {
    const input = { name: "Haircut", base_price: 25 };
    const created = { id: 7, ...input };
    apiFetch.mockResolvedValue(created);

    await expect(createService(input)).resolves.toEqual(created);
    expect(apiFetch).toHaveBeenCalledWith("/api/services", {
      method: "POST",
      body: JSON.stringify(input)
    });
  });

  it("createService throws backend error message", async () => {
    apiFetch.mockRejectedValue(new Error("Validation failed"));

    await expect(createService({ name: "" })).rejects.toThrow("Validation failed");
  });

  it("updateService sends PUT and throws specific backend message", async () => {
    apiFetch.mockRejectedValue(new Error("Not found"));

    await expect(updateService(5, { name: "Spa" })).rejects.toThrow("Not found");
    expect(apiFetch).toHaveBeenCalledWith("/api/services/5", {
      method: "PUT",
      body: JSON.stringify({ name: "Spa" })
    });
  });

  it("deleteService throws fallback message when response is not json", async () => {
    apiFetch.mockRejectedValue(new Error("Request failed"));

    await expect(deleteService(2)).rejects.toThrow("Request failed");
    expect(apiFetch).toHaveBeenCalledWith("/api/services/2", {
      method: "DELETE"
    });
  });
});
