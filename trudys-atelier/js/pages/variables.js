/* Variables Set: pick a base, layer, accent and tone; preview the look and add it as a set. */

const selection = { base: VARIABLE_STEPS[0].options[0], layer: null, accent: null, tone: TONES[0].id };
const setPieces = () => VARIABLE_STEPS.map((s) => selection[s.id]).filter(Boolean).map(getProduct);

function optionCard(stepId, id) {
  const pressed = selection[stepId] === id;
  if (!id) {
    return `
      <button type="button" class="option-card" data-step="${stepId}" data-option="" aria-pressed="${pressed}">
        <span class="thumb">None</span>
        <span class="opt-name">Leave it out</span>
        <span class="opt-price">—</span>
      </button>`;
  }
  const p = getProduct(id);
  return `
    <button type="button" class="option-card" data-step="${stepId}" data-option="${id}" aria-pressed="${pressed}">
      <span class="thumb"><img src="${img(p.image, 300, 400)}" alt="" loading="lazy"></span>
      <span class="opt-name">${p.name}</span>
      <span class="opt-price" data-price="${p.price}">${formatPrice(p.price)}</span>
    </button>`;
}

document.getElementById('steps').innerHTML =
  VARIABLE_STEPS.map(
    (step, i) => `
    <div class="step">
      <div class="step-head"><span class="num">0${i + 1}</span><h3>${step.label}</h3><p>${step.hint}</p></div>
      <div class="option-cards">${step.options.map((id) => optionCard(step.id, id)).join('')}</div>
    </div>`
  ).join('') +
  `
    <div class="step">
      <div class="step-head"><span class="num">0${VARIABLE_STEPS.length + 1}</span><h3>Tone</h3><p>Every piece is made to order in your chosen tone.</p></div>
      <div class="swatches">
        ${TONES.map(
          (t) => `<button type="button" class="swatch" data-tone="${t.id}" aria-pressed="${t.id === selection.tone}"><span style="background:${t.hex}"></span><span>${t.label}</span></button>`
        ).join('')}
      </div>
    </div>`;

function renderPreview() {
  const slots = ['base', 'layer', 'accent'].map((stepId) => {
    const id = selection[stepId];
    const label = VARIABLE_STEPS.find((s) => s.id === stepId).label;
    if (!id) return `<div class="preview-slot">${label}</div>`;
    const p = getProduct(id);
    return `<div class="preview-slot"><img src="${img(p.image, 600, 800)}" alt="${p.name}"><span class="slot-name">${p.name}</span></div>`;
  });
  document.getElementById('stage').innerHTML = slots.join('');

  const tone = TONES.find((t) => t.id === selection.tone);
  document.querySelector('.builder-preview').style.setProperty('--tone', tone.hex);

  const full = setPieces().reduce((sum, p) => sum + p.price, 0);
  const price = setPieces().reduce((sum, p) => sum + Math.round(p.price * (1 - SET_DISCOUNT)), 0);
  document.getElementById('set-price').innerHTML = `
    <span>Your set · ${setPieces().length} pieces in ${tone.label}</span>
    <strong data-price="${price}">${formatPrice(price)}</strong><s data-price="${full}">${formatPrice(full)}</s>`;
}

document.getElementById('steps').addEventListener('click', (e) => {
  const opt = e.target.closest('[data-step]');
  if (opt) {
    selection[opt.dataset.step] = opt.dataset.option || null;
    opt.parentElement.querySelectorAll('[data-step]').forEach((b) => b.setAttribute('aria-pressed', String(b === opt)));
    renderPreview();
  }
  const tone = e.target.closest('[data-tone]');
  if (tone) {
    selection.tone = tone.dataset.tone;
    document.querySelectorAll('[data-tone]').forEach((b) => b.setAttribute('aria-pressed', String(b === tone)));
    renderPreview();
  }
});

document.getElementById('add-set').addEventListener('click', () => {
  const tone = TONES.find((t) => t.id === selection.tone).label;
  setPieces().forEach((p) => addToBag(p.id, { silent: true, bundle: `Variables Set · ${tone}`, discount: SET_DISCOUNT }));
  toast('Your Variables Set is in the bag');
  openDrawer('bag');
});

document.getElementById('shuffle').addEventListener('click', () => {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  VARIABLE_STEPS.forEach((s) => (selection[s.id] = pick(s.options)));
  if (!selection.base) selection.base = VARIABLE_STEPS[0].options[0];
  selection.tone = pick(TONES).id;
  document.querySelectorAll('[data-step]').forEach((b) =>
    b.setAttribute('aria-pressed', String((selection[b.dataset.step] || '') === b.dataset.option))
  );
  document.querySelectorAll('[data-tone]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tone === selection.tone)));
  renderPreview();
});

renderPreview();
