const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getClients() {
  const res = await fetch(`${API_URL}/api/users`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch clients");
  }

  return res.json();
}

export async function createClient(data) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;   // important
  }

  return res.json();
}

export async function updateClient(id, data) {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT", // or PATCH depending on backend
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update service");
  }

  return res.json();
}

export async function deleteClient(id) {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete service");
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}