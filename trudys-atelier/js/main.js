/* Trudy's Atelier — shared layout, bag/saved store and helpers.
   Every page loads data.js, then this file, then its own page script. */

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const ONE_SIZE = ['crown-wrap-headpiece'];

/* ---------- Store (localStorage, fails soft) ---------- */

const store = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(`ta-${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(`ta-${key}`, JSON.stringify(value));
    } catch {
      /* private mode or storage disabled: state lives for this page only */
    }
    document.dispatchEvent(new CustomEvent('ta:change', { detail: key }));
  },
};

let bag = store.read('bag', []);
let saved = store.read('saved', []);
let currency = store.read('currency', 'NGN');

const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
const getCollection = (id) => COLLECTIONS.find((c) => c.id === id);
const sizesFor = (id) => (ONE_SIZE.includes(id) ? ['One size'] : SIZES);

function formatPrice(usd) {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  const value = usd * c.rate;
  return `${c.symbol}${value.toLocaleString('en', {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  })}`;
}

/* A bundle (kit or Variables Set) carries its own discount on each line. */
function addToBag(id, { size = sizesFor(id).includes('M') ? 'M' : sizesFor(id)[0], qty = 1, silent = false, bundle = null, discount = 0 } = {}) {
  const line = bag.find((l) => l.id === id && l.size === size && (l.bundle || null) === bundle);
  if (line) line.qty += qty;
  else bag.push({ id, size, qty, ...(bundle && { bundle, discount }) });
  store.write('bag', bag);
  if (!silent) toast(`${getProduct(id).name} added to your bag`);
}

const linePrice = (line) => Math.round(getProduct(line.id).price * (1 - (line.discount || 0))) * line.qty;

function setQty(index, qty) {
  if (qty <= 0) bag.splice(index, 1);
  else bag[index].qty = qty;
  store.write('bag', bag);
}

function toggleSaved(id) {
  const isSaved = saved.includes(id);
  saved = isSaved ? saved.filter((s) => s !== id) : [...saved, id];
  store.write('saved', saved);
  toast(isSaved ? 'Removed from saved' : `${getProduct(id).name} saved`);
}

/* ---------- Icons ---------- */

const icons = {
  mark: `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 36V17a14 14 0 0 1 28 0v19"/><path d="M12 36V18a8 8 0 0 1 16 0v18"/><path d="M18 36V19a2 2 0 0 1 4 0v17"/></g></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m12 7 1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3z" fill="currentColor"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.3 11h10.3L20 7.5H6.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="19" r="1.4" fill="currentColor"/><circle cx="17" cy="19" r="1.4" fill="currentColor"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 8v9H8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

/* ---------- Header / footer ---------- */

const NAV = [
  { href: 'kit.html', label: 'Kit', page: 'kit' },
  { href: 'collections.html', label: 'Collections', page: 'collections' },
  { href: 'variables.html', label: 'Variables Set', page: 'variables' },
];

function renderHeader() {
  const page = document.body.dataset.page;
  const navLinks = NAV.map(
    (n) => `<a href="${n.href}" ${n.page === page ? 'aria-current="page"' : ''}>${n.label}</a>`
  ).join('');
  const currencyOptions = Object.entries(CURRENCIES)
    .map(
      ([code, c]) =>
        `<li><button type="button" data-currency="${code}" ${code === currency ? 'aria-selected="true"' : ''}><span class="flag">${c.flag}</span>${c.label}<span class="muted">${code}</span></button></li>`
    )
    .join('');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="header-inner">
      <a class="logo" href="index.html" aria-label="Trudy's Atelier home">
        ${icons.mark}
        <span class="wordmark"><span class="wordmark-name">Trudy’s</span><span class="wordmark-sub">Atelier</span></span>
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Main">${navLinks}</nav>
      <div class="header-actions">
        <div class="currency">
          <button type="button" class="currency-toggle" aria-haspopup="listbox" aria-expanded="false" aria-label="Choose region and currency">
            <span class="flag" data-currency-flag>${CURRENCIES[currency].flag}</span>${icons.chevron}
          </button>
          <ul class="currency-menu" role="listbox">${currencyOptions}</ul>
        </div>
        <button type="button" class="icon-btn" data-open-drawer="saved" aria-label="Saved items">
          ${icons.bookmark}<span class="badge" data-badge="saved" hidden></span>
        </button>
        <button type="button" class="icon-btn" data-open-drawer="bag" aria-label="Shopping bag">
          ${icons.bag}<span class="badge" data-badge="bag" hidden></span>
        </button>
        <button type="button" class="icon-btn menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">${icons.menu}</button>
      </div>
    </div>`;
  document.body.prepend(header);

  const toggle = header.querySelector('.currency-toggle');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('click', () => toggle.setAttribute('aria-expanded', 'false'));
  header.querySelectorAll('[data-currency]').forEach((btn) =>
    btn.addEventListener('click', () => {
      currency = btn.dataset.currency;
      header.querySelectorAll('[data-currency]').forEach((b) => b.removeAttribute('aria-selected'));
      btn.setAttribute('aria-selected', 'true');
      header.querySelector('[data-currency-flag]').textContent = CURRENCIES[currency].flag;
      store.write('currency', currency);
    })
  );

  const menuBtn = header.querySelector('.menu-btn');
  menuBtn.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <a class="logo logo-lg" href="index.html">${icons.mark}<span class="wordmark"><span class="wordmark-name">Trudy’s</span><span class="wordmark-sub">Atelier</span></span></a>
        <p>Simple, elevated, flowing clothes designed for African women, made in small runs in Lagos.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <a href="collections.html">All collections</a>
        <a href="kit.html">The Kit</a>
        <a href="variables.html">Variables Set</a>
      </div>
      <div>
        <h4>Collections</h4>
        ${COLLECTIONS.map((c) => `<a href="collection.html?c=${c.id}">${c.name}</a>`).join('')}
      </div>
      <form class="newsletter" novalidate>
        <h4>Letters from the atelier</h4>
        <p>New drops, studio notes and first access. Once a month, never more.</p>
        <div class="newsletter-row">
          <input type="email" name="email" placeholder="Your email" aria-label="Email address" required>
          <button type="submit" class="btn btn-dark">Join</button>
        </div>
      </form>
    </div>
    <div class="footer-base">
      <span>© ${new Date().getFullYear()} Trudy’s Atelier</span>
      <span>Photography via Unsplash</span>
    </div>`;
  document.body.append(footer);

  footer.querySelector('.newsletter').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.email;
    if (!input.value || !input.checkValidity()) {
      toast('Please enter a valid email address');
      input.focus();
      return;
    }
    input.value = '';
    toast('Welcome to the atelier. Check your inbox.');
  });
}

/* ---------- Drawer (bag + saved) ---------- */

function renderDrawer() {
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <div class="drawer-scrim" data-close-drawer></div>
    <aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Your bag and saved items">
      <div class="drawer-head">
        <div class="drawer-tabs" role="tablist">
          <button type="button" role="tab" data-tab="bag">Bag <span data-count="bag"></span></button>
          <button type="button" role="tab" data-tab="saved">Saved <span data-count="saved"></span></button>
        </div>
        <button type="button" class="icon-btn" data-close-drawer aria-label="Close">${icons.close}</button>
      </div>
      <div class="drawer-body"></div>
      <div class="drawer-foot"></div>
    </aside>`;
  document.body.append(drawer);

  drawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
    const tab = e.target.closest('[data-tab]');
    if (tab) openDrawer(tab.dataset.tab);
    const qty = e.target.closest('[data-qty]');
    if (qty) setQty(Number(qty.dataset.line), bag[qty.dataset.line].qty + Number(qty.dataset.qty));
    if (e.target.closest('[data-checkout]')) toast('Checkout is coming soon. Your bag is saved.');
    const move = e.target.closest('[data-move-to-bag]');
    if (move) {
      addToBag(move.dataset.moveToBag);
      toggleSaved(move.dataset.moveToBag);
    }
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeDrawer());
}

let drawerTab = 'bag';

function openDrawer(tab = drawerTab) {
  drawerTab = tab;
  const drawer = document.querySelector('.drawer');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  updateDrawer();
}

function closeDrawer() {
  const drawer = document.querySelector('.drawer');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function updateDrawer() {
  const drawer = document.querySelector('.drawer');
  if (!drawer) return;
  drawer.querySelectorAll('[data-tab]').forEach((t) =>
    t.setAttribute('aria-selected', String(t.dataset.tab === drawerTab))
  );
  const count = bag.reduce((n, l) => n + l.qty, 0);
  drawer.querySelector('[data-count="bag"]').textContent = count ? `(${count})` : '';
  drawer.querySelector('[data-count="saved"]').textContent = saved.length ? `(${saved.length})` : '';

  const body = drawer.querySelector('.drawer-body');
  const foot = drawer.querySelector('.drawer-foot');

  if (drawerTab === 'bag') {
    if (!bag.length) {
      body.innerHTML = emptyState('Your bag is empty', 'Pieces you add will wait for you here.');
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = bag
      .map((line, i) => {
        const p = getProduct(line.id);
        return `
          <div class="line">
            <a href="product.html?id=${p.id}"><img src="${img(p.image, 200, 260)}" alt="${p.name}"></a>
            <div class="line-info">
              <a href="product.html?id=${p.id}" class="line-name">${p.name}</a>
              <span class="muted">${line.bundle || getCollection(p.collection).name} · ${line.size}</span>
              <div class="qty">
                <button type="button" data-qty="-1" data-line="${i}" aria-label="Decrease quantity">−</button>
                <span>${line.qty}</span>
                <button type="button" data-qty="1" data-line="${i}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <span class="line-price">${formatPrice(linePrice(line))}</span>
          </div>`;
      })
      .join('');
    const subtotal = bag.reduce((sum, l) => sum + linePrice(l), 0);
    foot.innerHTML = `
      <div class="subtotal"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div>
      <p class="muted small">Shipping and duties calculated at checkout. Free delivery across Lagos, Accra and Nairobi.</p>
      <button type="button" class="btn btn-dark btn-block" data-checkout>Checkout</button>`;
  } else {
    foot.innerHTML = '';
    if (!saved.length) {
      body.innerHTML = emptyState('Nothing saved yet', 'Tap the bookmark on any piece to keep it here.');
      return;
    }
    body.innerHTML = saved
      .map(getProduct)
      .filter(Boolean)
      .map(
        (p) => `
          <div class="line">
            <a href="product.html?id=${p.id}"><img src="${img(p.image, 200, 260)}" alt="${p.name}"></a>
            <div class="line-info">
              <a href="product.html?id=${p.id}" class="line-name">${p.name}</a>
              <span class="muted">${formatPrice(p.price)}</span>
              <div class="line-actions">
                <button type="button" class="link-btn" data-move-to-bag="${p.id}">Move to bag</button>
                <button type="button" class="link-btn muted" data-save="${p.id}">Remove</button>
              </div>
            </div>
          </div>`
      )
      .join('');
  }
}

const emptyState = (title, text) => `
  <div class="empty">
    ${icons.mark}
    <h3>${title}</h3>
    <p class="muted">${text}</p>
    <a href="collections.html" class="btn btn-outline">Explore collections</a>
  </div>`;

/* ---------- Toast ---------- */

let toastTimer;
function toast(message) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------- Shared fragments ---------- */

function productCard(p) {
  const isSaved = saved.includes(p.id);
  return `
    <article class="product-card reveal">
      <div class="media-wrap">
        <a href="product.html?id=${p.id}" class="product-media">
          <img src="${img(p.image, 700, 900)}" alt="${p.name}" loading="lazy">
        </a>
        <button type="button" class="save-btn" data-save="${p.id}" aria-pressed="${isSaved}" aria-label="Save ${p.name}">${icons.heart}</button>
        <button type="button" class="quick-add" data-add="${p.id}">Add to bag</button>
      </div>
      <div class="product-meta">
        <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
        <span data-price="${p.price}">${formatPrice(p.price)}</span>
      </div>
      <span class="muted small">${getCollection(p.collection).name} · ${p.colors.join(', ')}</span>
    </article>`;
}

function collectionCard(c, size = '') {
  const count = PRODUCTS.filter((p) => p.collection === c.id).length;
  return `
    <a href="collection.html?c=${c.id}" class="collection-card ${size} reveal">
      <img src="${img(c.cover, 900, 1200)}" alt="${c.name} collection" loading="lazy">
      <span class="card-label">${c.name}</span>
      <span class="card-count">${count} pieces</span>
    </a>`;
}

const getParam = (key) => new URLSearchParams(location.search).get(key);

/* ---------- Global behaviour ---------- */

function refreshDynamic() {
  const count = bag.reduce((n, l) => n + l.qty, 0);
  document.querySelectorAll('[data-badge]').forEach((b) => {
    const n = b.dataset.badge === 'bag' ? count : saved.length;
    b.textContent = n;
    b.hidden = n === 0;
  });
  document.querySelectorAll('[data-price]').forEach((el) => (el.textContent = formatPrice(Number(el.dataset.price))));
  document.querySelectorAll('[data-save]').forEach((b) => b.setAttribute('aria-pressed', String(saved.includes(b.dataset.save))));
  updateDrawer();
}

function observeReveals() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
}

document.addEventListener('click', (e) => {
  const save = e.target.closest('[data-save]');
  if (save) toggleSaved(save.dataset.save);
  const add = e.target.closest('[data-add]');
  if (add) addToBag(add.dataset.add);
  const open = e.target.closest('[data-open-drawer]');
  if (open) openDrawer(open.dataset.openDrawer);
});

document.addEventListener('ta:change', refreshDynamic);

/* Keep tabs in sync when the bag changes in another window. */
window.addEventListener('storage', () => {
  bag = store.read('bag', []);
  saved = store.read('saved', []);
  refreshDynamic();
});

renderHeader();
renderFooter();
renderDrawer();

document.addEventListener('DOMContentLoaded', () => {
  refreshDynamic();
  observeReveals();
});
