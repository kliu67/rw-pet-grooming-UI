import { apiFetch } from "./api";

export function getTimeOffs() {
  return apiFetch("/api/timeOffs");
}

export function getTimeOffByStylistId(id: number | string) {
  return apiFetch(`/api/timeOffs/stylist/${id}`);
}
