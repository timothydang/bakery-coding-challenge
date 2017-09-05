import PricingItem from './pricing-item';

export default class Product {
  name: string;
  code: string;
  pricings: PricingItem[];

  constructor(name: string, code: string) {
    this.name     = name;
    this.code     = code;
    this.pricings = [];
  }

  addPricingItem(item: PricingItem) {
    this.pricings.push(item);
  }
}
