import { apiFetch } from "./api";

export function getPets() {
  return apiFetch("/api/pets");
}

export function createPet(data: unknown) {
  return apiFetch("/api/pets", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updatePet(id: number | string, data: unknown) {
  return apiFetch(`/api/pets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deletePet(id: number | string) {
  return apiFetch(`/api/pets/${id}`, {
    method: "DELETE"
  });
}
