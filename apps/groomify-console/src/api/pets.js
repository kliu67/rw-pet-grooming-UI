import { apiFetch } from "./api";
export async function getPets() {
 return await apiFetch("/api/pets");
}

export async function getPet(id) {
  return await apiFetch(`/api/pets/${id}`)
}

export async function getPetByOwner(clientId){
  return await apiFetch(`/api/pets/owner/${clientId}`);
}

export async function createPet(data) {
return await apiFetch("/api/pets", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updatePet(id, data) {
   return await apiFetch(`/api/pets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export async function deletePet(id) {
  return await apiFetch(`/api/pets/${id}`, {
    method: "DELETE"
  })
}