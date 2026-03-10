import { API_URL } from "@/constants";

export async function getTimeOffs() {
  const res = await fetch(`${API_URL}/api/timeOffs`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch time offs");
  }
  return res.json();
}

export async function getTimeOffByStylistId(id) {
  const res = await fetch(`${API_URL}/api/timeOffs/stylist/${id}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch time offs by id");
  }
  return res.json();
}