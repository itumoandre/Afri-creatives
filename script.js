const products = [
  {
    id: 1,
    name: 'Moringa & Baobab Botanical Hair Oil',
    category: 'oil',
    price: 34,
    badge: 'Hair & scalp',
    description: 'A lightweight oil for scalp massage and dry lengths, with moringa and baobab for a soft feel and natural-looking shine.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Shea Butter Curl Cream',
    category: 'butter',
    price: 28,
    badge: 'Styling care',
    description: 'A rich, spreadable cream for curls and coils. Work through damp hair to add softness and help shape your style.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Hibiscus Deep Conditioner',
    category: 'mask',
    price: 32,
    badge: 'Wash-day care',
    description: 'A rinse-out conditioning treatment with hibiscus for a soft, smooth feel and easier detangling on wash day.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Baobab Hair-Sealing Serum',
    category: 'serum',
    price: 26,
    badge: 'Finishing care',
    description: 'A lightweight finishing serum to smooth the feel of dry ends and add shine without a heavy finish.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Aloe & Hibiscus Scalp Gel',
    category: 'serum',
    price: 24,
    badge: 'Scalp care',
    description: 'A light, refreshing gel for a clean-feeling scalp between wash days. Apply a small amount and massage gently.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Moringa Scalp Massage Oil',
    category: 'oil',
    price: 30,
    badge: 'Scalp care',
    description: 'A simple massage oil for a soothing-feeling scalp ritual. Use a few drops and avoid applying more than your hair needs.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  }
];

const cart = [];
const productGrid = document.querySelector('#product-grid');
const filterButtons = document.querySelectorAll('.filter-button');
const productSearch = document.querySelector('#product-search');
const cartCount = document.querySelector('.cart-count');
const cartButton = document.querySelector('.cart-button');
const cartPanel = document.querySelector('.cart-panel');
const cartItems = document.querySelector('.cart-items');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const closeCart = document.querySelector('.close-cart');
const newsletterForm = document.querySelector('#newsletter-form');
const newsletterMessage = document.querySelector('#newsletter-message');
const cartSubtotal = document.querySelector('.cart-total-row strong');
const checkoutButton = document.querySelector('.checkout-button');
const checkoutMessage = document.querySelector('.checkout-message');
const searchButton = document.querySelector('.search-button');

let activeFilter = 'all';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(value);
}

function renderProducts() {
  const searchTerm = productSearch.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const filterMatch = activeFilter === 'all' || product.category === activeFilter;
    const searchMatch = !searchTerm || product.name.toLowerCase().includes(searchTerm)
      || product.description.toLowerCase().includes(searchTerm)
      || product.category.toLowerCase().includes(searchTerm);
    return filterMatch && searchMatch;
  });

  if (!filtered.length) {
    productGrid.innerHTML = '<div class="empty-state">No products match your search.</div>';
    return;
  }

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name} preview image" loading="lazy" decoding="async" />
            <span class="badge">${product.badge}</span>
          </div>
          <div class="product-content">
            <div class="product-meta">
              <span class="product-category">${product.category}</span>
              <span class="product-tag">${product.badge}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-footer">
              <span class="price">${formatCurrency(product.price)}</span>
              <button class="add-to-cart" type="button" data-id="${product.id}" aria-label="Add ${product.name} to cart">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function updateCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = itemCount;
  cartButton.setAttribute('aria-label', `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartSubtotal.textContent = formatCurrency(0);
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="" />
          <div class="cart-item-details">
            <div class="cart-item-title">
              <strong>${item.name}</strong>
              <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
            <div class="quantity-controls">
              <button type="button" data-action="decrement" data-id="${item.id}" aria-label="Decrease ${item.name} quantity">-</button>
              <span aria-label="Quantity: ${item.quantity}">${item.quantity}</span>
              <button type="button" data-action="increment" data-id="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
            </div>
          </div>
        </div>
      `
    )
    .join('');

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  cartSubtotal.textContent = formatCurrency(subtotal);
}

function addToCart(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) return;

  const existingItem = cart.find((item) => item.id === Number(id));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  openCart();
}

function changeCartQuantity(id, change) {
  const item = cart.find((entry) => entry.id === Number(id));
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    const index = cart.findIndex((entry) => entry.id === Number(id));
    cart.splice(index, 1);
  }

  updateCart();
}

function openCart() {
  cartPanel.classList.add('open');
  cartPanel.setAttribute('aria-hidden', 'false');
  cartPanel.inert = false;
  cartButton.setAttribute('aria-expanded', 'true');
  closeCart.focus();
}

function hideCart(returnFocus = true) {
  cartPanel.classList.remove('open');
  cartPanel.setAttribute('aria-hidden', 'true');
  cartPanel.inert = true;
  cartButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) cartButton.focus();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => {
      const selected = btn === button;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    renderProducts();
  });
});

productSearch.addEventListener('input', renderProducts);

productGrid.addEventListener('click', (event) => {
  const trigger = event.target.closest('.add-to-cart');
  if (!trigger) return;
  addToCart(trigger.dataset.id);
});

cartItems.addEventListener('click', (event) => {
  const trigger = event.target.closest('button[data-action]');
  if (!trigger) return;

  const action = trigger.dataset.action;
  const id = Number(trigger.dataset.id);

  if (action === 'increment') {
    changeCartQuantity(id, 1);
  }

  if (action === 'decrement') {
    changeCartQuantity(id, -1);
  }
});

cartButton.addEventListener('click', () => {
  if (cartPanel.classList.contains('open')) {
    hideCart(false);
  } else {
    openCart();
  }
});

closeCart.addEventListener('click', () => {
  hideCart();
});

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('open');
});

siteNav.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  navToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('open');
});

searchButton.addEventListener('click', () => {
  document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
  productSearch.focus({ preventScroll: true });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (cartPanel.classList.contains('open')) hideCart();
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
  }
});

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = document.querySelector('#newsletter-email');
  const email = emailInput.value.trim();

  if (!emailInput.validity.valid) {
    newsletterMessage.textContent = 'Please enter a valid email address.';
    newsletterMessage.classList.add('is-error');
    emailInput.focus();
    return;
  }

  newsletterMessage.textContent = 'Thanks for your interest. This demo does not store or send sign-ups yet.';
  newsletterMessage.classList.remove('is-error');
  newsletterForm.reset();
});

checkoutButton.addEventListener('click', () => {
  checkoutMessage.textContent = 'Checkout is not connected yet. This demo cart will not take payment or place an order.';
});

renderProducts();
updateCart();
