export function createClientsApi({ apiFetch }) {
  if (typeof apiFetch !== "function") {
    throw new Error("createClientsApi requires an apiFetch function");
  }

  return {
    getClients() {
      return apiFetch("/api/clients");
    },

    getClient(id) {
      return apiFetch(`/api/clients/${id}`);
    },

    lookupClient(data) {
      const params = new URLSearchParams({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      });
      return apiFetch(`/api/clients/lookup?${params.toString()}`);
    },

    createClient(data) {
      return apiFetch("/api/clients", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    updateClient(id, data) {
      return apiFetch(`/api/clients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    deleteClient(id) {
      return apiFetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
    },
  };
}
