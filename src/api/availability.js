import { apiFetch } from "./api";

export async function getAvailability() {
  return await apiFetch("/api/availability")
}

export async function getAvailabilityById(id){
  return await apiFetch(`/api/availability/stylist/${id}`)
}