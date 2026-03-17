import { beforeEach, describe, expect, it, vi } from "vitest";
import { getWeightClasses } from "./weightClasses";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("weightClasses api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiFetch.mockReset();
  });

  it("gets weight classes", async () => {
    const payload = [{ id: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getWeightClasses()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/weightClasses");
  });

  it("throws fetch error for getWeightClasses", async () => {
    apiFetch.mockRejectedValue(new Error("No weight classes"));

    await expect(getWeightClasses()).rejects.toThrow("No weight classes");
  });
});
