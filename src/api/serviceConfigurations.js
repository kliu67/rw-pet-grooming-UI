const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getServiceConfigurations() {
  const res = await fetch(`${API_URL}/api/serviceConfigurations`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch service configuration");
  }

  return res.json();
}
