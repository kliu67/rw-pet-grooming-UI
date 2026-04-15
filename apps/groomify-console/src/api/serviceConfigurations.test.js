import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServiceConfigurations } from "./serviceConfigurations";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("serviceConfigurations api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiFetch.mockReset();
  });

  it("gets service configurations", async () => {
    const payload = [{ id: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getServiceConfigurations()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/serviceConfigurations");
  });

  it("throws fetch error for getServiceConfigurations", async () => {
    apiFetch.mockRejectedValue(new Error("No configs"));

    await expect(getServiceConfigurations()).rejects.toThrow("No configs");
  });
});
