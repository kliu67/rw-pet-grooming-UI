import { apiFetch } from "./api";

export function getBreeds() {
  return apiFetch("/api/breeds");
}

export function createBreed(data: unknown) {
  return apiFetch("/api/breeds", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateBreed(id: number | string, data: unknown) {
  return apiFetch(`/api/breeds/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteBreed(id: number | string) {
  return apiFetch(`/api/breeds/${id}`, {
    method: "DELETE"
  });
}
