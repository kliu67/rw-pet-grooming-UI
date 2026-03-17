import { beforeEach, describe, expect, it, vi } from "vitest";
import { getStylists } from "./stylists";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("stylists api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiFetch.mockReset();
  });

  it("gets stylists", async () => {
    const payload = [{ id: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getStylists()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/stylists");
  });

  it("throws fetch error for getStylists", async () => {
    apiFetch.mockRejectedValue(new Error("No stylists"));

    await expect(getStylists()).rejects.toThrow("No stylists");
  });
});
