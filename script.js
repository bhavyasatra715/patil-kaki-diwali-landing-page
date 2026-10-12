const products = {
  chakli: { name: "Bhajni Chakli", price: 169, weight: "230 g", url: "https://patilkaki.com/products/bhajni-chakli" },
  shankarpali: { name: "Shankarpali", price: 179, weight: "300 g", url: "https://patilkaki.com/products/sweet-shankarpali" },
  besan: { name: "Besan Ladoo", price: 389, weight: "350 g", url: "https://patilkaki.com/products/besan-ladoo" },
  rava: { name: "Rava Ladoo", price: 339, weight: "350 g", url: "https://patilkaki.com/products/rava-ladoo" },
  chivda: { name: "Poha Chivda", price: 179, weight: "300 g", url: "https://patilkaki.com/products/chivda" }
};
const sets = { mini: ["chakli", "shankarpali", "chivda"], classic: ["chakli", "shankarpali", "chivda", "besan", "rava"] };
const cart = new Map();
const count = document.querySelector(".cart-count");
const drawer = document.querySelector(".cart-drawer");
const backdrop = document.querySelector(".cart-backdrop");
const cartItems = document.querySelector(".cart-items");
const emptyCart = document.querySelector(".cart-empty");
const cartTotal = document.querySelector(".cart-total");
const toast = document.querySelector(".toast");
let toastTimer;

function announce(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}
function addToCart(id, quantity = 1) {
  cart.set(id, (cart.get(id) || 0) + quantity);
  renderCart();
  announce(`${products[id].name} added to your demo basket`);
}
function renderCart() {
  const totalCount = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  count.textContent = totalCount;
  count.setAttribute("aria-label", `${totalCount} items in demo cart`);
  cartItems.innerHTML = "";
  let total = 0;
  for (const [id, quantity] of cart) {
    const product = products[id];
    total += product.price * quantity;
    const item = document.createElement("div");
    item.className = "cart-item";
    const description = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = product.name;
    const detail = document.createElement("small");
    detail.textContent = `${product.weight} · Qty ${quantity}`;
    description.append(title, detail);
    const actions = document.createElement("div");
    actions.className = "cart-item-actions";
    const price = document.createElement("strong");
    price.textContent = `₹${product.price * quantity}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${product.name} from demo basket`);
    remove.addEventListener("click", () => { cart.delete(id); renderCart(); });
    actions.append(price, remove);
    item.append(description, actions);
    cartItems.append(item);
  }
  const hasItems = totalCount > 0;
  emptyCart.hidden = hasItems;
  cartTotal.hidden = !hasItems;
  cartTotal.querySelector("strong").textContent = `₹${total.toLocaleString("en-IN")}`;
}
function openCart() {
  drawer.hidden = false;
  backdrop.hidden = false;
  document.body.classList.add("cart-open");
  drawer.querySelector(".cart-close").focus();
}
function closeCart() {
  drawer.hidden = true;
  backdrop.hidden = true;
  document.body.classList.remove("cart-open");
  document.querySelector(".cart-trigger").focus();
}

document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => addToCart(button.dataset.add)));
document.querySelectorAll("[data-set]").forEach(button => button.addEventListener("click", () => {
  sets[button.dataset.set].forEach(id => addToCart(id));
  openCart();
}));
document.querySelectorAll(".cart-trigger").forEach(button => button.addEventListener("click", openCart));
document.querySelector(".cart-close").addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape" && !drawer.hidden) closeCart(); });

function applyFilters(category = "all", query = "") {
  const normalized = query.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll("[data-product]").forEach(card => {
    const categoryMatch = category === "all" || category === "faral" || card.dataset.category === category;
    const searchMatch = !normalized || card.dataset.name.includes(normalized) || card.querySelector(".product-name").textContent.toLowerCase().includes(normalized);
    card.hidden = !(categoryMatch && searchMatch);
    if (!card.hidden) visible += 1;
  });
  const status = document.querySelector(".filter-status");
  status.textContent = normalized ? `${visible} ${visible === 1 ? "favourite" : "favourites"} found` : category === "all" || category === "faral" ? "" : category === "sweets" ? "Sweet favourites" : "Savoury favourites";
}
document.querySelectorAll("[data-category-filter]").forEach(button => button.addEventListener("click", () => {
  const category = button.dataset.categoryFilter;
  applyFilters(category);
  document.querySelector("#bestsellers").scrollIntoView({ behavior: "smooth", block: "start" });
}));
document.querySelectorAll("[data-nav-filter]").forEach(link => link.addEventListener("click", () => applyFilters(link.dataset.navFilter)));

const searchPanel = document.querySelector(".search-panel");
const searchToggle = document.querySelector(".search-toggle");
const searchInput = document.querySelector("#product-search");
function closeSearch() {
  searchPanel.hidden = true;
  searchToggle.setAttribute("aria-expanded", "false");
}
searchToggle.addEventListener("click", () => {
  searchPanel.hidden = !searchPanel.hidden;
  searchToggle.setAttribute("aria-expanded", String(!searchPanel.hidden));
  if (!searchPanel.hidden) searchInput.focus();
});
document.querySelector(".search-close").addEventListener("click", () => { closeSearch(); applyFilters("all"); searchInput.value = ""; });
searchPanel.addEventListener("submit", event => event.preventDefault());
searchInput.addEventListener("input", () => {
  applyFilters("all", searchInput.value);
  document.querySelector("#bestsellers").scrollIntoView({ behavior: "smooth", block: "start" });
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
