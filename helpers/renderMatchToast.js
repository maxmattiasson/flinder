export function renderMatchToast(movieTitle, matches) {
  const toast = document.getElementById("match-toast");
  if (!toast) return;

  const first = matches[0];
  const displayName =
    first.display_name?.trim() || first.friend_code?.trim() || "a friend";

  toast.style.display = "block";

  if (matches.length === 1) {
    toast.textContent = `Match on ${movieTitle} with ${displayName}!`;
  } else if (matches.length >= 2) {
    const matchCount = matches.length - 1;
    toast.textContent = `Match on ${movieTitle} with ${displayName}, and ${matchCount} more!`;
  }
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}
