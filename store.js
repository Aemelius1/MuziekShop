import Product from './model/product.js';
import CartItem from './model/cartItem.js';

const cardsContainer = document.getElementById("cardsContainer");

let producten = JSON.parse(localStorage.getItem("producten"));

document.getElementById("blaasinstrumenten").addEventListener("click", () => displayProducten("blaasinstrumenten"));
document.getElementById("slaginstrumenten").addEventListener("click", () => displayProducten("slaginstrumenten"));
document.getElementById("toetsinstrumenten").addEventListener("click", () => displayProducten("toetsinstrumenten"));
document.getElementById("tokkelinstrumenten").addEventListener("click", () => displayProducten("tokkelinstrumenten"));

updateCartIcon();

if (!producten) {
    loadData();
} else {
    displayProducten();
}

function loadData() {
    fetch("./producten.json")
        .then(response => response.json())
        .then(data => {
            const productObjects = data.map(product => new Product(
                product.id,
                product.type,
                product.naam,
                product.img,
                product.beschrijving,
                product.prijs));
            localStorage.setItem("producten", JSON.stringify(productObjects));
            producten = JSON.parse(localStorage.getItem("producten"));
            displayProducten();
        })
        .catch(error => {
            console.error("Error loading data:", error);
        });
}

function displayProducten(filter) {
    cardsContainer.innerHTML = "";
    if (producten) {
        producten.forEach(product => {
            if (!filter || product.type === filter) {
                const card = createCard(product);
                cardsContainer.appendChild(card);
            }
        });
    }
}

function createCard(item) {
    const card = document.createElement("div");
    card.classList.add("card");

    const row = createRow();
    const imgCol = createImageColumn(item.img);
    const infoCol = createInfoColumn(item);

    card.appendChild(row);
    row.appendChild(imgCol);
    row.appendChild(infoCol);

    return card;
}

function createRow() {
    const row = document.createElement("div");
    row.classList.add("row");
    return row;
}

function createImageColumn(imgSrc) {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-4");

    const img = document.createElement("img");
    img.classList.add("img-fluid", "rounded");
    img.src = imgSrc;

    col.appendChild(img);
    return col;
}

function createInfoColumn(product) {
    const col = document.createElement("div");
    col.classList.add("col");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const title = createTitle(product.naam);
    const price = createPrice(product.prijs);
    const description = createDescription(product.beschrijving);
    const addToCartButton = createAddToCartButton(product.id);


    cardBody.appendChild(title);
    cardBody.appendChild(price);
    cardBody.appendChild(description);
    cardBody.appendChild(addToCartButton);

    col.appendChild(cardBody);
    return col;
}

function createTitle(titleText) {
    const title = document.createElement("h4");
    title.classList.add("card-title");
    title.textContent = titleText;
    return title;
}

function createPrice(priceValue) {
    const price = document.createElement("p");
    price.classList.add("card-text");
    price.textContent = formatCurrency(priceValue);
    return price;
}

function createDescription(descriptionText) {
    const description = document.createElement("p");
    description.classList.add("card-text");
    description.textContent = descriptionText;
    return description;
}

function createAddToCartButton(productId) {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.textContent = "In winkelwagen";

    button.addEventListener("click", () => {
        addToCart(productId);
    });

    return button;
}

function addToCart(productId) {
    const productToAdd = producten.find(product => product.id === productId);

    if (productToAdd) {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        const existingCartItem = cartItems.find(item => item.product.id === productToAdd.id);

        if (existingCartItem) {
            existingCartItem.aantal += 1;
        } else {
            const cartItem = new CartItem(productToAdd, 1);
            cartItems.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
    updateCartIcon();
}

function updateCartIcon() {
    const cartIcon = document.getElementById("cartIcon");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length > 0) {
        cartIcon.classList.remove("bi-cart");
        cartIcon.classList.add("bi-cart-check-fill");
    } else {
        cartIcon.classList.remove("bi-cart-check-fill");
        cartIcon.classList.add("bi-cart");
    }
}

function formatCurrency(price) {
    const formatter = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
    });
    return formatter.format(price);
}

