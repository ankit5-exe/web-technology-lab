const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", cat: "Electronics", price: 1999, old: 3499, rating: 4.5, reviews: 1280, color: "#5b3df5" },
  { id: 2, name: "Smart Watch Series X", cat: "Electronics", price: 3499, old: 5999, rating: 4.3, reviews: 860, color: "#7f6bff" },
  { id: 3, name: "Bluetooth Speaker", cat: "Electronics", price: 1299, old: 2199, rating: 4.4, reviews: 640, color: "#4429d1" },
  { id: 4, name: "Portable Power Bank", cat: "Electronics", price: 999, old: 1599, rating: 4.2, reviews: 2100, color: "#6d5bf0" },
  { id: 5, name: "Classic Denim Jacket", cat: "Fashion", price: 1799, old: 2999, rating: 4.1, reviews: 420, color: "#ff7a59" },
  { id: 6, name: "Running Sneakers", cat: "Fashion", price: 2299, old: 3999, rating: 4.6, reviews: 970, color: "#f0653f" },
  { id: 7, name: "Cotton Casual Shirt", cat: "Fashion", price: 699, old: 1299, rating: 4.0, reviews: 530, color: "#ffa07f" },
  { id: 8, name: "Leather Backpack", cat: "Fashion", price: 1499, old: 2499, rating: 4.4, reviews: 310, color: "#e8590c" },
  { id: 9, name: "Ceramic Dinner Set", cat: "Home", price: 1899, old: 2999, rating: 4.5, reviews: 280, color: "#14b8a6" },
  { id: 10, name: "Memory Foam Pillow", cat: "Home", price: 799, old: 1399, rating: 4.3, reviews: 760, color: "#0d9488" },
  { id: 11, name: "LED Table Lamp", cat: "Home", price: 599, old: 999, rating: 4.2, reviews: 450, color: "#2dd4bf" },
  { id: 12, name: "Aroma Candle Set", cat: "Home", price: 499, old: 899, rating: 4.6, reviews: 390, color: "#0f766e" },
  { id: 13, name: "Vitamin C Face Serum", cat: "Beauty", price: 649, old: 1099, rating: 4.4, reviews: 1500, color: "#ec4899" },
  { id: 14, name: "Matte Lipstick Combo", cat: "Beauty", price: 449, old: 799, rating: 4.1, reviews: 890, color: "#db2777" },
  { id: 15, name: "Herbal Shampoo", cat: "Beauty", price: 349, old: 599, rating: 4.3, reviews: 1120, color: "#f472b6" },
  { id: 16, name: "Sunscreen SPF 50", cat: "Beauty", price: 399, old: 699, rating: 4.5, reviews: 1340, color: "#be185d" }
];

/* ---------- Cart storage ---------- */
function getCart() {
  try { return JSON.parse(localStorage.getItem("shopease_cart")) || []; }
  catch (e) { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem("shopease_cart", JSON.stringify(cart)); } catch (e) {}
  updateCartCount();
}
function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  el.textContent = getCart().reduce((sum, i) => sum + i.qty, 0);
}
function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1; else cart.push({ id: id, qty: 1 });
  saveCart(cart);
  const p = PRODUCTS.find(x => x.id === id);
  showToast(p.name + " added to cart");
}

/* ---------- Helpers ---------- */
function formatPrice(n) { return "Rs. " + n.toLocaleString("en-IN"); }

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

function productCard(p) {
  const off = Math.round((1 - p.price / p.old) * 100);
  const initials = p.name.split(" ").slice(0, 2).map(w => w[0]).join("");
  return `
    <div class="product-card">
      <div class="product-img" style="background: linear-gradient(135deg, ${p.color}, ${p.color}aa);">${initials}</div>
      <div class="product-body">
        <span class="product-cat">${p.cat}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="rating">${p.rating.toFixed(1)} / 5 <span>(${p.reviews} reviews)</span></div>
        <div class="price-row">
          <span class="price">${formatPrice(p.price)}</span>
          <span class="old-price">${formatPrice(p.old)}</span>
          <span class="off">${off}% off</span>
        </div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>`;
}

/* ---------- Home page ---------- */
function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  const featured = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
  grid.innerHTML = featured.map(productCard).join("");
}

/* ---------- Products page ---------- */
let currentCat = "All";
let currentSort = "default";
let currentSearch = "";

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  let list = PRODUCTS.filter(p =>
    (currentCat === "All" || p.cat === currentCat) &&
    (p.name.toLowerCase().includes(currentSearch) || p.cat.toLowerCase().includes(currentSearch))
  );
  if (currentSort === "low") list.sort((a, b) => a.price - b.price);
  if (currentSort === "high") list.sort((a, b) => b.price - a.price);
  if (currentSort === "rating") list.sort((a, b) => b.rating - a.rating);
  grid.innerHTML = list.map(productCard).join("");
  document.getElementById("noResults").hidden = list.length > 0;
}

function initProductsPage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("cat")) currentCat = params.get("cat");
  if (params.get("q")) {
    currentSearch = params.get("q").toLowerCase();
    document.getElementById("searchInput").value = params.get("q");
  }

  const buttons = document.querySelectorAll(".filter");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cat === currentCat);
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCat = btn.dataset.cat;
      renderProducts();
    });
  });

  document.getElementById("sortSelect").addEventListener("change", e => {
    currentSort = e.target.value;
    renderProducts();
  });
  renderProducts();
}

/* ---------- Search bar (all pages) ---------- */
function initSearch() {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  if (!input || !btn) return;

  const run = () => {
    const q = input.value.trim();
    if (document.getElementById("productGrid")) {
      currentSearch = q.toLowerCase();
      renderProducts();
    } else {
      window.location.href = "products.html?q=" + encodeURIComponent(q);
    }
  };
  btn.addEventListener("click", run);
  input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
}

/* ---------- Cart page ---------- */
let couponPercent = 0;

function renderCart() {
  const box = document.getElementById("cartItems");
  if (!box) return;
  const cart = getCart();

  if (cart.length === 0) {
    box.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Looks like you have not added anything yet.</p>
        <a href="products.html" class="btn">Start Shopping</a>
      </div>`;
    updateSummary(0);
    return;
  }

  box.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const initials = p.name.split(" ").slice(0, 2).map(w => w[0]).join("");
    return `
      <div class="cart-item">
        <div class="cart-img" style="background: linear-gradient(135deg, ${p.color}, ${p.color}aa);">${initials}</div>
        <div class="cart-info">
          <h4>${p.name}</h4>
          <p>${p.cat} | ${formatPrice(p.price)} each</p>
          <div class="qty">
            <button onclick="changeQty(${p.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div class="item-total">${formatPrice(p.price * item.qty)}</div>
          <button class="remove-btn" onclick="removeItem(${p.id})">Remove</button>
        </div>
      </div>`;
  }).join("");

  const subtotal = cart.reduce((s, i) => s + PRODUCTS.find(x => x.id === i.id).price * i.qty, 0);
  updateSummary(subtotal);
}

function updateSummary(subtotal) {
  const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const discount = Math.round(subtotal * couponPercent / 100);
  const total = subtotal + delivery - discount;
  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("delivery").textContent = delivery === 0 ? "Free" : formatPrice(delivery);
  document.getElementById("discount").textContent = "- " + formatPrice(discount);
  document.getElementById("total").textContent = formatPrice(total);
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart();
  showToast("Item removed");
}

function initCartPage() {
  if (!document.getElementById("cartItems")) return;

  document.getElementById("applyCoupon").addEventListener("click", () => {
    const code = document.getElementById("couponInput").value.trim().toUpperCase();
    if (code === "SAVE10") { couponPercent = 10; showToast("Coupon applied: 10% off"); }
    else { couponPercent = 0; showToast("Invalid coupon code"); }
    renderCart();
  });

  document.getElementById("clearCart").addEventListener("click", () => {
    saveCart([]);
    renderCart();
    showToast("Cart cleared");
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (getCart().length === 0) { showToast("Your cart is empty"); return; }
    saveCart([]);
    couponPercent = 0;
    renderCart();
    showToast("Order placed successfully. Thank you for shopping!");
  });

  renderCart();
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    let valid = true;

    const setErr = (id, text) => { document.getElementById(id).textContent = text; if (text) valid = false; };
    setErr("nameErr", name.length < 2 ? "Please enter your name." : "");
    setErr("emailErr", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email.");
    setErr("messageErr", message.length < 10 ? "Message should be at least 10 characters." : "");

    if (valid) {
      form.reset();
      showToast("Message sent. We will get back to you soon.");
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initSearch();
  renderFeatured();
  initProductsPage();
  initCartPage();
  initContactForm();
});