const isLocalhost =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const API = isLocalhost
  ? "http://localhost:4000/api"
  : "https://api.lolgiss.com/api/flinder";
