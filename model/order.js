export default class Order {
    constructor(id, cart, date, totaal) {
        this.id = id;
        this.cart = cart;
        this.date = date;
        this.totaal = totaal;
    }
}