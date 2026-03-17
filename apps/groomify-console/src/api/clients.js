import { apiFetch } from "./api";
export async function getClients() {
  return await apiFetch("/api/clients");
}

export async function createClient(data) {
  return await apiFetch("/api/clients", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updateClient(id, data) {
   return await apiFetch(`/api/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deleteClient(id) {
  return await apiFetch(`/api/clients/${id}`, {
    method: "DELETE"
  })
}
