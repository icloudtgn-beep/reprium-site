const loadItems = document.querySelectorAll(".reveal-on-load");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const tiltItems = document.querySelectorAll("[data-tilt]");

window.addEventListener("load", () => {
  loadItems.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("visible");
    }, 90 + index * 90);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const applyParallax = () => {
  const scrollY = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax) || 0.04;
    item.style.setProperty("--parallax-y", `${scrollY * speed}px`);
  });
};

let frameRequested = false;

window.addEventListener("scroll", () => {
  if (frameRequested) {
    return;
  }

  frameRequested = true;

  window.requestAnimationFrame(() => {
    applyParallax();
    frameRequested = false;
  });
});

applyParallax();

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    item.style.setProperty("--tilt-x", `${rotateX}deg`);
    item.style.setProperty("--tilt-y", `${rotateY}deg`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.removeProperty("--tilt-x");
    item.style.removeProperty("--tilt-y");
  });
});
