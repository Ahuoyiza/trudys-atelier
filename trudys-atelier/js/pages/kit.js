/* Kit: curated capsule bundles, each added to the bag in one go at a bundle price. */

const kitTotal = (kit) => kit.items.reduce((sum, id) => sum + getProduct(id).price, 0);

document.getElementById('kits').innerHTML = KITS.map((kit) => {
  const pieces = kit.items.map(getProduct);
  const full = kitTotal(kit);
  const price = pieces.reduce((sum, p) => sum + Math.round(p.price * (1 - kit.discount)), 0);
  return `
    <article class="kit reveal" id="${kit.id}">
      <div class="kit-copy">
        <span class="eyebrow">${pieces.length} pieces</span>
        <h2>${kit.name}</h2>
        <p>${kit.summary}</p>
        <ul class="kit-list">
          ${pieces.map((p) => `<li><a href="product.html?id=${p.id}">${p.name}</a><span data-price="${p.price}">${formatPrice(p.price)}</span></li>`).join('')}
        </ul>
        <div class="kit-total">
          <strong data-price="${price}">${formatPrice(price)}</strong>
          <s data-price="${full}">${formatPrice(full)}</s>
          <span class="tag">Save ${Math.round(kit.discount * 100)}%</span>
        </div>
        <button type="button" class="btn btn-dark" data-add-kit="${kit.id}">Add the kit to bag</button>
      </div>
      <div class="kit-pieces ${pieces.length === 3 ? 'three' : ''}">
        ${pieces
          .map(
            (p) => `
          <a href="product.html?id=${p.id}" class="kit-piece">
            <span class="product-media"><img src="${img(p.image, 500, 640)}" alt="${p.name}" loading="lazy"></span>
            <span>${p.name}</span>
          </a>`
          )
          .join('')}
      </div>
    </article>`;
}).join('');

document.getElementById('kits').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add-kit]');
  if (!btn) return;
  const kit = KITS.find((k) => k.id === btn.dataset.addKit);
  kit.items.forEach((id) => addToBag(id, { silent: true, bundle: kit.name, discount: kit.discount }));
  toast(`${kit.name} added to your bag`);
  openDrawer('bag');
});
