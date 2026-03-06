const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const counterElements = document.querySelectorAll('[data-counter]');

const animateCounter = (element) => {
  const target = Number(element.dataset.counter);
  const duration = 1200;
  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = value.toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target.toString();
    }
  };

  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.7 }
);

counterElements.forEach((element) => counterObserver.observe(element));

const panel = document.querySelector('[data-panel]');
const eraTitle = document.querySelector('[data-era-title]');
const policyEra = document.querySelector('[data-policy-era]');
const lawTitle = document.querySelector('[data-law-title]');
const lawCopy = document.querySelector('[data-law-copy]');
const viceCopy = document.querySelector('[data-vice-copy]');
const approvalValue = document.querySelector('[data-approval-value]');
const fiscalValue = document.querySelector('[data-fiscal-value]');
const stabilityValue = document.querySelector('[data-stability-value]');
const approvalBar = document.querySelector('[data-approval-bar]');
const fiscalBar = document.querySelector('[data-fiscal-bar]');
const stabilityBar = document.querySelector('[data-stability-bar]');
const policyCard = document.querySelector('[data-policy-card]');

const panelStates = [
  {
    eraTitle: 'Reino Fraturado',
    policyEra: 'Era Medieval',
    lawTitle: 'Tributo sobre as caravanas do rio central',
    lawCopy:
      'Uma nova proposta chega à sua mesa prometendo fortalecer os cofres do reino sem desagradar comerciantes influentes.',
    viceCopy:
      '"Essa lei pode reforçar sua imagem, mas também atrair disputa entre nobres."',
    approval: 78,
    fiscal: 64,
    stability: 71
  },
  {
    eraTitle: 'Prefeitura em Pressão',
    policyEra: 'Tempos Atuais',
    lawTitle: 'Pacote de incentivos para evitar a saída da principal indústria local',
    lawCopy:
      'A medida pode salvar empregos no curto prazo, mas pressiona um orçamento que já opera perto do limite.',
    viceCopy:
      '"Se aprovar agora, você ganha tempo com a população, mas a oposição vai cobrar o custo."',
    approval: 69,
    fiscal: 52,
    stability: 74
  },
  {
    eraTitle: 'Cidade Neon Instável',
    policyEra: 'Futuro Cyberpunk',
    lawTitle: 'Liberação parcial de dados urbanos para acelerar pesquisa tecnológica',
    lawCopy:
      'O avanço científico pode destravar um salto de desenvolvimento, mas aumenta o risco de vigilância e abuso corporativo.',
    viceCopy:
      '"Isso pode acelerar nossa tecnologia, mas também deixar aliados demais com acesso ao que não deviam."',
    approval: 73,
    fiscal: 81,
    stability: 58
  }
];

let currentState = 0;

const updatePanel = (state) => {
  if (!panel) {
    return;
  }

  policyCard.classList.add('is-updating');

  eraTitle.textContent = state.eraTitle;
  policyEra.textContent = state.policyEra;
  lawTitle.textContent = state.lawTitle;
  lawCopy.textContent = state.lawCopy;
  viceCopy.textContent = state.viceCopy;

  approvalValue.textContent = `${state.approval}%`;
  fiscalValue.textContent = `${state.fiscal}%`;
  stabilityValue.textContent = `${state.stability}%`;

  approvalBar.style.width = `${state.approval}%`;
  fiscalBar.style.width = `${state.fiscal}%`;
  stabilityBar.style.width = `${state.stability}%`;

  window.setTimeout(() => {
    policyCard.classList.remove('is-updating');
  }, 360);
};

if (panel) {
  updatePanel(panelStates[currentState]);

  window.setInterval(() => {
    currentState = (currentState + 1) % panelStates.length;
    updatePanel(panelStates[currentState]);
  }, 4600);
}

const hero = document.querySelector('.hero');

if (hero && panel) {
  hero.addEventListener('mousemove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;

    panel.style.setProperty('--pointer-x', offsetX.toFixed(2));
    panel.style.setProperty('--pointer-y', offsetY.toFixed(2));
  });

  hero.addEventListener('mouseleave', () => {
    panel.style.setProperty('--pointer-x', '0');
    panel.style.setProperty('--pointer-y', '0');
  });
}

const yearTarget = document.getElementById('year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear().toString();
}
