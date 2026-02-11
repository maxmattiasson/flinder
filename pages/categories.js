export function initCategories() {
  const active = getActiveCategory();
  document.querySelectorAll(".cat-btn").forEach((el) => {
    if (active == el.id) {
      el.classList.add("cat-selected");
    }
  });

  document.querySelector("#popular").addEventListener("click", () => {
    localStorage.setItem("activeCategory", "popular");
    console.log("saved cat to local");
    // inte bra
  });
  document.querySelector("#top-rated").addEventListener("click", () => {
    localStorage.setItem("activeCategory", "top-rated");
    console.log("saved cat to local");
    // inte bra
  });
  document.querySelector(".cat-btn-cont").addEventListener("click", (e) => {
    renderActiveCategory(e);
  });
}
export function getActiveCategory() {
  return localStorage.getItem("activeCategory") || "popular";
}

function renderActiveCategory(e) {
  const activeCat = e.target.closest(".cat-btn");
  if (!activeCat) return;

  document.querySelectorAll(".cat-btn").forEach((el) => {
    el.classList.remove("cat-selected");
  });

  if (activeCat) {
    activeCat.classList.add("cat-selected");
    console.log();
  }
}
