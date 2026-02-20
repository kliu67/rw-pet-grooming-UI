const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getSpecies() {
  const res = await fetch(`${API_URL}/species`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch species");
  }

  return res.json();
}

