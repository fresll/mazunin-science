/* Original explanatory SVG. Biological content is scoped to the Molbio course. */
window.MS_GRAPHICS = (() => {
  function expression(t) {
    let dna = '';
    for(let i=0;i<13;i++) { const x=26+i*8, k=Math.sin(i*.65)*17; dna += `<path d="M${x} ${48+k}V${48-k}"/>`; }
    return `<svg class="expression-diagram" viewBox="0 0 600 170" role="img" aria-label="DNA → RNA → ${t.protein}: ${t.transcription}, ${t.translation}">
      <g class="dna-strokes">${dna}<path d="M26 48C44 15 62 15 80 48S116 81 122 48 M26 48C44 81 62 81 80 48S116 15 122 48"/></g>
      <path class="figure-wire" d="M150 48H230m-6-5 6 5-6 5 M355 48H435m-6-5 6 5-6 5"/>
      <path class="rna-stroke" d="M253 48q9-26 18 0t18 0t18 0t18 0"/>
      <path class="protein-stroke" d="M462 58C435 4 548 18 511 65S449 27 489 24S553 78 518 80S483 34 557 44"/>
      <g class="expression-labels"><text x="75" y="116" text-anchor="middle">DNA</text><text x="289" y="116" text-anchor="middle">RNA</text><text x="510" y="116" text-anchor="middle">${t.protein}</text></g>
      <g class="expression-process"><text x="191" y="151" text-anchor="middle">${t.transcription}</text><text x="397" y="151" text-anchor="middle">${t.translation}</text></g>
    </svg>`;
  }
  function atlas(t) {
    return `<svg class="atlas-diagram" viewBox="0 0 600 300" role="img" aria-label="${t.conceptLabel}: ${t.resourceSteps.join(' → ')}"><title>${t.resourceSteps.join(' → ')}</title>
      <g fill="none" stroke="currentColor" stroke-width="1">
        <path d="M41 72h110v132H41Z M49 64h110v132 M57 56h110v132"/>
        <path d="M60 98h70 M60 115h70 M60 132h48 M60 174h40" opacity=".5"/>
        <path d="M246 56h124v148H246Z M246 93h124 M246 130h124 M246 167h124 M275 56v148"/>
        <path d="M289 75h62 M289 112h45 M289 149h62 M289 186h38" opacity=".5"/>
        <path d="M167 130h79m-7-5 7 5-7 5 M370 130h67m-7-5 7 5-7 5 M467 130h36V80h37 M503 130v50h37"/>
        <circle cx="452" cy="130" r="15"/><circle cx="550" cy="80" r="10"/><circle cx="550" cy="180" r="10"/>
      </g>
      <g class="atlas-svg-label"><text x="104" y="240" text-anchor="middle">${t.noNumbering?'':'01 / '}${t.resourceSteps[0]}</text><text x="308" y="240" text-anchor="middle">${t.noNumbering?'':'02 / '}${t.resourceSteps[1]}</text><text x="500" y="240" text-anchor="middle">${t.noNumbering?'':'03 / '}${t.resourceSteps[2]}</text></g>
    </svg>`;
  }
  function technology(t) {
    return `<div class="concept-diagram" role="img" aria-label="${t.conceptLabel}: ${t.conceptSteps.join(' → ')}">${t.conceptSteps.map((x,i)=>`<div class="concept-node"><span class="concept-shape shape-${i}" aria-hidden="true"></span>${t.noNumbering?'':`<span class="mono">0${i+1}</span>`}<strong>${x}</strong></div>${i<2?'<span class="concept-arrow" aria-hidden="true">→</span>':''}`).join('')}</div>`;
  }
  return { expression, atlas, technology };
})();
