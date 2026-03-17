import { apiFetch } from "./api";
export async function getServices() {
  return await apiFetch("/api/services")
}

export async function createService(data) {
  return await apiFetch("/api/services", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updateService(id, data) {
 return await apiFetch(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deleteService(id) {
   return await apiFetch(`/api/services/${id}`, {
    method: "DELETE"
  })
}
