import { apiFetch } from "./api";

export async function getStylists() {
  return await apiFetch("/api/stylists");
}

export async function createStylist(data) {
  return await apiFetch("/api/stylists", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updateStylist(id, data) {
   return await apiFetch(`/api/stylists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deleteStylist(id) {
  return await apiFetch(`/api/stylists/${id}`, {
    method: "DELETE"
  })
}