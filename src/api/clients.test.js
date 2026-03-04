import {
  createClient,
  deleteClient,
  getClients,
  updateClient
} from "./clients";

describe("api/clients", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getClients returns clients list on success", async () => {
    const payload = [{ id: 1, first_name: "Jane" }];
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(payload) });

    await expect(getClients()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/users");
  });

  it("getClients throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Clients unavailable" })
    });

    await expect(getClients()).rejects.toThrow("Clients unavailable");
  });

  it("createClient posts payload and returns created client", async () => {
    const input = { first_name: "Jane", last_name: "Doe" };
    const created = { id: 10, ...input };
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(created) });

    await expect(createClient(input)).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
  });

  it("createClient throws raw backend error object", async () => {
    const backendError = { message: "Validation failed" };
    fetch.mockResolvedValue({ ok: false, json: vi.fn().mockResolvedValue(backendError) });

    await expect(createClient({ first_name: "" })).rejects.toEqual(backendError);
  });

  it("updateClient throws fallback message when response is not json", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error("invalid json"))
    });

    await expect(updateClient(1, { first_name: "Janet" })).rejects.toThrow("Failed to update client");
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/users/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: "Janet" })
    });
  });

  it("deleteClient returns null when response has no json body", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("empty body"))
    });

    await expect(deleteClient(1)).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/users/1", {
      method: "DELETE"
    });
  });
});
