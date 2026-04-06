import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { apiFetch } from "./api";

describe("apiFetch", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed json on success", async () => {
    const payload = { ok: true };
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(apiFetch("/api/clients")).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/clients"),
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({ "Content-Type": "application/json" })
      })
    );
  });

  it("throws backend error message when available", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ error: "Bad request" })
    });

    await expect(apiFetch("/api/clients")).rejects.toThrow("Bad request");
  });

  it("throws default error when response is not json", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error("invalid json"))
    });

    await expect(apiFetch("/api/clients")).rejects.toThrow("Request failed");
  });

  it("returns null for 204 responses", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn()
    });

    await expect(apiFetch("/api/clients")).resolves.toBeNull();
  });

  it("merges custom headers with defaults", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ ok: true })
    });

    await apiFetch("/api/clients", {
      headers: { "X-Test": "true" }
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Test": "true"
        })
      })
    );
  });
});
