document.addEventListener("DOMContentLoaded", () => {
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

  const selectEra = (era) => {
    document.querySelectorAll(".era-tab").forEach((tab) => {
      const active = tab.dataset.era === era;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-era-panel]").forEach((panel) => {
      const active = panel.dataset.eraPanel === era;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };
  document.querySelectorAll(".era-tab").forEach((tab) => tab.addEventListener("click", () => selectEra(tab.dataset.era)));

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
