export class PriceResult {
  quantity: number;
  totalPrice: string | number;
  lineItems: PriceResultItem[];

  constructor(quantity: number) {
    this.quantity = quantity;
    this.totalPrice = 0;
    this.lineItems = [];
  }

  addLineItem(lineItem: PriceResultItem) {
    this.lineItems.push(lineItem);
  }

  updateTotalPrice(totalPrice: string | number) {
    this.totalPrice = totalPrice;
  }
}

export interface PriceResultItem {
  quantity: number;
  quantityPerItem: number
  singlePrice: string | number;
  calculatedPrice: string | number;
}
