import { API_URL } from "@/constants";

export async function getAvailability() {
  const res = await fetch(`${API_URL}/api/availability`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch availability list");
  }
  return res.json();
}

export async function getAvailabilityById(id){
const res = await fetch(`${API_URL}/api/availability/stylist/${id}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch availability");
  }
  return res.json();
}