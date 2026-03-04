import { API_URL } from "@/constants";

export async function getStylists() {
  const res = await fetch(`${API_URL}/api/stylists`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch stylists");
  }

  return res.json();
}