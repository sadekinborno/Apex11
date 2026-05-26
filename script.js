(() => {
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const heroLayer = document.querySelector(".hero-layer");
  const topNav = document.querySelector(".top-nav");

  if (!heroLayer) return;

  let ticking = false;
  let lastY = window.scrollY || 0;
  let downAccum = 0;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const update = () => {
    ticking = false;

    const y = window.scrollY || 0;
    const dy = y - lastY;
    lastY = y;

    if (dy > 0) downAccum += dy;
    else downAccum = 0;

    // Navbar: stays visible for small scroll, hides on sustained scroll down,
    // reappears immediately on scroll up.
    if (topNav) {
      const hideAfter = 240;
      const nearTop = 40;
      const dirThreshold = 6;
      const hideDistance = 90;

      if (y <= nearTop) {
        topNav.classList.remove("is-hidden");
        downAccum = 0;
      } else if (dy > dirThreshold && y > hideAfter && downAccum > hideDistance) {
        topNav.classList.add("is-hidden");
      } else if (dy < 0) {
        topNav.classList.remove("is-hidden");
        downAccum = 0;
      }
    }

    if (prefersReduced) {
      heroLayer.style.setProperty("--s", "0");
      return;
    }

    // Drive subtle hero motion only for the first part of scrolling.
    const max = 260;
    const s = clamp01(y / max);
    heroLayer.style.setProperty("--s", String(s));
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Initial state
  update();

  // Minimal scroll-reveal for below-hero sections
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (!prefersReduced && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    for (const el of revealEls) io.observe(el);
  } else {
    for (const el of revealEls) el.classList.add("is-in");
  }
})();
