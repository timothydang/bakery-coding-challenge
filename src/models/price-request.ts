export default class PriceRequest {
  quantity: number;
  code: string;

  constructor(quantity: string, code: string) {
    this.quantity = parseInt(quantity);
    this.code     = code;
  }
}
