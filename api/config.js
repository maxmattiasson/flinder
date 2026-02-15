export const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://api.lolgiss.com";

export const API = `${API_BASE}/api/flinder`;
// export const API = "http://localhost:3000/api/flinder";
