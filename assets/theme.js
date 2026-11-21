(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const key = 'mazunin-color-theme';
  let preference = 'auto';

  try {
    const saved = window.localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // System appearance is available even when browser storage is blocked.
  }

  function applyTheme() {
    const dark = preference === 'auto' ? systemTheme.matches : preference === 'dark';
    root.dataset.colorTheme = dark ? 'dark' : 'light';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = getComputedStyle(root).getPropertyValue('--theme-background').trim();
    }
  }

  applyTheme();

  if (systemTheme.addEventListener) systemTheme.addEventListener('change', applyTheme);
  else systemTheme.addListener(applyTheme);

  document.addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('[data-theme-control]');
    if (!control) return;

    control.value = preference;
    control.addEventListener('change', () => {
      preference = control.value;
      try {
        if (preference === 'auto') window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, preference);
      } catch {
        // Keep the selected appearance for the current page.
      }
      applyTheme();
    });
    control.hidden = false;
  });
})();
