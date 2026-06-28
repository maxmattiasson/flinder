function showHelpOverlay() {
  const overlay = document.querySelector("#help-overlay");
  overlay.classList.remove("hidden");
}

function hideHelpOverlay() {
  const overlay = document.querySelector("#help-overlay");
  overlay.classList.add("hidden");
  localStorage.setItem("flinderHelpSeen", "true");
}

export function initHelpOverlay() {
  const helpBtn = document.querySelector("#help-btn");
  const closeBtn = document.querySelector("#help-close");
  const overlay = document.querySelector("#help-overlay");
  const helpBox = document.querySelector(".help-box");

  helpBtn.addEventListener("click", showHelpOverlay);
  closeBtn.addEventListener("click", hideHelpOverlay);

  overlay.addEventListener("click", hideHelpOverlay);

  helpBox.addEventListener("click", (e) => e.stopPropagation());

  const hasSeenHelp = localStorage.getItem("flinderHelpSeen");

  if (!hasSeenHelp) {
    showHelpOverlay();
  }
}
