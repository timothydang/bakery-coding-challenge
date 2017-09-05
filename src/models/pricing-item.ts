export default class PricingItem {
  quantity: number;
  price: number;

  constructor(quantity: string, price: string) {
    this.quantity = parseInt(quantity);
    this.price    = parseFloat(price);
  }
}
