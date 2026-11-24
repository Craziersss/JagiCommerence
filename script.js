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

const viewProductBtn = document.getElementById("view-product");
const viewRecomendationBtn = document.getElementById("view-accessories");

const hero = document.getElementById("hero");
const brandContainer = document.getElementById("brand-container");
const catalogContainer = document.getElementById("catalog");
const withGridCatalog = document.querySelectorAll(".grid-catalogs");

const searchInput = document.getElementById("search-product");
const clearSearchButton = document.getElementById("clear-search");
const searchResult = document.getElementById("search-result");
const sortPriceSelect = document.getElementById("sort-price");
const categoryButtons = document.querySelectorAll(".category-btn");
const categoryParent = document.getElementById("filter-search");
const loadMoreBtn = document.getElementById("load-more-btn");
const featuredContainer = document.getElementById("featured-products");

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
const topSection = document.getElementById("TOP");
const socialMediasBtn = document.querySelectorAll(".sosmed-btn");
const navigationLinks = document.querySelectorAll(".links .link");
const themeButton = document.getElementById("theme-toggle");

let activeCategory = "semua";
let cartCount = 0;
let currentTheme = "light";
let listKeranjang = [];
let cardShownLimit = 8;

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

function renderCatalog(products, fromSearch = false, location = catalogContainer) {
    location.replaceChildren();

    const fragment = document.createDocumentFragment();

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
        fragment.append(card);
    });

    location.append(fragment);
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
    itemPrice.textContent = `Harga: Rp.${(item.price * item.quantity).toLocaleString("id-ID")},00`;

    totalPrice += item.quantity * item.price;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action-container");

    const addButton = document.createElement("button");
    addButton.classList.add("action-item-btn", "add");
    addButton.type = "button";
    addButton.textContent = "+";

    const removeButton = document.createElement("button");
    removeButton.classList.add("action-item-btn", "remove");
    removeButton.type = "button";
    removeButton.textContent = "-";

    itemDetails.append(itemName, itemQuantity, itemPrice);
    itemInfo.append(itemImage, itemDetails);
    actionContainer.append(addButton, removeButton);
    cartItem.append(itemInfo, actionContainer);

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

function updateTheme() {
  const isDark = currentTheme === "dark";

  document.body.classList.toggle("dark-mode", isDark);
}

function loadFeaturedCards() {
  const filtered = catalogData.filter((product) => {
    return product.highlight.toLowerCase() === "featured";
  });

  renderCatalog(filtered, false, featuredContainer);
}

function closeCart() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cartContainer.classList.add("hidden");
    cartOverlay.classList.add("hidden");
    return;
  }

  cartContainer.classList.add("closing");
}

// view product and accessories button event listeners
viewProductBtn.addEventListener("click", () => {
    hero.scrollIntoView({ behavior: "smooth" });
});

viewRecomendationBtn.addEventListener("click", () => {
    featuredContainer.scrollIntoView({ behavior: "smooth" });
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
searchInput.addEventListener("focus", (event) => {
  const wrap = searchInput.closest(".search-wrap");
  wrap.style.borderColor = "#5194cb";
});
searchInput.addEventListener("blur", (event) => {
  const wrap = searchInput.closest(".search-wrap");
  wrap.style.borderColor = "#696969";
});
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  filterProducts();
  searchInput.focus();
});

// Pendengar tombol Buy & Spec
withGridCatalog.forEach((container) => {
  container.addEventListener("click", (event) => {
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
})

//pendengar tombol cart
cartBtn.addEventListener("click", () => {
  cartContainer.classList.remove("closing");
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

cartCloseBtn.addEventListener("click", closeCart);

cartContainer.addEventListener("animationend", (event) => {
  if (
    event.target !== cartContainer ||
    event.animationName !== "cart-slide-out" ||
    !cartContainer.classList.contains("closing")
  ) {
    return;
  }

  cartContainer.classList.remove("closing");
  cartContainer.classList.add("hidden");
  cartOverlay.classList.add("hidden");
});

cartItemsContainer.addEventListener("click", (event) => {
  const isRemoveBtn = event.target.closest(".remove");
  const isAddBtn = event.target.closest(".add");

  if (!isRemoveBtn && !isAddBtn) return;

  const cartItem = event.target.closest(".cart-item");
  const itemName = cartItem.querySelector(".cart-item-name").textContent;
  const itemToAction = listKeranjang.find((item) => item.name === itemName);

  if (itemToAction && isRemoveBtn) {
    if (itemToAction.quantity > 1) {
      itemToAction.quantity--;
    } else {
      listKeranjang = listKeranjang.filter((item) => item !== itemToAction);
    }
  } else if (itemToAction && isAddBtn) {
    itemToAction.quantity++;
  }

  renderCartItems();
});

checkoutBtn.addEventListener("click", () => {
  if (listKeranjang.length === 0) {
    alert(
      "Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.",
    );
    return;
  }

  const confirmation = confirm(
    `Apakah Anda yakin ingin melakukan checkout dengan biaya Rp.${cartTotalPrice.textContent},00? Pesanan akan diproses.`,
  );

  if (confirmation) {
      alert(
          "Terima kasih telah berbelanja! Pesanan Anda akan segera diproses.",
      );
      listKeranjang = [];
      cartCount = 0;
      cartBtn.textContent = "keranjang (0)";
      cartTotalPrice.textContent = "Rp.0,00";
      closeCart();

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

const topSectionObserver = new IntersectionObserver((entries) => {
  const [entry] = entries;
  topBtn.classList.toggle("hidden", entry.isIntersecting);
});

topSectionObserver.observe(topSection);

document
  .getElementById("close-modal")
  .addEventListener("click", closeSpecification);

modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) closeSpecification();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSpecification();
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

themeButton.addEventListener("click", (event) => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem("gadgetverse-theme", currentTheme);

  updateTheme();
});

socialMediasBtn.forEach((button) => {
  button.addEventListener("click", (event) => {
    const link = button.getAttribute("aria-label");

    if (!link) return;

    window.open(link);
  })
})

updateTheme();
renderBrands();
filterProducts();
loadFeaturedCards();
