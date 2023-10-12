import Product from '../model/product.js';

let producten = JSON.parse(localStorage.getItem("producten"));

const container = document.getElementById("productenContainer");
const jsonButton = document.getElementById("jsonButton");
const addProductButton = document.getElementById("addProductButton");

addProductButton.addEventListener("click", showAddModal);

jsonButton.addEventListener("click", loadData);

if (!producten) {
    loadData();
} else {
    displayProducten();
}

function loadData() {
    fetch("../producten.json")
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

function displayProducten() {
    container.innerHTML = "";
    producten.forEach((item) => {
        const row = createRow(item);
        container.appendChild(row);
    });
}

function createRow(item) {
    const row = document.createElement("tr");
    const idCell = createIdCell(item.id);
    const naamCell = createNaamCell(item.naam);
    const prijsCell = createPrijsCell(item.prijs);
    const typeCell = createTypeCell(item.type);
    const ImageCell = createImageCell(item.img);
    const editButton = createEditCell(item);
    const deleteButton = createDeleteCell(item);
    row.appendChild(idCell);
    row.appendChild(naamCell);
    row.appendChild(prijsCell);
    row.appendChild(typeCell);
    row.appendChild(ImageCell);
    row.appendChild(editButton);
    row.appendChild(deleteButton);
    return row;
}

function createIdCell(id) {
    const cell = document.createElement("td");
    cell.textContent = id;
    return cell;
}

function createNaamCell(naam) {
    const cell = document.createElement("td");
    cell.textContent = naam;
    return cell;
}

function createPrijsCell(prijs) {
    const cell = document.createElement("td");
    cell.textContent = prijs;
    return cell;
}

function createImageCell(image) {
    const cell = document.createElement("td");
    cell.textContent = image;
    return cell;
}

function createEditCell(item) {
    const cell = document.createElement("td");
    const editButton = createEditButton(item);
    cell.appendChild(editButton);
    return cell;
}

function createTypeCell(type) {
    const cell = document.createElement("td");
    cell.textContent = type;
    return cell;
}

function createEditButton(item) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-primary");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#editModal");
    editButton.addEventListener("click", () => {
        showEditModal(item);
    });
    return editButton;
}

function createDeleteCell(item) {
    const cell = document.createElement("td");
    const deleteButton = createDeleteButton(item);
    cell.appendChild(deleteButton);
    return cell;
}

function createDeleteButton(item) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.addEventListener("click", () => {
        deleteProduct(item);
    });
    return deleteButton;
}

function deleteProduct(item) {
    const productIndex = producten.findIndex((product) => product.id === item.id);
    if (productIndex !== -1) {
        producten.splice(productIndex, 1);
        localStorage.setItem("producten", JSON.stringify(producten));
        displayProducten();
    } else {
        console.error("Product not found.");
    }
}

function showEditModal(item) {
    const naamInput = document.getElementById("editNaam");
    naamInput.value = item.naam;
    const prijsInput = document.getElementById("editPrijs");
    prijsInput.value = item.prijs;
    const imgInput = document.getElementById("editImgUrl");
    imgInput.value = item.img;
    const categorieInput = document.getElementById("editCategorie");
    const beschrijvingInput = document.getElementById("editBeschrijving");
    beschrijvingInput.value = item.beschrijving;

    document.getElementById("saveButton").addEventListener("click", () => {
        editProduct(
            item,
            naamInput.value,
            prijsInput.value,
            imgInput.value,
            categorieInput.value,
            beschrijvingInput.value);
    });
}

function editProduct(item, naam, prijs, img, type, beschrijving) {
    const editedProduct = producten.find(product => product.id === item.id);
    if (editedProduct) {
        editedProduct.naam = naam;
        editedProduct.prijs = prijs;
        editedProduct.img = img;
        editedProduct.type = type;
        editedProduct.beschrijving = beschrijving;
        localStorage.setItem("producten", JSON.stringify(producten));
        const editModal = document.getElementById("editModal");
        editModal.hide();
        displayProducten();
    }
}

function showAddModal() {
    const naamInput = document.getElementById("editNaam");
    naamInput.value = "";
    const prijsInput = document.getElementById("editPrijs");
    prijsInput.value = 0;
    const imgInput = document.getElementById("editImgUrl");
    imgInput.value = "";
    const categorieInput = document.getElementById("editCategorie");
    const beschrijvingInput = document.getElementById("editBeschrijving");
    beschrijvingInput.value = "";
    document.getElementById("saveButton").addEventListener("click", () => {
        addProduct(naamInput.value, prijsInput.value, imgInput.value, categorieInput.value, beschrijvingInput.value);
    });
}

function addProduct(naam, prijs, img, type, beschrijving) {
    const id = generateProductId();
    const newProduct = new Product(id, type, naam, img, beschrijving, prijs);
    producten.push(newProduct);
    localStorage.setItem("producten", JSON.stringify(producten));
    displayProducten();
}


function generateProductId() {
    let productId = 1;
    const existingIds = new Set(producten.map((product) => product.id));

    while (existingIds.has(productId)) {
        productId++;
    }

    return productId;
}
