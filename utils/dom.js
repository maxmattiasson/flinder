export function createError(msg, color) {
  document.querySelectorAll(".error").forEach((e) => e.remove());
  const error = document.createElement("p");
  error.classList.add("error");
  error.textContent = msg;
  error.style.color = color || "red";
  return error;
}
