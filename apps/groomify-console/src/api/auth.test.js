import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loginUser, logout, me, refresh, registerUser } from "./auth";

const API_URL = "http://localhost:3000";

describe("api/auth", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loginUser posts credentials and returns payload", async () => {
    const payload = { user: { email: "a@b.com" } };
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(loginUser({ email: "a@b.com", password: "pw" })).resolves.toEqual({
      status: 200,
      data: payload
    });

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com", password: "pw" }),
      credentials: "include"
    });
  });

  it("loginUser throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ error: "Invalid" })
    });

    await expect(loginUser({ email: "a@b.com", password: "pw" })).rejects.toThrow(
      "Invalid"
    );
  });

  it("registerUser posts payload and returns data", async () => {
    const payload = { id: 1, email: "a@b.com" };
    fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(registerUser({ email: "a@b.com" })).resolves.toEqual({
      status: 201,
      data: payload
    });

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com" })
    });
  });

  it("registerUser throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ message: "Bad request" })
    });

    await expect(registerUser({})).rejects.toThrow("Bad request");
  });

  it("refresh posts with credentials", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn().mockResolvedValue(null)
    });

    await expect(refresh()).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });
  });

  it("refresh throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ error: "Unauthorized" })
    });

    await expect(refresh()).rejects.toThrow("Unauthorized");
  });

  it("logout posts with credentials", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn().mockResolvedValue(null)
    });

    await expect(logout()).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
  });

  it("logout throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ error: "Failed" })
    });

    await expect(logout()).rejects.toThrow("Failed");
  });

  it("me returns payload", async () => {
    const payload = { user: { email: "a@b.com" } };
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(me()).resolves.toEqual({ status: 200, data: payload });

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/me`, {
      credentials: "include"
    });
  });

  it("me throws backend error message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ error: "No session" })
    });

    await expect(me()).rejects.toThrow("No session");
  });
});
