function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || "").replace(/\/$/, "");
}

export function createApiFetch({
  baseUrl = "",
  credentials = "include",
  defaultHeaders = { "Content-Type": "application/json" },
  fetchImpl
} = {}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return async function apiFetch(path, options = {}) {
    const activeFetch = fetchImpl || globalThis.fetch;
    const response = await activeFetch(`${normalizedBaseUrl}${path}`, {
      credentials,
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      let errorMessage = "Request failed";

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // ignore json parse failure
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };
}
