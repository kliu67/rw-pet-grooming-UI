import { apiFetch } from "./api";

export async function getTimeOffs() {
 return await apiFetch("/api/timeOffs");
}

export async function getTimeOffByStylistId(id) {
  return await apiFetch(`/api/timeOffs/stylist/${id}`);
};