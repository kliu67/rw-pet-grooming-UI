import {
  createClient,
  deleteClient,
  getClients,
  updateClient
} from "./clients";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("api/clients", () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getClients returns clients list on success", async () => {
    const payload = [{ id: 1, first_name: "Jane" }];
    apiFetch.mockResolvedValue(payload);

    await expect(getClients()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/clients");
  });

  it("getClients throws backend error message", async () => {
    apiFetch.mockRejectedValue(new Error("Clients unavailable"));

    await expect(getClients()).rejects.toThrow("Clients unavailable");
  });

  it("createClient posts payload and returns created client", async () => {
    const input = { first_name: "Jane", last_name: "Doe" };
    const created = { id: 10, ...input };
    apiFetch.mockResolvedValue(created);

    await expect(createClient(input)).resolves.toEqual(created);
    expect(apiFetch).toHaveBeenCalledWith("/api/clients", {
      method: "POST",
      body: JSON.stringify(input)
    });
  });

  it("createClient throws backend error message", async () => {
    apiFetch.mockRejectedValue(new Error("Validation failed"));

    await expect(createClient({ first_name: "" })).rejects.toThrow("Validation failed");
  });

  it("updateClient forwards payload to apiFetch", async () => {
    apiFetch.mockResolvedValue({ id: 1, first_name: "Janet" });

    await expect(updateClient(1, { first_name: "Janet" })).resolves.toEqual({
      id: 1,
      first_name: "Janet"
    });
    expect(apiFetch).toHaveBeenCalledWith("/api/clients/1", {
      method: "PUT",
      body: JSON.stringify({ first_name: "Janet" })
    });
  });

  it("deleteClient returns null when response has no json body", async () => {
    apiFetch.mockResolvedValue(null);

    await expect(deleteClient(1)).resolves.toBeNull();
    expect(apiFetch).toHaveBeenCalledWith("/api/clients/1", {
      method: "DELETE"
    });
  });
});
