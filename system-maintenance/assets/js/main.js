// フェードイン (IntersectionObserver)
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeElements.forEach(el => observer.observe(el));

  // ヘッダー スクロール検知
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 8) header.classList.add('header--scrolled');
      else header.classList.remove('header--scrolled');
    }, { passive: true });
  }
});
