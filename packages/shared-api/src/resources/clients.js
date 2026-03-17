export function createClientsApi({ apiFetch }) {
  if (typeof apiFetch !== "function") {
    throw new Error("createClientsApi requires an apiFetch function");
  }

  return {
    getClients() {
      return apiFetch("/api/clients");
    },

    createClient(data) {
      return apiFetch("/api/clients", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },

    updateClient(id, data) {
      return apiFetch(`/api/clients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },

    deleteClient(id) {
      return apiFetch(`/api/clients/${id}`, {
        method: "DELETE"
      });
    }
  };
}
