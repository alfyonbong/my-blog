const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const button = document.getElementById('theme-toggle');
  if (button) {
    button.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
  }
}

export function initTheme() {
  applyTheme(root.getAttribute('data-theme') || 'light');

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });
}
