import { apiFetch } from "./api";
export async function getPets() {
 return await apiFetch("/api/pets");
}

export async function createPet(data) {
return await apiFetch("/api/pets", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updatePet(id, data) {
   return await apiFetch(`/api/pets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deletePet(id) {
  return await apiFetch(`/api/pets/${id}`, {
    method: "DELETE"
  })
}