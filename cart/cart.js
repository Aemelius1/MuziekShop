import Order from '../model/order.js';

const cartContainer = document.getElementById("cartContainer");

let cart = JSON.parse(localStorage.getItem("cart"));

document.getElementById("bestellen").addEventListener("click", placeOrder);
document.getElementById("emptyCartButton").addEventListener("click", emptyCart);

displayCart();

function displayCart() {
    cartContainer.innerHTML = "";
    if (cart) {
        cart.forEach((item) => {
            const row = createRow(item);
            cartContainer.appendChild(row);
        });
        const totaal = displayTotaal();
        cartContainer.append(totaal);
    }
}

function createRow(item) {
    const row = document.createElement("tr");

    const naamCell = createNameCell(item.product.naam);
    const aantalCell = createQuantityCell(item, item.aantal);
    const prijsCell = createPriceCell(item.product.prijs);
    const removeCell = createRemoveCell(item);

    row.appendChild(naamCell);
    row.appendChild(aantalCell);
    row.appendChild(prijsCell);
    row.appendChild(removeCell);

    return row;
}

function createNameCell(productName) {
    const cell = document.createElement("td");
    cell.textContent = productName;
    return cell;
}

function createQuantityCell(item, initialQuantity) {
    const cell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.value = initialQuantity;
    input.min = 1;
    input.addEventListener("change", (event) => {
        updateCartItemQuantity(item, event.target.value);
    });
    cell.appendChild(input);
    return cell;
}

function createPriceCell(productPrice) {
    const cell = document.createElement("td");
    cell.textContent = productPrice;
    return cell;
}

function createRemoveCell(item) {
    const cell = document.createElement("td");
    const removeButton = createRemoveButton(item);
    cell.appendChild(removeButton);
    return cell;
}

function createRemoveButton(item) {
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("btn", "btn-primary");
    removeButton.addEventListener("click", () => {
        removeCartItem(item);
    });
    return removeButton;
}

function calculateTotaal() {
    let totaal = 0;
    cart.forEach((item) => {
        totaal += item.product.prijs * item.aantal;
    });
    return totaal;
}

function displayTotaal() {
    const row = document.createElement("tr");
    const emptyCell1 = document.createElement("td");
    emptyCell1.textContent = "";
    row.appendChild(emptyCell1);
    const emptyCell2 = document.createElement("td");
    emptyCell2.textContent = "";
    row.appendChild(emptyCell2);
    const totaal = document.createElement("td");
    totaal.textContent = calculateTotaal();
    row.appendChild(totaal);
    const emptyCell3 = document.createElement("td");
    emptyCell3.textContent = "";
    row.appendChild(emptyCell3);
    return row;
}

function removeCartItem(item) {
    cart = cart.filter((cartItem) => cartItem !== item);
    updateCartStorageAndDisplay();
}

function updateCartItemQuantity(item, newQuantity) {
    item.aantal = parseInt(newQuantity, 10);
    updateCartStorageAndDisplay();
}

function updateCartStorageAndDisplay() {
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function placeOrder() {
    if (!cart || cart.length === 0) {
        alert("Your cart is empty. Add items to create an order.");
        return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const id = generateUniqueOrderId(orders);
    const date = Date.now();
    const totaal = calculateTotaal();
    const order = new Order(id, cart, date, totaal);
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");
    window.location.href = "./bevestiging.html";
}

function emptyCart() {
    cart = [];
    updateCartStorageAndDisplay();
}

function generateUniqueOrderId(orders) {
    const existingOrderIds = new Set(orders.map((order) => order.id));
    let orderId = 1;

    while (existingOrderIds.has(orderId)) {
        orderId++;
    }

    return orderId;
}
