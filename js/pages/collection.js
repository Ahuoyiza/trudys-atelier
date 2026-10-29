/* Single collection: banner + its pieces + links to the other collections. */

const collection = getCollection(getParam('c')) || COLLECTIONS[0];
const items = PRODUCTS.filter((p) => p.collection === collection.id);
const from = Math.min(...items.map((p) => p.price));

document.title = `${collection.name} — Trudy's Atelier`;

document.getElementById('collection').innerHTML = `
  <section class="container collection-banner">
    <div class="banner-copy">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span><a href="collections.html">Collections</a><span>/</span><span>${collection.name}</span>
      </nav>
      <span class="eyebrow">${collection.season} collection</span>
      <h1 class="display">${collection.name}</h1>
      <p><em>${collection.tagline}</em> ${collection.description}</p>
      <div class="banner-meta">
        <div><strong>${items.length}</strong>pieces</div>
        <div><strong data-price="${from}">${formatPrice(from)}</strong>from</div>
        <div><strong>XS–XL</strong>sizes</div>
      </div>
    </div>
    <div class="banner-media">
      <img src="${img(collection.cover, 1100, 880)}" alt="${collection.name} collection">
    </div>
  </section>

  <section class="section container">
    <div class="section-head">
      <h2 class="section-title">The pieces</h2>
      <p>Tap any piece to see details, choose your size or save it for later.</p>
    </div>
    <div class="product-grid">${items.map(productCard).join('')}</div>
  </section>

  <section class="container">
    <div class="section-head">
      <h2 class="section-title">Explore more</h2>
      <a href="collections.html" class="text-link">All collections ${icons.arrow}</a>
    </div>
    <div class="product-grid">
      ${COLLECTIONS.filter((c) => c.id !== collection.id).map((c) => collectionCard(c)).join('')}
    </div>
  </section>`;

