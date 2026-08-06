document.addEventListener("DOMContentLoaded", () => {
  const introLoader = document.getElementById("intro-loader");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finishIntro = () => {
    document.body.classList.remove("is-loading");
    introLoader?.classList.add("is-exiting");
  };
  if (introLoader) {
    const introStep = 1350;
    ["medieval", "contemporanea", "futura", "imperia"].forEach((era, index) => {
      window.setTimeout(() => introLoader.setAttribute("data-intro-era", era), prefersReducedMotion ? 0 : index * introStep);
    });
    window.setTimeout(finishIntro, prefersReducedMotion ? 120 : 6200);
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const navbar = document.getElementById("navbar");
  const setNavbarState = () => navbar?.classList.toggle("is-scrolled", window.scrollY > 28);
  setNavbarState();
  window.addEventListener("scroll", setNavbarState, { passive: true });

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-menu");
  const closeMenu = () => {
    menuButton?.classList.remove("is-open");
    menu?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };
  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.classList.toggle("is-open", !isOpen);
    menu?.classList.toggle("is-open", !isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
  });
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px" });
  revealItems.forEach((item) => revealObserver.observe(item));

  const decisionCard = document.querySelector(".decision-card");
  const metricObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-ready");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  if (decisionCard) metricObserver.observe(decisionCard);

  const eraTabs = [...document.querySelectorAll(".era-tab")];
  const eraPanels = [...document.querySelectorAll("[data-era-panel]")];
  const timeline = document.querySelector(".memory-flow");
  const eraThemes = {
    medieval: {
      bg: "#FDFBF7", secondary: "#F6EFE5", fg: "#1F1A16", muted: "#756052", border: "#8C6D58", accent: "#D97706",
      radius: "7px", surface: "rgba(253,251,247,.92)", wash: "rgba(253,251,247,.66)", image: 'url("assets/eras/era-medieval-editorial.png")'
    },
    contemporanea: {
      bg: "#FFFFFF", secondary: "#F8FAFC", fg: "#0F172A", muted: "#64748B", border: "#E2E8F0", accent: "#0284C7",
      radius: "10px", surface: "rgba(255,255,255,.92)", wash: "rgba(255,255,255,.70)", image: 'url("assets/eras/era-contemporanea.png")'
    },
    futuro: {
      bg: "#F1F5F9", secondary: "#EAF0F8", fg: "#1E293B", muted: "#64748B", border: "rgba(30,41,59,.15)", accent: "#6366F1",
      radius: "16px", surface: "rgba(255,255,255,.76)", wash: "rgba(241,245,249,.60)", image: 'url("assets/eras/era-futuro.png")'
    }
  };
  let activeEra = eraTabs.find((tab) => tab.classList.contains("is-active"))?.dataset.era || eraTabs[0]?.dataset.era;
  let eraLeavingTimer;

  const applyEraTheme = (era) => {
    const theme = eraThemes[era];
    if (!theme) return;
    const root = document.documentElement;
    root.dataset.eraTheme = era;
    root.style.setProperty("--era-bg", theme.bg);
    root.style.setProperty("--era-bg-secondary", theme.secondary);
    root.style.setProperty("--era-fg", theme.fg);
    root.style.setProperty("--era-muted", theme.muted);
    root.style.setProperty("--era-border", theme.border);
    root.style.setProperty("--era-accent", theme.accent);
    root.style.setProperty("--era-card-radius", theme.radius);
    root.style.setProperty("--era-card-surface", theme.surface);
    root.style.setProperty("--era-wash", theme.wash);
    root.style.setProperty("--era-image", theme.image);
  };

  const selectEra = (era) => {
    if (!era || era === activeEra) return;
    const currentPanel = eraPanels.find((panel) => panel.dataset.eraPanel === activeEra);
    const nextPanel = eraPanels.find((panel) => panel.dataset.eraPanel === era);
    if (!nextPanel) return;

    applyEraTheme(era);
    window.clearTimeout(eraLeavingTimer);
    eraPanels.filter((panel) => panel !== currentPanel && panel !== nextPanel).forEach((panel) => {
      panel.classList.remove("is-leaving", "is-active");
      panel.hidden = true;
    });
    eraTabs.forEach((tab) => {
      const active = tab.dataset.era === era;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    if (currentPanel) {
      currentPanel.classList.remove("is-active");
      currentPanel.classList.add("is-leaving");
    }
    nextPanel.hidden = false;
    nextPanel.classList.remove("is-leaving", "is-active");
    void nextPanel.offsetWidth;
    nextPanel.classList.add("is-active");
    activeEra = era;
    eraLeavingTimer = window.setTimeout(() => {
      eraPanels.forEach((panel) => {
        if (panel.dataset.eraPanel === activeEra) return;
        panel.classList.remove("is-leaving", "is-active");
        panel.hidden = true;
      });
    }, 780);
  };

  eraTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectEra(tab.dataset.era));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? eraTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + eraTabs.length) % eraTabs.length;
      eraTabs[nextIndex].focus();
      selectEra(eraTabs[nextIndex].dataset.era);
    });
  });
  applyEraTheme(activeEra);

  let timelineFrame;
  const updateTimelineProgress = () => {
    timelineFrame = undefined;
    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * .78 - rect.top) / Math.max(rect.height + window.innerHeight * .15, 1)));
      timeline.style.setProperty("--timeline-progress", progress.toFixed(3));
    }
  };
  const requestTimelineUpdate = () => {
    if (!timelineFrame) timelineFrame = window.requestAnimationFrame(updateTimelineProgress);
  };
  window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
  window.addEventListener("resize", requestTimelineUpdate);
  requestTimelineUpdate();

  const experienceStates = {
    contexto: {
      title: "O contexto muda a decisão.",
      copy: "Recursos, conflitos e memória definem o ponto de partida."
    },
    decisao: {
      title: "Escolher é assumir um efeito.",
      copy: "A proposta reorganiza indicadores e abre novas possibilidades."
    },
    memoria: {
      title: "O país registra o que aconteceu.",
      copy: "Consequências permanecem nas próximas leis, crises e narrativas."
    }
  };
  const experienceMap = document.querySelector("[data-experience-map]");
  const experienceNodes = [...document.querySelectorAll("[data-experience-step]")];
  const experienceSteps = experienceNodes.map((node) => node.dataset.experienceStep).filter(Boolean);
  const experienceTitle = document.getElementById("experience-state-title");
  const experienceCopy = document.getElementById("experience-state-copy");
  let experienceIndex = Math.max(0, experienceSteps.indexOf(experienceNodes.find((node) => node.classList.contains("is-active"))?.dataset.experienceStep));
  let experienceTimer;
  let experienceResumeTimer;
  const selectExperienceStep = (step) => {
    const state = experienceStates[step];
    if (!state) return;
    experienceIndex = Math.max(0, experienceSteps.indexOf(step));
    experienceMap?.querySelector(".signal-map")?.setAttribute("data-signal-state", step);
    experienceNodes.forEach((node) => {
      const active = node.dataset.experienceStep === step;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
    });
    if (experienceTitle) experienceTitle.textContent = state.title;
    if (experienceCopy) experienceCopy.textContent = state.copy;
  };
  const stopExperienceAutoplay = () => window.clearInterval(experienceTimer);
  const startExperienceAutoplay = () => {
    if (prefersReducedMotion || experienceSteps.length < 2) return;
    stopExperienceAutoplay();
    experienceTimer = window.setInterval(() => {
      const next = (experienceIndex + 1) % experienceSteps.length;
      selectExperienceStep(experienceSteps[next]);
    }, 3400);
  };
  const pauseExperienceAutoplay = (resumeIn = 5200) => {
    stopExperienceAutoplay();
    experienceMap?.classList.add("is-paused");
    window.clearTimeout(experienceResumeTimer);
    if (prefersReducedMotion) return;
    experienceResumeTimer = window.setTimeout(() => {
      experienceMap?.classList.remove("is-paused");
      startExperienceAutoplay();
    }, resumeIn);
  };
  const holdExperienceAutoplay = () => {
    stopExperienceAutoplay();
    experienceMap?.classList.add("is-paused");
    window.clearTimeout(experienceResumeTimer);
  };
  experienceNodes.forEach((node) => node.addEventListener("click", () => {
    selectExperienceStep(node.dataset.experienceStep);
    pauseExperienceAutoplay();
  }));
  if (experienceMap && experienceSteps.length > 1 && !prefersReducedMotion) {
    startExperienceAutoplay();
    experienceMap.addEventListener("pointerenter", holdExperienceAutoplay);
    experienceMap.addEventListener("pointerleave", () => {
      window.clearTimeout(experienceResumeTimer);
      experienceMap.classList.remove("is-paused");
      startExperienceAutoplay();
    });
    experienceMap.addEventListener("focusin", holdExperienceAutoplay);
    experienceMap.addEventListener("focusout", (event) => {
      if (experienceMap.contains(event.relatedTarget)) return;
      window.clearTimeout(experienceResumeTimer);
      experienceMap.classList.remove("is-paused");
      startExperienceAutoplay();
    });
  }

  const scenarios = [
    {
      number: "042", era: "ERA MEDIEVAL", status: "Simulando repercussões...", title: "Reforma Tributária Nacional",
      description: "Aumentar a arrecadação dos portos para financiar a reconstrução após uma enchente histórica.",
      approval: "64%", approvalBar: "64%", economy: "+7", economyBar: "72%", stability: "−3", stabilityBar: "31%", accent: "#9a681e", badgeBg: "#fff7ed"
    },
    {
      number: "186", era: "ERA CONTEMPORÂNEA", status: "Consultando histórico...", title: "Programa de Habitação Popular",
      description: "Destinar parte do superávit urbano para conter o aumento do custo de moradia nas capitais.",
      approval: "71%", approvalBar: "71%", economy: "−2", economyBar: "44%", stability: "+5", stabilityBar: "68%", accent: "#3686ff", badgeBg: "#eff6ff"
    },
    {
      number: "391", era: "ERA FUTURA", status: "Conectando memórias...", title: "Protocolo de Memória Cívica",
      description: "Permitir que cidadãos consultem o histórico de decisões automatizadas do Estado.",
      approval: "58%", approvalBar: "58%", economy: "+3", economyBar: "59%", stability: "−6", stabilityBar: "26%", accent: "#6557e8", badgeBg: "#f3f1ff"
    }
  ];
  const fields = {
    number: document.getElementById("simulation-number"), era: document.getElementById("simulation-era"), status: document.getElementById("simulation-status"),
    title: document.getElementById("simulation-title"), description: document.getElementById("simulation-description"), approval: document.getElementById("metric-approval"),
    economy: document.getElementById("metric-economy"), stability: document.getElementById("metric-stability"), approvalBar: document.getElementById("metric-approval-bar"),
    economyBar: document.getElementById("metric-economy-bar"), stabilityBar: document.getElementById("metric-stability-bar")
  };
  let scenarioIndex = 0;
  const updateScenario = () => {
    if (!decisionCard) return;
    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    const scenario = scenarios[scenarioIndex];
    decisionCard.classList.remove("is-ready");
    decisionCard.classList.add("is-changing");
    window.setTimeout(() => {
      fields.number.textContent = scenario.number;
      fields.era.innerHTML = `<i></i> ${scenario.era}`;
      fields.era.style.color = scenario.accent;
      fields.era.style.background = scenario.badgeBg;
      fields.status.textContent = scenario.status;
      fields.title.textContent = scenario.title;
      fields.description.textContent = scenario.description;
      fields.approval.textContent = scenario.approval;
      fields.economy.textContent = scenario.economy;
      fields.stability.textContent = scenario.stability;
      fields.approvalBar.style.setProperty("--value", scenario.approvalBar);
      fields.economyBar.style.setProperty("--value", scenario.economyBar);
      fields.stabilityBar.style.setProperty("--value", scenario.stabilityBar);
      decisionCard.classList.remove("is-changing");
      window.setTimeout(() => decisionCard.classList.add("is-ready"), 70);
    }, 280);
  };
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) window.setInterval(updateScenario, 5200);

  document.getElementById("consequence-button")?.addEventListener("click", () => {
    document.querySelector(".floating-outcome strong").textContent = "O país registrou a decisão.";
    document.querySelector(".floating-outcome span").textContent = "MEMÓRIA ATUALIZADA";
  });
});
