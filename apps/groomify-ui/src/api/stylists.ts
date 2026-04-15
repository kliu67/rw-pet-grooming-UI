import { apiFetch } from "./api";

export function getStylists() {
  return apiFetch("/api/stylists");
}

export function createStylist(data: unknown) {
  return apiFetch("/api/stylists", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateStylist(id: number | string, data: unknown) {
  return apiFetch(`/api/stylists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteStylist(id: number | string) {
  return apiFetch(`/api/stylists/${id}`, {
    method: "DELETE"
  });
}
