"use strict";

import { catalogData } from "./data-catalog.js";

const brandLogo = [
  { nama: "Apple iBox", icon: "fa-apple" },
  { nama: "Samsung TAM", icon: "fa-android" },
  { nama: "Xiaomi", icon: "fa-mobile-screen-button" },
  { nama: "Google", icon: "fa-google" },
  { nama: "Oppo TAM", icon: "fa-mobile-screen-button" },
  { nama: "Sony Audio", icon: "fa-headphones" },
  { nama: "OnePlus", icon: "fa-mobile-screen-button" },
];

let listKeranjang = [];
let cardShownLimit = 8;

const viewProductBtn = document.getElementById("view-product");
const viewAccessoriesBtn = document.getElementById("view-accessories");

const hero = document.getElementById("hero");
const brandContainer = document.getElementById("brand-container");
const catalogContainer = document.getElementById("catalog");
const searchInput = document.getElementById("search-product");
const clearSearchButton = document.getElementById("clear-search");
const searchResult = document.getElementById("search-result");
const sortPriceSelect = document.getElementById("sort-price");
const categoryButtons = document.querySelectorAll(".category-btn");
const categoryParent = document.getElementById("filter-search");
const loadMoreBtn = document.getElementById("load-more-btn");

// variabel untuk semua yang ada di cart
const cartBtn = document.getElementById("cart-button");
const cartOverlay = document.getElementById("cart-overlay");
const cartContainer = document.getElementById("cart-container");
const cartCloseBtn = document.getElementById("cart-close");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalContainer = document.getElementById("cart-total");
const cartTotalPrice = document.getElementById("cart-total-price");
const checkoutBtn = document.getElementById("checkout-btn");

const modal = document.getElementById("spec-modal");
const specDetail = document.getElementById("spec-detail");
const specTitle = document.getElementById("spec-title");

const topBtn = document.getElementById("top-btn");

let activeCategory = "semua";
let cartCount = 0;

function renderBrands() {
  brandContainer.replaceChildren();
  brandLogo.forEach((brand) => {
    const article = document.createElement("article");
    article.className = "brand-partner";

    const icon = document.createElement("i");
    icon.className = `fa-brands ${brand.icon}`;

    const name = document.createElement("p");
    name.className = "brand-name";
    name.textContent = brand.nama;

    article.append(icon, name);
    brandContainer.append(article);
  });
}

function createTags(datas) {
  const fragment = document.createDocumentFragment();

  datas.forEach((text) => {
    const tag = document.createElement("li");

    tag.className = "tag";
    tag.textContent = text;

    fragment.append(tag);
  });

  return fragment;
}

function renderCatalog(products, fromSearch = false) {
    catalogContainer.replaceChildren();

    if (products.length === 0) {
        const empty = document.createElement("p");
        empty.classList.add("empty-result");
        empty.textContent =
            "Produk tidak ditemukan. Coba kata kunci lain, misalnya iPhone atau Samsung.";
        catalogContainer.append(empty);
        return;
    }

    products.forEach((product, i) => {
        if (i >= cardShownLimit && !fromSearch) return;

        const card = document.createElement("article");
        card.classList.add("catalog-card");
        card.setAttribute("id", product.id);

        // Attribute Container
        const attribute = document.createElement("div");
        const highlight = document.createElement("span");
        const type = document.createElement("p");

        attribute.classList.add("card-attribute");
        highlight.classList.add("short-info");
        type.classList.add("small-text");

        highlight.textContent = product.highlight;
        type.textContent = product.type;

        attribute.append(highlight, type);

        // Image Container
        const imageContainer = document.createElement("div");
        const discount = document.createElement("span");
        const image = document.createElement("img");

        imageContainer.classList.add("img-container");
        discount.classList.add("discount");

        discount.textContent = `-${product.discount}%`;

        image.src = product.imageLink;
        image.alt = product.name;
        image.loading = "lazy";

        imageContainer.append(discount, image);

        // Information Container
        const info = document.createElement("div");
        const price = document.createElement("p");
        const name = document.createElement("h2");
        const description = document.createElement("p");
        const tags = document.createElement("ul");

        info.classList.add("card-info");
        price.classList.add("price");
        name.classList.add("card-name");
        description.classList.add("desc");
        tags.classList.add("tags");

        price.textContent = `Rp.${product.price.toLocaleString("id-ID")},00`;
        name.textContent = product.name;
        description.textContent = product.description;
        tags.append(createTags(product.spesification));

        info.append(price, name, description, tags);

        // Actions Container
        const actions = document.createElement("div");
        const buyButton = document.createElement("button");
        const specButton = document.createElement("button");

        actions.classList.add("action");
        buyButton.classList.add("highlighted-btn");
        specButton.classList.add("bone-btn");

        buyButton.type = "button";
        buyButton.textContent = "Masukan Keranjang";

        specButton.type = "button";
        specButton.textContent = "Spesifikasi";

        // Appending ke container-container nya
        actions.append(buyButton, specButton);
        card.append(attribute, imageContainer, info, actions);
        catalogContainer.append(card);
    });
}

function renderCartItems() {
  cartItemsContainer.replaceChildren();

  const fragment = document.createDocumentFragment();
  let totalPrice = 0;

  listKeranjang.forEach((item) => {
    const cartItem = document.createElement("article");
    cartItem.classList.add("cart-item");

    const itemInfo = document.createElement("div");
    itemInfo.classList.add("cart-item-info");

    const itemImage = document.createElement("img");
    itemImage.classList.add("cart-item-image");
    itemImage.src = catalogData.find(
      (product) => product.id === item.id,
    ).imageLink;
    itemImage.alt = item.name;

    const itemDetails = document.createElement("div");
    itemDetails.classList.add("cart-item-details");

    const itemName = document.createElement("h3");
    itemName.classList.add("cart-item-name");
    itemName.textContent = item.name;

    const itemQuantity = document.createElement("p");
    itemQuantity.classList.add("cart-item-quantity");
    itemQuantity.textContent = `Jumlah: ${item.quantity}`;

        const itemPrice = document.createElement("p");
        itemPrice.classList.add("cart-item-price");
        itemPrice.textContent = `Harga: Rp.${item.price.toLocaleString("id-ID")},00 per unit`;

    totalPrice += item.quantity * item.price;

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-item-btn");
    removeButton.type = "button";
    removeButton.textContent = "-";

    itemDetails.append(itemName, itemQuantity, itemPrice);
    itemInfo.append(itemImage, itemDetails);
    cartItem.append(itemInfo, removeButton);

    fragment.append(cartItem);
  });

  cartItemsContainer.append(fragment);

    cartTotalPrice.textContent = `Rp.${totalPrice.toLocaleString("id-ID")},00`;
}

function cartUpdate(product) {
  const existingItem = listKeranjang.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    let item = {
      id: product.id,
      name: product.name,
      priceString: product.priceString,
      price: product.price,
      quantity: 1,
    };
    listKeranjang.push(item);
  }
}

function openSpecification(product) {
  specTitle.textContent = `Spesifikasi ${product.name}`;
  specDetail.replaceChildren();

  const table = document.createElement("dl");
  table.className = "spec-list";

  Object.entries(product.detail).forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "spec-row";

    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = value;

    row.append(term, description);
    table.append(row);
  });

  specDetail.append(table);
  modal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeSpecification() {
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

function filterProducts() {
    const keyword = searchInput.value.trim().toLowerCase();

    const filtered = catalogData.filter((product) => {
        const matchesCategory =
            activeCategory === "semua" || product.type === activeCategory;

        const searchableText = [
            product.name,
            product.brand,
            product.type,
            product.description,
            ...product.spesification,
            ...Object.values(product.detail),
        ]
            .join(" ")
            .toLowerCase();

        const matchesKeyword = searchableText.includes(keyword);
        return matchesCategory && matchesKeyword;
    });

    if (sortPriceSelect.value !== "default") {
        const sortDirection = sortPriceSelect.value === "asc" ? 1 : -1;
        filtered.sort(
            (first, second) => (first.price - second.price) * sortDirection,
        );
    }

    const hasFilter = activeCategory !== "semua" || keyword !== "";
    renderCatalog(filtered, hasFilter);
    loadMoreBtn.style.display =
        hasFilter || filtered.length <= cardShownLimit ? "none" : "flex";

    searchResult.textContent = hasFilter
        ? `Menampilkan ${filtered.length} dari ${catalogData.length} produk`
        : `Menampilkan semua produk`;
}

// view product and accessories button event listeners
viewProductBtn.addEventListener("click", () => {
    hero.scrollIntoView({ behavior: "smooth" });
});

viewAccessoriesBtn.addEventListener("click", () => {
    hero.scrollIntoView({ behavior: "smooth" });

    activeCategory = "Gadget Accessories";

    filterProducts();
});

// Pendengar Search Bar & Category
categoryParent.addEventListener("click", (event) => {
  const isCategoryButton = event.target.closest(".category-btn");
  if (!isCategoryButton) return;

  activeCategory = isCategoryButton.dataset.category;

  categoryButtons.forEach((categoryButton) => {
    const isActive = categoryButton === isCategoryButton;
    categoryButton.classList.toggle("active", isActive);
  });

  filterProducts();
});

searchInput.addEventListener("input", filterProducts);
sortPriceSelect.addEventListener("change", () => {
    cardShownLimit = 8;
    filterProducts();
});
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  filterProducts();
  searchInput.focus();
});

// Pendengar tombol Buy & Spec
catalogContainer.addEventListener("click", (event) => {
  const isBuyBtn = event.target.closest(".highlighted-btn");
  const isSpecBtn = event.target.closest(".bone-btn");

  if (!isBuyBtn && !isSpecBtn) return;

  const articleID = Number(event.target.closest(".catalog-card").id);
  const articleParent = catalogData.find((product) => product.id === articleID);

  if (isBuyBtn) {
    cartCount++;
    cartBtn.textContent = `keranjang (${cartCount})`;

    alert(`Produk "${articleParent.name}" telah ditambahkan ke keranjang.`);

    cartUpdate(articleParent);
  } else if (isSpecBtn) {
    openSpecification(articleParent);
  }
});

//pendengar tombol cart
cartBtn.addEventListener("click", () => {
  cartOverlay.classList.remove("hidden");
  cartContainer.classList.remove("hidden");
  cartItemsContainer.replaceChildren();

  if (listKeranjang.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("empty-result");
    empty.textContent = "Keranjang belanja kosong.";
    cartItemsContainer.append(empty);
    cartTotalContainer.classList.add("hidden");
    return;
  }

  renderCartItems();
});

cartCloseBtn.addEventListener("click", () => {
  cartOverlay.classList.add("hidden");
  cartContainer.classList.add("hidden");
});

cartItemsContainer.addEventListener("click", (event) => {
  const isRemoveBtn = event.target.closest(".remove-item-btn");
  if (!isRemoveBtn) return;

  const cartItem = event.target.closest(".cart-item");
  const itemName = cartItem.querySelector(".cart-item-name").textContent;
  const itemToRemove = listKeranjang.find((item) => item.name === itemName);

  if (itemToRemove) {
    if (itemToRemove.quantity > 1) {
      itemToRemove.quantity--;
    } else {
      listKeranjang = listKeranjang.filter((item) => item !== itemToRemove);
    }
  }

  renderCartItems();
});

checkoutBtn.addEventListener("click", () => {
  if (listKeranjang.length === 0) {
    alert(
      "Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.",
    );

    if (confirmation) {
        alert(
            "Terima kasih telah berbelanja! Pesanan Anda akan segera diproses.",
        );
        listKeranjang = [];
        cartCount = 0;
        cartBtn.textContent = "keranjang (0)";
        cartTotalPrice.textContent = "Rp.0,00";
        cartOverlay.classList.add("hidden");
        cartContainer.classList.add("hidden");

        renderCartItems();
    }
});

//Menaikan limit kartu katalog
loadMoreBtn.addEventListener("click", () => {
    cardShownLimit += 6;

    if (cardShownLimit >= catalogData.length) {
        cardShownLimit = catalogData.length;
        loadMoreBtn.style.display = "none";
    }

    filterProducts();
});

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document
  .getElementById("close-modal")
  .addEventListener("click", closeSpecification);

modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) closeSpecification();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSpecification();
});

renderBrands();
renderCatalog(catalogData);

const darkModeStyle = document.createElement("style");

darkModeStyle.textContent = `
    body.dark-mode {
        background: #121212;
        color: #f5f5f5;
    }

    body.dark-mode header,
    body.dark-mode footer,
    body.dark-mode .catalog-card,
    body.dark-mode .katalog,
    body.dark-mode .brand-partner,
    body.dark-mode .search-wrap,
    body.dark-mode .category-btn,
    body.dark-mode .spec-modal-content,
    body.dark-mode .cart-container {
        background: #1e1e1e;
        color: #f5f5f5;
        border-color: #383838;
    }

    body.dark-mode .hero-desc,
    body.dark-mode .desc,
    body.dark-mode .small-text,
    body.dark-mode .header-desc,
    body.dark-mode .link,
    body.dark-mode .search-result {
        color: #bdbdbd;
    }

    body.dark-mode .short-info-boxs,
    body.dark-mode .cart-items,
    body.dark-mode .cart-item,
    body.dark-mode .empty-result {
        background: #292929;
        color: #f5f5f5;
        border-color: #444;
    }

    body.dark-mode .cart-item {
        background: #333;
    }

    body.dark-mode .bone-btn,
    body.dark-mode .clear-search {
        background: #333;
        color: white;
        border-color: #555;
    }

    body.dark-mode .tag {
        background: #303b49;
        color: #d4e6ff;
    }

    body.dark-mode .category-btn.active {
        background: #5194cb;
        color: white;
    }

    body.dark-mode input {
        color: white;
    }

    body.dark-mode .spec-row dt {
        color: white;
    }

    body.dark-mode .spec-row dd {
        color: #bbb;
    }

    body.dark-mode .about-section {
        background: #1e1e1e;
        color: white;
    }

    body.dark-mode .about-card {
        background: #292929;
        border-color: #444;
    }

    .about-section {
        margin: 40px 0;
        padding: 30px;
        background: white;
        border-radius: 16px;
        color: #222;
    }

    .about-section h2 {
        margin-bottom: 15px;
    }

    .about-section p {
        line-height: 1.8;
        margin-bottom: 15px;
    }

    .about-values {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        margin-top: 25px;
    }

    .about-card {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 12px;
        background: #f8f8f8;
    }

    .about-card h3 {
        margin-bottom: 10px;
        color: #5194cb;
    }
`;

document.head.append(darkModeStyle);

const themeButton = document.createElement("button");

themeButton.type = "button";
themeButton.id = "theme-toggle";
themeButton.className = "theme-btn round-btn";
themeButton.setAttribute("aria-label", "Ganti Tema");
themeButton.title = "Ganti Tema";

const floatingBtns = document.querySelector(".floating-btns");
const topBtn = document.querySelector(".top-btn");

floatingBtns.insertBefore(themeButton, topBtn);

let currentTheme = localStorage.getItem("gadgetverse-theme") || "light";

function updateTheme() {
  const isDark = currentTheme === "dark";

  document.body.classList.toggle("dark-mode", isDark);

  themeButton.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}

updateTheme();

themeButton.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem("gadgetverse-theme", currentTheme);

  updateTheme();
});

const aboutSection = document.createElement("section");

aboutSection.id = "tentang-kami";
aboutSection.className = "about-section";

const aboutTitle = document.createElement("h2");
aboutTitle.textContent = "Tentang GadgetVerse";

const aboutHistory = document.createElement("p");

aboutHistory.textContent =
  "GadgetVerse merupakan perusahaan teknologi yang " +
  "didirikan pada tahun 2000 dengan tujuan memberikan " +
  "kemudahan bagi masyarakat dalam memperoleh perangkat " +
  "teknologi berkualitas. Berawal dari sebuah toko kecil " +
  "yang menyediakan handphone dan aksesori, GadgetVerse " +
  "terus berkembang mengikuti kemajuan teknologi hingga " +
  "menjadi platform katalog gadget modern.";

const aboutVisionTitle = document.createElement("h2");
aboutVisionTitle.textContent = "Visi dan Misi";

const aboutVision = document.createElement("p");

aboutVision.textContent =
  "Visi kami adalah menjadi platform penyedia informasi " +
  "dan kebutuhan gadget terpercaya. Misi kami adalah " +
  "menyediakan produk berkualitas, memberikan pelayanan " +
  "terbaik, menghadirkan informasi produk yang transparan, " +
  "serta mengikuti perkembangan teknologi.";

const valuesContainer = document.createElement("div");
valuesContainer.className = "about-values";

const values = [
  {
    title: "Kualitas",
    description: "Mengutamakan kualitas produk dan kepuasan pelanggan.",
  },
  {
    title: "Kepercayaan",
    description: "Memberikan informasi produk yang jelas dan transparan.",
  },
  {
    title: "Inovasi",
    description: "Terus mengikuti perkembangan teknologi terbaru.",
  },
];

values.forEach((value) => {
  const card = document.createElement("article");
  card.className = "about-card";

  const title = document.createElement("h3");
  title.textContent = value.title;

  const description = document.createElement("p");
  description.textContent = value.description;

  card.append(title, description);
  valuesContainer.append(card);
});

aboutSection.append(
  aboutTitle,
  aboutHistory,
  aboutVisionTitle,
  aboutVision,
  valuesContainer,
);

const mainElement = document.querySelector("main");
const modalElement = document.getElementById("spec-modal");

mainElement.insertBefore(aboutSection, modalElement);

const navigationLinks = document.querySelectorAll(".links .link");

navigationLinks.forEach((link) => {
  if (link.textContent.trim().toLowerCase() === "tentang kami") {
    link.href = "#tentang-kami";
  }

  if (link.textContent.trim().toLowerCase() === "katalog hp") {
    link.href = "#TOP";
  }
});

filterProducts();

console.log("GadgetVerse berhasil diperbarui!");
console.log("Total produk:", catalogData.length);
