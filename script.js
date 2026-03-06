window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const yearTarget = document.getElementById('year');
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear().toString();
  }

  const navbar = document.getElementById('navbar');
  const toggleNavbar = () => {
    if (!navbar) {
      return;
    }

    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  toggleNavbar();
  window.addEventListener('scroll', toggleNavbar, { passive: true });

  const revealElements = document.querySelectorAll('.fade-up');
  revealElements.forEach((element) => {
    const delay = element.dataset.delay;
    if (delay) {
      element.style.transitionDelay = `${delay}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -5% 0px'
    }
  );

  revealElements.forEach((element) => observer.observe(element));
});
