import { API_URL } from "@/constants";

function toError(res: Response, payload: any) {
  const rawMessage = payload?.message || payload?.error || "Request failed";
  const message = typeof rawMessage === "string" ? rawMessage : "Request failed";
  const error = new Error(message) as Error & { status?: number; error?: unknown };
  error.status = res.status;
  error.error = payload?.error;
  return error;
}

async function handleJsonResponse(res: Response) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw toError(res, err);
  }

  const payload = await res.json().catch(() => null);
  return { status: res.status, data: payload };
}

export async function registerUser(data: unknown) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return handleJsonResponse(res);
}

export async function loginUser(data: unknown) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });

  return handleJsonResponse(res);
}

export async function refresh() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw toError(res, err);
  }
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw toError(res, err);
  }
}

export async function me() {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include"
  });

  return handleJsonResponse(res);
}
