export function createServicesApi({ apiFetch }) {
  if (typeof apiFetch !== "function") {
    throw new Error("createServicesApi requires an apiFetch function");
  }

  return {
    getServices() {
      return apiFetch("/api/services");
    },

    createService(data) {
      return apiFetch("/api/services", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },

    updateService(id, data) {
      return apiFetch(`/api/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },

    deleteService(id) {
      return apiFetch(`/api/services/${id}`, {
        method: "DELETE"
      });
    }
  };
}
