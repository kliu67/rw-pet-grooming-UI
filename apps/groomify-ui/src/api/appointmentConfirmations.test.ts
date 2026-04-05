import { beforeEach, describe, expect, it, vi } from "vitest";
import { getConfirm } from "./appointmentConfirmations";

vi.mock("./api", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "./api";

describe("api/appointmentConfirmations", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(apiFetch).mockReset();
  });

  it("getConfirm returns confirmation payload", async () => {
    const payload = { appointment_number: "ABC-123" };
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(getConfirm(12)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/appointmentConfirmations/12");
  });

  it("getConfirm supports string id", async () => {
    const payload = { appointment_number: "XYZ-999" };
    vi.mocked(apiFetch).mockResolvedValue(payload);

    await expect(getConfirm("uuid-123")).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith(
      "/api/appointmentConfirmations/uuid-123"
    );
  });

  it("getConfirm throws backend error message", async () => {
    vi.mocked(apiFetch).mockRejectedValue(new Error("Not found"));

    await expect(getConfirm(999)).rejects.toThrow("Not found");
  });
});
