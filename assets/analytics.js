(() => {
  'use strict';
  const site = window.MS_ANALYTICS_CONFIG?.goatcounterSite?.replace(/\/$/, '') || '';
  const events = ['sheet-education', 'sheet-research', 'sheet-technology'];
  const marker = 'ms-language-navigation';
  let suppressPageview = false;
  try {
    const navigation = JSON.parse(sessionStorage.getItem(marker) || 'null');
    sessionStorage.removeItem(marker);
    suppressPageview = !!navigation && navigation.url === location.href && Date.now() - navigation.time < 10000;
  } catch (_) { /* Storage can be unavailable. */ }

  const pending = [];
  let ready = false;
  let failed = false;
  const send = data => {
    if (!site || failed) return;
    if (!ready) pending.push(data);
    else window.goatcounter.count(data);
  };
  window.MS_ANALYTICS = {
    event(path) { send({ path, event: true, no_session: true }); },
    languageSwitch(url) {
      try { sessionStorage.setItem(marker, JSON.stringify({url, time: Date.now()})); } catch (_) { /* Ignore blocked storage. */ }
    },
    showCounts() {
      if (!site) return;
      events.forEach((path, i) => {
        fetch(`${site}/counter/${encodeURIComponent(path)}.json`)
          .then(response => { if (!response.ok) throw new Error('Counter unavailable'); return response.json(); })
          .then(data => {
            if (typeof data.count !== 'string' && typeof data.count !== 'number') return;
            const el = document.querySelector(`[data-sheet-count="${i}"]`);
            if (el) { el.querySelector('[data-count-value]').textContent = String(data.count); el.hidden = false; }
          }).catch(() => {});
      });
    }
  };
  if (!site || document.body.dataset.site !== 'public') return;
  window.goatcounter = { no_onload: true, endpoint: `${site}/count` };
  if (!suppressPageview) send({ path: '/' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.onload = () => {
    if (typeof window.goatcounter?.count !== 'function') { failed = true; pending.length = 0; return; }
    ready = true;
    pending.splice(0).forEach(data => window.goatcounter.count(data));
  };
  script.onerror = () => { failed = true; pending.length = 0; };
  document.head.appendChild(script);
})();
