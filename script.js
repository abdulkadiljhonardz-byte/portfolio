const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const year = document.getElementById("year");
const progressBar = document.querySelector(".scroll-progress span");
const cursorGlow = document.querySelector(".cursor-glow");
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector(".hero-visual");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const linkedSections = [...navLinks]
  .map((link) => {
    const target = link.getAttribute("href");
    return target?.startsWith("#") ? { link, section: document.querySelector(target) } : null;
  })
  .filter((item) => item?.section);

if (year) year.textContent = new Date().getFullYear();

const updateViewport = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar?.style.setProperty("transform", `scaleX(${Math.min(Math.max(progress, 0), 1)})`);

  const marker = window.scrollY + window.innerHeight * 0.34;
  let activeLink = null;
  linkedSections.forEach((item) => {
    if (item.section.offsetTop <= marker) activeLink = item.link;
  });
  navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
};

updateViewport();
window.addEventListener("scroll", updateViewport, { passive: true });
window.addEventListener("resize", updateViewport, { passive: true });

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
    document.body.style.overflow = isOpen ? "" : "hidden";
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (!reducedMotion.matches) {
  document.documentElement.classList.add("motion-enabled");
  const motionItems = document.querySelectorAll(
    ".work-card, .capability-list article, .approach-grid article"
  );

  motionItems.forEach((item, index) => {
    item.classList.add("motion-item");
    item.style.setProperty("--delay", `${(index % 4) * 75}ms`);
  });

  if ("IntersectionObserver" in window) {
    const itemObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -25px" }
    );
    motionItems.forEach((item) => itemObserver.observe(item));
  } else {
    motionItems.forEach((item) => item.classList.add("is-in-view"));
  }
}

if (finePointer.matches && !reducedMotion.matches && cursorGlow) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.classList.add("is-visible");
    },
    { passive: true }
  );

  document.documentElement.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("is-visible");
  });

  if (hero && heroVisual) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroVisual.style.setProperty("--hero-x", `${(x * 10).toFixed(2)}px`);
      heroVisual.style.setProperty("--hero-y", `${(y * 8).toFixed(2)}px`);
    });

    hero.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--hero-x", "0px");
      heroVisual.style.setProperty("--hero-y", "0px");
    });
  }

  document.querySelectorAll(".button, .nav-cta").forEach((control) => {
    control.addEventListener("pointermove", (event) => {
      const bounds = control.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      control.style.setProperty("--mag-x", `${(x * 0.14).toFixed(2)}px`);
      control.style.setProperty("--mag-y", `${(y * 0.18).toFixed(2)}px`);
    });

    control.addEventListener("pointerleave", () => {
      control.style.setProperty("--mag-x", "0px");
      control.style.setProperty("--mag-y", "0px");
    });
  });

  document.querySelectorAll(".work-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const rotateY = ((x / bounds.width) - 0.5) * 2.4;
      const rotateX = ((y / bounds.height) - 0.5) * -2.4;
      const preview = card.querySelector(".project-browser, .quta-phone");

      card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--spot-x", `${x}px`);
      card.style.setProperty("--spot-y", `${y}px`);
      preview?.style.setProperty("--preview-x", `${(((x / bounds.width) - 0.5) * 6).toFixed(2)}px`);
      preview?.style.setProperty("--preview-y", `${(((y / bounds.height) - 0.5) * 6).toFixed(2)}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      const preview = card.querySelector(".project-browser, .quta-phone");
      preview?.style.setProperty("--preview-x", "0px");
      preview?.style.setProperty("--preview-y", "0px");
    });
  });
}
