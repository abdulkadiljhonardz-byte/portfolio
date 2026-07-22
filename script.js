const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const reveals = document.querySelectorAll(".reveal");
const projectsSection = document.getElementById("projects");
const lockedProjects = document.querySelectorAll(".project-card-locked");
const projectNotice = document.getElementById("project-notice");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

reveals.forEach((section) => {
  revealObserver.observe(section);
});

if (projectNotice) {
  if (projectsSection) {
    const showProjectNotice = () => {
      projectNotice.setAttribute("aria-hidden", "false");
      projectNotice.classList.add("is-visible");
    };

    projectsSection.addEventListener("click", showProjectNotice);
    projectsSection.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showProjectNotice();
      }
    });
  }

  lockedProjects.forEach((project) => {
    project.addEventListener("click", () => {
      projectNotice.setAttribute("aria-hidden", "false");
      projectNotice.classList.add("is-visible");
    });
  });
}
