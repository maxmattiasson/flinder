// export default function createExpandable(text, previewLength = 120) {
//   const details = document.createElement("details");
//   const summary = document.createElement("summary");
//   const full = document.createElement("span");

//   summary.textContent = text.slice(0, previewLength) + "...";
//   full.textContent = text.slice(previewLength);

//   details.append(summary, full);
//   return details;
// }
export default function createExpandable(text, previewLength = 100) {
  const safeText = String(text ?? "").trim();

  if (safeText.length <= previewLength) {
    const p = document.createElement("p");
    p.textContent = safeText;
    return p;
  }

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const preview = document.createElement("p");
  const full = document.createElement("p");

  const sliced = safeText.slice(0, previewLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const cutIndex = lastSpace > 0 ? lastSpace : previewLength;

  preview.textContent = `${safeText.slice(0, cutIndex)}…`;
  full.textContent = safeText;

  summary.textContent = "Show more";

  details.append(summary, preview, full);

  details.addEventListener("toggle", () => {
    summary.textContent = details.open ? "Show less" : "Show more";
    preview.hidden = details.open;
    full.hidden = !details.open;
  });

  preview.hidden = false;
  full.hidden = true;

  return details;
}
