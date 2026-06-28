export function swipe(card, onSwipe) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  card.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    currentX = e.clientX - startX;
    const rotate = currentX / 20;

    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
  });

  card.addEventListener("pointerup", () => {
    dragging = false;

    if (Math.abs(currentX) > 120) {
      const direction = currentX > 0 ? 1 : -1;

      card.style.transition = "transform 0.3s ease";
      card.style.transform = `translateX(${direction * 500}px) rotate(${direction * 25}deg)`;

      setTimeout(() => {
        console.log(direction === 1 ? "liked" : "skipped");
        // remove card / show next card here
      }, 300);
    } else {
      card.style.transition = "transform 0.2s ease";
      card.style.transform = "translateX(0) rotate(0)";
    }

    currentX = 0;
  });

  card.addEventListener("transitionend", () => {
    card.style.transition = "";
  });
}
