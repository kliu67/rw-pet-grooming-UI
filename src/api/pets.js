const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export async function getPets() {
  const res = await fetch(`${API_URL}/api/pets`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch Pets");
  }

  return res.json();
}

export async function createPet(data) {
  const res = await fetch(`${API_URL}/api/pets`, {
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

export async function updatePet(id, data) {
  const res = await fetch(`${API_URL}/api/pets/${id}`, {
    method: "PATCH", // or PATCH depending on backend
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update pet");
  }

  return res.json();
}

export async function deletePet(id) {
  const res = await fetch(`${API_URL}/api/pets/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete pet");
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}