export function initCategories() {
  document.querySelector("#popular").addEventListener("click", () => {
    localStorage.setItem("activeCategory", "popular");
    console.log("saved cat to local");
    renderActiveCategory(e); // inte bra
  });
  document.querySelector("#top-rated").addEventListener("click", () => {
    localStorage.setItem("activeCategory", "top-rated");
    console.log("saved cat to local");
    renderActiveCategory(e); // inte bra
  });
}
export function getActiveCategory() {
  return localStorage.getItem("activeCategory") || "popular";
}

function renderActiveCategory(e) {
  // fixa detta in bra
  document
    .querySelectorAll(".cat-selected")
    .forEach((el) => el.classList.remove("cat-selected"));
  const activeCat = e.target.closest(".cat-btn");
  if (activeCat) {
    activeCat.classList.add("cat-selected");
  }
}
