(() => {
  'use strict';
  const variant = document.body.dataset.variant;
  const isPublic = document.body.dataset.site === 'public';
  const release = variant === 'c' ? window.MS_RELEASE : null;
  const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ru';
  const t = {...window.MS_CONTENT[lang]}, g = window.MS_GRAPHICS;
  const folioOptions = variant === 'c' ? window.MS_FOLIO.selection(isPublic ? '' : location.search) : null;
  if (variant === 'c') {
    t.eyebrow = t.eyebrow.replace(/^Независимая\s+/i, '').replace(/^Independent\s+/i, '');
    t.aboutText = t.aboutText.replace(/независимая\s+/i, '').replace(/an independent science/i, 'a science');
    t.noNumbering = true;
    if (release) Object.assign(t,release[lang]);
    window.MS_FOLIO.applyPalette(document.body, folioOptions.palette);
  }
  document.documentElement.lang = lang;
  document.title = isPublic ? `MAZUNIN / SCIENCE — ${t.eyebrow}` : `MAZUNIN / SCIENCE — ${variant.toUpperCase()} · ${t.variants[variant]}`;
  const ids = ['education', 'research', 'technology', 'updates', 'about'];
  const lines = s => s.replace(/\n/g, '<br>');
  const arrow = '<span aria-hidden="true">↗</span>';
  const button = (key, text) => release?.links[key] ? `<a class="text-link resource-link" href="${release.links[key]}">${text}${arrow}</a><p class="resource-address">${release.links[key]}</p>` : `<button class="text-link" type="button" data-project="${key}">${text}${arrow}</button>`;
  const brand = `<a class="brand" href="#top" aria-label="MAZUNIN / SCIENCE"><span>MAZUNIN<span class="brand-slash"> /</span></span><span>SCIENCE<span class="brand-dot">.</span></span></a>`;
  const resourceKeys = ['molbio','atlas'];
  const sheetProject = i => {
    const url = release?.links[resourceKeys[i]];
    return url ? `<a class="sheet-resource" href="${url}" aria-label="${t.orientationMore[i]}: ${t.orientationProjects[i]}">${t.orientationProjects[i]} ${arrow}</a><small>${url.replace('https://','')}</small>` : `<span>${t.orientationProjects[i]}</span><small>${t.orientationMore[i]}</small>`;
  };
  const sheetAction = (id,i) => {
    const url = release?.links[resourceKeys[i]];
    return url ? `<a href="${url}">${t.orientationMore[i]} ${arrow}</a>` : isPublic ? '' : `<a href="#${id}">${lang==='ru'?'Перейти в раздел':'Go to section'} ${arrow}</a>`;
  };
  const development = `<div class="development-placeholder section-body"><p class="project-status">${t.pending}</p><p>${t.developmentText || ''}</p></div>`;
  const nodeText = i => `<span class="direction-name">${t.orientationNames[i]}</span><span class="direction-description">${t.pathDescriptions[i]}</span><span class="direction-project">${t.orientationProjects[i]}<small>${t.orientationMore[i]}</small></span>`;
  function hero() {
    if (variant === 'a') return `<section class="hero cover-hero" aria-label="${t.eyebrow}">
      <div class="cover-running-head mono"><span>${t.eyebrow}</span><span>01 / 03</span></div>
      <h1 class="cover-masthead"><span class="cover-author">MAZUNIN <i>/</i></span> <span class="cover-science">SCIENCE</span></h1>
      <div class="cover-baseline"><span class="cover-mark" aria-hidden="true">+</span><span class="mono">${t.orientationNote}</span><span class="mono">2026</span></div>
      <div class="cover-opening"><p class="cover-intro">${t.intro}</p><nav class="cover-index" aria-label="${t.orientationLabel}">${ids.slice(0,3).map((id,i)=>`<a href="#${id}"><span class="cover-index-no">0${i+1}</span><span class="cover-index-name">${t.orientationNames[i]}</span><span class="cover-index-project">${t.orientationProjects[i]}<small>${t.orientationMore[i]}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</nav></div>
    </section>`;
    if (variant === 'b') return `<section class="hero network-hero" aria-label="${t.eyebrow}">
      <div class="network-heading"><p class="eyebrow">${t.eyebrow}</p><p>${t.intro}</p></div>
      <nav class="network-map" aria-label="${t.orientationLabel}">
        <svg class="network-wires" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor"><path d="M419 280H338V168H268 M740 280H790V179H907 M583 346V437H848"/><path class="future-wire" d="M130 189V422H202 M1020 220v72h95 M1070 471v43h45"/><circle cx="338" cy="280" r="4"/><circle cx="790" cy="280" r="4"/><circle cx="583" cy="437" r="4"/></g><g class="network-coordinate"><text x="350" y="262">01</text><text x="756" y="262">02</text><text x="600" y="418">03</text><text x="1120" y="298">+</text><text x="1120" y="520">+</text></g></svg>
        <h1 class="network-root"><span>MAZUNIN</span> <strong>/ SCIENCE</strong></h1>
        ${ids.slice(0,3).map((id,i)=>`<a class="network-node network-node-${i}" href="#${id}"><span class="network-node-id mono">0${i+1} / ${['EDU','RES','TECH'][i]}</span>${nodeText(i)}<span class="network-arrow" aria-hidden="true">↗</span></a>`).join('')}
        <div class="network-growth"><span>+5</span><p>${lang==='ru'?'Другие дисциплины':'Other disciplines'}<small>${lang==='ru'?'Состав каталога уточняется':'Catalogue to be confirmed'}</small></p></div>
      </nav><div class="network-legend mono"><span><i class="solid-key" aria-hidden="true"></i>${lang==='ru'?'Направления платформы':'Platform directions'}</span><span><i class="dashed-key" aria-hidden="true"></i>${lang==='ru'?'Пространство для расширения':'Room to grow'}</span></div>
    </section>`;
    return `<section class="hero folio-hero" aria-label="${t.eyebrow}">
      <div class="folio-heading"><h1 class="eyebrow">${t.eyebrow}</h1><p class="folio-intro">${t.platformSummary}</p></div>
      <div class="folio-instruction mono"><span>${lang==='ru'?'Нажмите на лист, чтобы развернуть':'Select a sheet to unfold'}</span></div>
      <div class="folio-deck" data-open="none">${ids.slice(0,3).map((id,i)=>`<article class="folio-sheet sheet-${i}"${isPublic?` id="sheet-${i}"`:''}><span class="sheet-spine mono" aria-hidden="true">MAZUNIN / ${['EDUCATION','RESEARCH','TECHNOLOGY'][i]}</span><button class="folio-toggle" type="button" data-sheet="${i}" aria-expanded="false" aria-controls="sheet-detail-${i}"><span class="sheet-illustration">${window.MS_FOLIO.drawing(i,folioOptions.art[i].id)}</span><span class="sheet-name">${t.orientationNames[i]}</span><span class="sheet-action" aria-hidden="true">+</span></button><div class="sheet-project">${sheetProject(i)}</div><div class="sheet-detail" id="sheet-detail-${i}" hidden><p>${t.pathDescriptions[i]}</p>${sheetAction(id,i)}</div><span class="sheet-edge" aria-hidden="true"></span></article>`).join('')}</div>
    </section>`;
  }
  const sectionHead = (id,kicker,title,text) => `<header class="section-heading"><p class="section-kicker mono">${variant==='c'?kicker.replace(/^\d+\s*\/\s*/, ''):kicker}</p><div><h2 id="${id}-heading">${lines(title)}</h2>${text?`<p class="section-intro">${text}</p>`:''}</div></header>`;
  const content = () => `
    <section class="content-section education" id="education" aria-labelledby="education-heading">
      ${sectionHead('education',t.eduKicker,t.eduTitle,t.eduIntro)}
      <div class="education-body section-body">
        <article class="discipline">
          <div class="discipline-copy"><p class="eyebrow">${variant==='c'?t.discipline.replace(/\s+01$/, ''):t.discipline}</p><h3 id="education-title">${lines(t.molbio)}</h3><p>${t.molbioDesc}</p>${button('molbio',t.courseAction)}</div>
          <div class="discipline-figure">${g.expression(t)}<span class="mono">${lang==='ru'?'Синтез белка · упрощённая схема':'Protein synthesis · simplified diagram'}</span></div>
          <div class="discipline-foot mono"><span>Molbio</span><span>${t.firstDiscipline}</span></div>
        </article>
        <div class="catalog-note"><span aria-hidden="true">+</span><div><strong>${t.moreDisciplines}</strong><p>${t.moreDisciplinesDesc}</p></div></div>
      </div>
    </section>
    <section class="content-section research" id="research" aria-labelledby="research-heading">
      ${sectionHead('research',t.researchKicker,t.researchTitle,t.researchIntro)}
      <article class="research-body section-body">
        <div class="research-art">${g.atlas(t)}<p class="mono">${t.conceptLabel} / ${lang==='ru'?'не данные Atlas':'not Atlas data'}</p></div>
        <div class="project-copy"><p class="eyebrow">${t.atlasLabel}</p><h3 id="research-title">${t.atlasTitle}</h3><p>${t.atlasDesc}</p><span class="project-status ${release?'is-available':''}"><i aria-hidden="true"></i>${release?t.available:t.pending}</span>${button('atlas',release?t.atlasAction:t.projectAction)}</div>
      </article>
    </section>
    <section class="content-section technology" id="technology" aria-labelledby="technology-heading">
      ${sectionHead('technology',t.techKicker,t.techTitle,t.techIntro)}
      <article class="technology-body section-body ${release?'is-development':''}"><div class="project-copy"><p class="eyebrow">${t.modicumLabel}</p><h3 id="technology-title">${t.modicumTitle}</h3><p>${t.modicumDesc}</p><span class="project-status"><i aria-hidden="true"></i>${t.pending}</span>${release?'':button('modicum',t.projectAction)}</div>
      ${release?'':`<div class="technology-art">${g.technology(t)}<p class="mono">${t.conceptLabel}</p></div>`}</article>
    </section>
    <section class="content-section updates" id="updates" aria-labelledby="updates-heading">
      ${sectionHead('updates',t.updatesKicker,t.updatesTitle,release?'':t.updatesIntro)}
      ${release?development:`<div class="update-list section-body">${t.updates.map(x=>`<details class="update-item"><summary><time class="mono" datetime="${x.date}">${x.displayDate}</time><span class="update-type">${x.type}</span><h3>${x.title}</h3><span class="update-plus" aria-hidden="true">+</span></summary><p>${x.text}</p></details>`).join('')}</div>`}
    </section>
    <section class="content-section about" id="about" aria-labelledby="about-heading">
      ${sectionHead('about',t.aboutKicker,t.aboutTitle,'')}
      ${release?development:`<div class="about-body section-body"><p>${t.aboutText}</p><div class="author-note"><strong>${t.aboutAuthor}</strong><span>${t.aboutContact}</span></div></div>`}
    </section>`;
  document.getElementById('app').innerHTML = `
    <a class="skip-link" href="#main">${t.skip}</a>
    ${isPublic?'':`<div class="prototype-strip"><div class="shell"><span><b>${variant.toUpperCase()}</b> ${t.variants[variant]}</span>${variant==='c'?`<a class="studio-link" href="studio.html${location.search}">${lang==='ru'?'Галерея образов':'Illustration gallery'} ↗</a>`:''}<a href="../comparison.html">${t.compare}<span aria-hidden="true"> ↗</span></a></div></div>`}
    <header class="site-header shell" id="top">${brand}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-navigation">${t.menu}<span aria-hidden="true">+</span></button>
      <nav class="main-nav" id="main-navigation" aria-label="${lang==='ru'?'Основная навигация':'Main navigation'}">${isPublic?t.nav.slice(0,3).map((x,i)=>`<a href="#sheet-${i}" data-sheet-nav="${i}">${x}</a>`).join(''):t.nav.map((x,i)=>`<a href="#${ids[i]}">${x}</a>`).join('')}</nav>
      <a class="language-link mono" href="?lang=${lang==='ru'?'en':'ru'}" lang="${lang==='ru'?'en':'ru'}" aria-label="${lang==='ru'?'English — preliminary translation':'Русская версия'}"><span class="lang-current">${lang.toUpperCase()}</span> / ${lang==='ru'?'EN':'RU'}</a>
    </header>
    <main class="shell" id="main">
      ${hero()}${isPublic?'':`<div class="content-flow">${content()}</div>`}
    </main>
    ${isPublic?'':`<footer class="site-footer shell"><div>${brand}<p>${t.footerNote}${t.preliminary?`<br>${t.preliminary}`:''}</p></div><nav class="variant-switch" aria-label="${t.switchVariant}"><span class="mono">${t.switchVariant}</span>${['a','b','c'].map(x=>`<a href="../prototype-${x}/index.html${lang==='en'?'?lang=en':''}" ${x===variant?'aria-current="page"':''}>${x.toUpperCase()}</a>`).join('')}</nav><a class="back-top" href="#top">${t.backTop} ↑</a></footer>`}
    ${isPublic?'':`<dialog class="project-dialog" aria-labelledby="dialog-title"><button class="dialog-close" type="button" aria-label="${t.close}">×</button><div class="dialog-content"><h2 id="dialog-title">${t.prototype}</h2></div></dialog>`}`;

  const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('.main-nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded','false'); nav.classList.remove('is-open'); };
  menu.addEventListener('click',()=>{ const expanded = menu.getAttribute('aria-expanded')==='true'; menu.setAttribute('aria-expanded',String(!expanded)); nav.classList.toggle('is-open',!expanded); });
  nav.addEventListener('click',e=>{
    const link = e.target.closest('a');
    if (!link) return;
    if (isPublic && link.dataset.sheetNav !== undefined) {
      e.preventDefault();
      const sheet = document.getElementById(`sheet-${link.dataset.sheetNav}`);
      const toggle = sheet?.querySelector('.folio-toggle');
      if (toggle && toggle.getAttribute('aria-expanded') !== 'true') toggle.click();
      closeMenu();
      sheet?.scrollIntoView({block:'start'});
      return;
    }
    closeMenu();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){ if(nav.classList.contains('is-open')){closeMenu();menu.focus();} }});

  const deck = document.querySelector('.folio-deck');
  if (deck) deck.querySelectorAll('.folio-toggle').forEach(toggle => toggle.addEventListener('click', () => {
    const next = toggle.getAttribute('aria-expanded') === 'true' ? 'none' : toggle.dataset.sheet;
    deck.dataset.open = next;
    deck.querySelectorAll('.folio-toggle').forEach(button => {
      const open = button.dataset.sheet === next;
      button.setAttribute('aria-expanded', String(open));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    });
  }));
  const dialog = document.querySelector('.project-dialog');
  document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>{
    const p=t.dialogs[el.dataset.project];
    dialog.querySelector('.dialog-content').innerHTML=`<p class="eyebrow">${p.label}</p><h2 id="dialog-title">${p.title}</h2><p>${p.text}</p><p>${p.detail}</p>${p.link?`<a class="text-link" href="${p.link}" target="_blank" rel="noopener noreferrer">${p.linkLabel}</a><small>${p.status}</small>`:''}<p class="dialog-status mono">${t.prototype} / ${t.preliminary}</p>`;
    dialog.showModal();
  }));
  dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
  // Show the current section without changing focus or intercepting anchor navigation.
  if(!isPublic && 'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.toggleAttribute('data-current',a.hash===`#${entry.target.id}`));}}),{rootMargin:'-12% 0px -65% 0px'});ids.forEach(id=>observer.observe(document.getElementById(id)));}
  // Hash targets exist after rendering, including when arriving through a deep link.
  if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)target.scrollIntoView();});}
  if (variant === 'c' && !isPublic) {
    // The local studio updates the three illustrations without reloading the iframe.
    window.addEventListener('message', event => {
      if (event.source !== window.parent || window.parent === window || event.origin !== location.origin) return;
      if (event.data?.type !== 'folio-preview' || typeof event.data.search !== 'string') return;
      const next = window.MS_FOLIO.selection(event.data.search);
      window.MS_FOLIO.applyPalette(document.body,next.palette);
      document.querySelectorAll('.sheet-illustration').forEach((element,i) => {
        element.innerHTML = window.MS_FOLIO.drawing(i,next.art[i].id);
      });
      const nextParams = new URLSearchParams({palette:next.palette.id});
      ['edu','research','tech'].forEach((key,i)=>nextParams.set(key,next.art[i].id));
      const studioLink = document.querySelector('.studio-link');
      if (studioLink) studioLink.href = `studio.html?${nextParams}`;
      document.querySelector('.variant-switch a[aria-current]').href = `index.html?${nextParams}`;
      nextParams.set('lang',lang==='ru'?'en':'ru');
      document.querySelector('.language-link').href = `?${nextParams}`;
    });
    const languageLink = document.querySelector('.language-link');
    const params = new URLSearchParams(location.search);
    params.set('lang',lang==='ru'?'en':'ru');
    languageLink.href = `?${params}`;
    document.querySelector('.variant-switch a[aria-current]').href = `index.html${location.search}`;
  }
})();
