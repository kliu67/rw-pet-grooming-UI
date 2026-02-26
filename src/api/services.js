const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getServices() {
  const res = await fetch(`${API_URL}/services`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch species");
  }

  return res.json();
}

export async function createService(data) {
  const res = await fetch(`${API_URL}/services`, {
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

export async function updateService(id, data) {
  const res = await fetch(`${API_URL}/services/${id}`, {
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

export async function deleteService(id) {
  const res = await fetch(`${API_URL}/services/${id}`, {
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