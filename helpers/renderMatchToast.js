import { icons } from "../assets/svg/svgImport.js";

export function renderMatchToast(movieTitle, matches) {
  const toast = document.getElementById("match-toast");
  if (!toast) return;

  const first = matches[0];
  const displayName =
    first.display_name?.trim() || first.friend_code?.trim() || "a friend";

  toast.classList.add("toast-show");

  const matchText = document.createElement("div");
  const titleSpan = document.createElement("span");
  const nameSpan = document.createElement("span");

  titleSpan.textContent = movieTitle;
  titleSpan.classList.add("toast-title");
  nameSpan.textContent = displayName;
  nameSpan.classList.add("toast-name");

  matchText.innerHTML = `${icons.heart} Match ${icons.heart}`;

  const infoText = document.createElement("p");

  if (matches.length > 0) {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
  }

  if (matches.length === 1) {
    infoText.replaceChildren(titleSpan, " with ", nameSpan, "!");
  } else if (matches.length >= 2) {
    const matchCount = matches.length - 1;
    const countSpan = document.createElement("span");
    countSpan.textContent = matchCount;
    countSpan.classList.add("toast-count");

    infoText.replaceChildren(
      titleSpan,
      " with ",
      nameSpan,
      " and ",
      countSpan,
      " more!",
    );
  }
  console.log(titleSpan, nameSpan);
  toast.replaceChildren(matchText, infoText);

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 3000);
}
