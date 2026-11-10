(() => {
  "use strict";

  document.documentElement.classList.add("js-ready");

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-navigation");
  const progressBar = document.getElementById("scroll-progress-bar");
  const toTopButton = document.getElementById("to-top");
  const toast = document.getElementById("toast");

  const CONTACT_EMAIL = "anshuu.2yt@gmail.com";

  // Mobile navigation
  function closeMenu() {
    nav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation" : "Close navigation",
    );
    nav?.classList.toggle("is-open", !isOpen);
  });

  nav
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!nav || !menuToggle || !nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target) && !menuToggle.contains(event.target))
      closeMenu();
  });

  // Scroll progress, header surface and back-to-top visibility
  let scrollTicking = false;
  function updateScrollUI() {
    const scrollTop = window.scrollY || root.scrollTop;
    const scrollable = root.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    header?.classList.toggle("is-scrolled", scrollTop > 12);
    toTopButton?.classList.toggle("is-visible", scrollTop > 650);
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollUI);
        scrollTicking = true;
      }
    },
    { passive: true },
  );
  updateScrollUI();

  toTopButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });

  // Reveal elements as they enter the viewport
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion()) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Highlight the current section in the navigation.
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-active", active);
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  // Project category filters
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const projectCards = [...document.querySelectorAll(".project-card")];
  const emptyFilter = document.getElementById("empty-filter");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      projectCards.forEach((card) => {
        const shouldShow =
          selectedFilter === "all" || card.dataset.category === selectedFilter;
        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });

      if (emptyFilter) emptyFilter.hidden = visibleCount > 0;
    });
  });

  // Case-study dialog: all copy is local, authored content (no API required).
  const projectDetails = {
    kavach: {
      category: "ANDROID APP CONCEPT / PERSONAL SAFETY",
      title: "Kavach",
      summary:
        "Kavach is a personal-safety application concept built around a fast SOS flow. The idea explores how a user could alert trusted contacts, share their location and organise emergency information in one place.",
      role: "Project ideation, feature planning and exploration of the Android application experience.",
      tools:
        "Android · Kotlin · Location-aware app concepts · User-flow planning",
      learning:
        "Designing for urgent situations, permission planning, clear user feedback and responsible handling of sensitive evidence.",
    },
    flood: {
      category: "HACKATHON CONCEPT / DISASTER MANAGEMENT",
      title: "Flash Flood Prediction System",
      summary:
        "A problem-led concept for flash-flood prediction in hilly regions using multi-source data. The goal is to explore how different data inputs could support earlier risk awareness and help people make better-informed decisions.",
      role: "Problem exploration, concept development and team-based hackathon preparation.",
      tools:
        "Disaster management · Multi-source data · Research · Predictive-system concept",
      learning:
        "Breaking down a complex public-safety problem, researching potential data sources and communicating technical feasibility.",
    },
    clash: {
      category: "STUDENT COMMUNITY / EVENT PROJECT",
      title: "Code Clash",
      summary:
        "A student coding competition concept designed to make programming practice engaging through a sequence of logic questions, coding challenges and debugging tasks.",
      role: "Competition planning, round structure, participant-facing content and event coordination.",
      tools: "Programming · Problem design · Event planning · Collaboration",
      learning:
        "Creating clear instructions, designing fair challenge progression and coordinating a student-facing technical event.",
    },
    portfolio: {
      category: "FRONTEND / PERSONAL WEBSITE",
      title: "Developer Portfolio",
      summary:
        "This responsive website brings together a short introduction, learning focus, project snapshots and contact links in one accessible, single-page experience.",
      role: "Design direction, semantic page structure, responsive styling and client-side interactions.",
      tools: "HTML5 · CSS3 · JavaScript · Flexbox · CSS Grid",
      learning:
        "Component-like CSS organisation, responsive behaviour, keyboard accessibility, theme preferences and interaction design.",
    },
  };

  const projectDialog = document.getElementById("project-dialog");
  const dialogClose = document.getElementById("dialog-close");
  const dialogFields = {
    category: document.getElementById("dialog-category"),
    title: document.getElementById("dialog-title"),
    summary: document.getElementById("dialog-summary"),
    role: document.getElementById("dialog-role"),
    tools: document.getElementById("dialog-tools"),
    learning: document.getElementById("dialog-learning"),
  };

  document.querySelectorAll(".project-open").forEach((button) => {
    button.addEventListener("click", () => {
      const details = projectDetails[button.dataset.project];
      if (!details || !projectDialog) return;
      Object.entries(dialogFields).forEach(([key, element]) => {
        if (element) element.textContent = details[key] || "";
      });
      if (typeof projectDialog.showModal === "function") {
        projectDialog.showModal();
      } else {
        // Older browser fallback: reveal the native dialog element.
        projectDialog.setAttribute("open", "");
      }
      dialogClose?.focus();
    });
  });

  function closeProjectDialog() {
    if (!projectDialog) return;
    if (typeof projectDialog.close === "function" && projectDialog.open) {
      projectDialog.close();
    } else {
      projectDialog.removeAttribute("open");
    }
  }
  dialogClose?.addEventListener("click", closeProjectDialog);
  projectDialog?.addEventListener("click", (event) => {
    if (event.target === projectDialog) closeProjectDialog();
  });

  // Copy email. The fallback supports browsers without Clipboard API access.
  const copyEmailButton = document.getElementById("copy-email");
  copyEmailButton?.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = CONTACT_EMAIL;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "absolute";
        temporaryInput.style.left = "-9999px";
        body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Copy command unavailable");
      }
      showToast("Email address copied.");
    } catch {
      showToast(`Copy manually: ${CONTACT_EMAIL}`);
    }
  });

  // Dynamic footer year
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(
      () => toast.classList.remove("is-visible"),
      2600,
    );
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }
})();
