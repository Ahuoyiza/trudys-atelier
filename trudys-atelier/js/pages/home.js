/* Home: featured products + the "View all collection" pill inside the hero card. */

const FEATURED = [
  'ivory-line-blazer',
  'drift-wrap-coat',
  'halo-linen-midi',
  'canopy-sheer-set',
  'ochre-column-gown',
  'savanna-trail-kaftan',
  'dune-slip-dress',
  'sandstone-trench',
];

document.getElementById('featured').innerHTML = FEATURED.map(getProduct).map(productCard).join('');

document.querySelector('.pill-link').addEventListener('click', (e) => {
  e.preventDefault();
  location.href = e.currentTarget.dataset.href;
});
