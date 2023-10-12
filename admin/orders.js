const container = document.getElementById("orderContainer");

let orders = JSON.parse(localStorage.getItem("orders"));

displayOrders();

function displayOrders() {
    container.innerHTML = "";
    if (orders) {
        orders.forEach((item) => {
            const row = createRow(item);
            container.appendChild(row);
        });
    }
}

function createRow(item) {
    const row = document.createElement("tr");

    const idCell = createIdCell(item.id);
    const totaalCell = createTotaalCell(item.totaal);
    const dateCell = createDateCell(item.date);

    row.appendChild(idCell);
    row.appendChild(totaalCell);
    row.appendChild(dateCell);

    return row;
}

function createIdCell(id) {
    const cell = document.createElement("td");
    cell.textContent = id;
    return cell;
}

function createTotaalCell(totaal) {
    const cell = document.createElement("td");
    cell.textContent = totaal;
    return cell;
}

function createDateCell(date) {
    const cell = document.createElement("td");
    cell.textContent = formatDate(date);
    return cell;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    return date.toLocaleDateString(undefined, options);
}