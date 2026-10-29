/* Product detail: gallery, size + colour selection, details, more from the collection. */

const product = getProduct(getParam('id')) || PRODUCTS[0];
const productCollection = getCollection(product.collection);
const sizes = sizesFor(product.id);
const related = PRODUCTS.filter((p) => p.collection === product.collection && p.id !== product.id);
const pairsWith = PRODUCTS.filter((p) => p.collection !== product.collection).slice(0, 2);

let selectedSize = sizes.length === 1 ? sizes[0] : null;
let selectedColor = product.colors[0];

document.title = `${product.name} — Trudy's Atelier`;

document.getElementById('product').innerHTML = `
  <section class="container product-layout">
    <div class="gallery">
      <figure><img src="${img(product.image, 1100, 1375)}" alt="${product.name}"></figure>
      <figure><img src="${img(product.image, 700, 700)}&crop=top" alt="${product.name}, detail" loading="lazy" style="object-position: 50% 20%; transform: scale(1.5)"></figure>
      <figure><img src="${img(product.image, 700, 700)}" alt="${product.name}, hem detail" loading="lazy" style="object-position: 50% 80%; transform: scale(1.5)"></figure>
    </div>

    <div class="product-info">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="collections.html">Collections</a><span>/</span><a href="collection.html?c=${productCollection.id}">${productCollection.name}</a>
      </nav>
      <h1>${product.name}</h1>
      <span class="price" data-price="${product.price}">${formatPrice(product.price)}</span>
      <p class="desc">${product.description}</p>

      <div class="option-group">
        <div class="option-label"><span>Colour</span><span class="muted" id="color-name">${selectedColor}</span></div>
        <div class="option-row" id="colors">
          ${product.colors.map((c, i) => `<button type="button" class="size-btn" data-color="${c}" aria-pressed="${i === 0}">${c}</button>`).join('')}
        </div>
      </div>

      <div class="option-group">
        <div class="option-label"><span>Size</span><button type="button" class="link-btn muted" id="size-guide">Size guide</button></div>
        <div class="option-row" id="sizes">
          ${sizes.map((s) => `<button type="button" class="size-btn" data-size="${s}" aria-pressed="${s === selectedSize}">${s}</button>`).join('')}
        </div>
      </div>

      <div class="buy-row">
        <button type="button" class="btn btn-dark" id="add">Add to bag</button>
        <button type="button" class="save-big" data-save="${product.id}" aria-pressed="${saved.includes(product.id)}" aria-label="Save ${product.name}">${icons.heart}</button>
      </div>

      <div class="details">
        <details open>
          <summary>Fabric &amp; care</summary>
          <p>${product.fabric}. Cold hand wash or gentle machine cycle, dry in the shade, steam rather than iron.</p>
        </details>
        <details>
          <summary>Fit</summary>
          <p>Relaxed through the body with room to move. Our model is 178cm and wears a size S. If you are between sizes, take the smaller one.</p>
        </details>
        <details>
          <summary>Delivery &amp; returns</summary>
          <p>Free delivery across Lagos, Accra and Nairobi in 2–4 days. International shipping in 5–8 days. Free returns within 14 days.</p>
        </details>
        <details>
          <summary>Made in Lagos</summary>
          <p>Cut and finished by hand in our Lagos studio in runs of fewer than 60 pieces.</p>
        </details>
      </div>
    </div>
  </section>

  <section class="section container">
    <div class="section-head">
      <h2 class="section-title">More from ${productCollection.name}</h2>
      <a href="collection.html?c=${productCollection.id}" class="text-link">View collection ${icons.arrow}</a>
    </div>
    <div class="product-grid">${[...related, ...pairsWith].slice(0, 4).map(productCard).join('')}</div>
  </section>`;

document.getElementById('sizes').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-size]');
  if (!btn) return;
  selectedSize = btn.dataset.size;
  document.querySelectorAll('[data-size]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
});

document.getElementById('colors').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-color]');
  if (!btn) return;
  selectedColor = btn.dataset.color;
  document.getElementById('color-name').textContent = selectedColor;
  document.querySelectorAll('[data-color]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
});

document.getElementById('add').addEventListener('click', () => {
  if (!selectedSize) {
    toast('Please choose a size');
    document.getElementById('sizes').animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
      { duration: 300 }
    );
    return;
  }
  addToBag(product.id, { size: selectedSize });
  openDrawer('bag');
});

document.getElementById('size-guide').addEventListener('click', () =>
  toast('XS 6–8 · S 8–10 · M 12–14 · L 14–16 · XL 18–20 (UK/NG sizing)')
);
