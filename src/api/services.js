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
    throw new Error("Failed to create service");
  }

  return res.json();
}