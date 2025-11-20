export function initCategories() {
  document.querySelector("#popular").addEventListener("click", () => {
    localStorage.setItem("activeCategory", "popular");
    console.log("saved cat to local");
  });
  document.querySelector("#top-rated").addEventListener("click", () => {
    localStorage.setItem("activeCategory", "top-rated");
    console.log("saved cat to local");
  });
}
export function getActiveCategory() {
  return localStorage.getItem("activeCategory") || "popular";
}
