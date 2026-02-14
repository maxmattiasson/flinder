export const API_BASE =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : "https://lolguesser-backend.onrender.com";

export const API = `${API_BASE}/api/flinder`;
