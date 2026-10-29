/* Collections index: collection cards, then every piece with filter + sort. */

const SIZES_LAYOUT = ['wide', 'wide', '', '', ''];
document.getElementById('collections').innerHTML = COLLECTIONS.map((c, i) => collectionCard(c, SIZES_LAYOUT[i])).join('');

const grid = document.getElementById('all-products');
const chips = document.getElementById('filters');
let filter = getParam('filter') || 'all';
let sort = 'featured';

chips.innerHTML = [{ id: 'all', name: 'All' }, ...COLLECTIONS]
  .map((c) => `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="${c.id === filter}">${c.name}</button>`)
  .join('');

function renderProducts() {
  let list = PRODUCTS.filter((p) => filter === 'all' || p.collection === filter);
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  grid.innerHTML = list.map(productCard).join('');
  document.getElementById('result-count').textContent = `${list.length} pieces`;
  observeReveals();
}

chips.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-filter]');
  if (!chip) return;
  filter = chip.dataset.filter;
  chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
  renderProducts();
});

document.getElementById('sort').addEventListener('change', (e) => {
  sort = e.target.value;
  renderProducts();
});

renderProducts();
