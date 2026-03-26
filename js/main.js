/* ============================================================
   Mystic Magic — Main JavaScript
   ============================================================ */

// ── Cart State ──────────────────────────────────────────────
const Cart = {
  items: JSON.parse(localStorage.getItem('magicCart') || '[]'),

  save() { localStorage.setItem('magicCart', JSON.stringify(this.items)); },

  add(item) {
    const exists = this.items.find(i => i.id === item.id);
    if (exists) {
      exists.qty = (exists.qty || 1) + 1;
    } else {
      this.items.push({ ...item, qty: 1 });
    }
    this.save();
    this.updateUI();
    showToast(`✦ "${item.name}" added to cart`);
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.updateUI();
  },

  total() {
    return this.items.reduce((sum, i) => sum + (parseFloat(i.price) * (i.qty || 1)), 0).toFixed(2);
  },

  count() {
    return this.items.reduce((sum, i) => sum + (i.qty || 1), 0);
  },

  updateUI() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const c = this.count();
      badge.textContent = c;
      badge.style.display = c > 0 ? 'flex' : 'none';
    }
    renderCartSidebar();
  }
};

// ── Toast ────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Cart Sidebar ─────────────────────────────────────────────
function renderCartSidebar() {
  const itemsEl = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-total-price');
  if (!itemsEl) return;

  if (Cart.items.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.<br><br>✦</div>';
  } else {
    itemsEl.innerHTML = Cart.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji || '🎩'}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price} × ${item.qty || 1}</div>
        </div>
        <button class="cart-item-remove" onclick="Cart.remove('${item.id}')" title="Remove">✕</button>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = `$${Cart.total()}`;
}

function openCart() {
  document.querySelector('.cart-sidebar')?.classList.add('open');
  document.querySelector('.cart-overlay')?.classList.add('visible');
}

function closeCart() {
  document.querySelector('.cart-sidebar')?.classList.remove('open');
  document.querySelector('.cart-overlay')?.classList.remove('visible');
}

// ── Navigation ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navCart = document.querySelector('.nav-cart');

  // Scroll behavior
  function onScroll() {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  // Close nav on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Cart button
  navCart?.addEventListener('click', openCart);
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);

  // Init cart UI
  Cart.updateUI();

  // ── Scroll reveal ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Shop filters ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ── Video filters ──
  const videoFilterBtns = document.querySelectorAll('.video-filter-btn');
  const videoCards = document.querySelectorAll('.video-card');

  videoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      videoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      videoCards.forEach(card => {
        if (filter === 'all' || card.dataset.level === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── Contact/Booking form submit ──
  document.querySelectorAll('form.booking-form, form.contact-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✦ Message sent! We will be in touch shortly.');
      form.reset();
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Book now buttons auto-scroll/redirect ──
  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'events.html#booking';
    });
  });
});

// ── Add to cart function (called inline) ──
function addToCart(id, name, price, emoji) {
  Cart.add({ id, name, price, emoji });
}

// ── Buy video function ──
function buyVideo(id, title, price) {
  Cart.add({ id, name: title, price, emoji: '🎬' });
}
