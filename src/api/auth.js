const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawMessage = err?.message || err?.error || "Request failed";
    const message =
      typeof rawMessage === "string" ? rawMessage : "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.error = err.error;
    throw error;
  }

  const payload = await res.json().catch(() => null);
  return { status: res.status, data: payload };
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawMessage = err?.message || err?.error || "Request failed";
    const message =
      typeof rawMessage === "string" ? rawMessage : "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.error = err.error;
    throw error;
  }

  const payload = await res.json().catch(() => null);
  return { status: res.status, data: payload };
}

export async function refresh() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawMessage = err?.message || err?.error || "Request failed";
    const message =
      typeof rawMessage === "string" ? rawMessage : "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.error = err.error;
    throw error;
  }
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawMessage = err?.message || err?.error || "Request failed";
    const message =
      typeof rawMessage === "string" ? rawMessage : "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.error = err.error;
    throw error;
  }
}
