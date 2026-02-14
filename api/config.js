export const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://api.lolgiss.com";

export const API = `${API_BASE}/api/flinder`;
