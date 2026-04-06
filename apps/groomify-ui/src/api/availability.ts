import { apiFetch } from "./api";

export function getAvailability() {
  return apiFetch("/api/availability");
}

export function getAvailabilityById(id: number | string) {
  return apiFetch(`/api/availability/stylist/${id}`);
}
