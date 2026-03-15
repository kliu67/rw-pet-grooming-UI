import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServiceConfigurations } from "./serviceConfigurations";

describe("serviceConfigurations api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("gets service configurations", async () => {
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getServiceConfigurations()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/serviceConfigurations/all");
  });

  it("throws fetch error for getServiceConfigurations", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "No configs" })
    });

    await expect(getServiceConfigurations()).rejects.toThrow("No configs");
  });
});
