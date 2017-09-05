import { PriceResult, PriceResultItem } from './../../src/models/price-result';

describe('price-result', () => {
  it('should be constructed with named parameters', () => {
    let priceResult = new PriceResult(10);

    expect(priceResult.quantity).toEqual(10);
    expect(priceResult.totalPrice).toEqual(0);
    expect(priceResult.lineItems).toEqual([]);
  });

  it('should be able to add line item', () => {
    let priceResult = new PriceResult(10);

    let lineItemA = {
      quantity: 1,
      quantityPerItem: 2,
      singlePrice: 2.99,
      calculatedPrice: 2.99
    } as PriceResultItem;

    let lineItemB = {
      quantity: 2,
      quantityPerItem: 9,
      singlePrice: 20.00,
      calculatedPrice: 40.00
    } as PriceResultItem;

    priceResult.addLineItem(lineItemA);
    expect(priceResult.lineItems.length).toEqual(1);

    priceResult.addLineItem(lineItemB);
    expect(priceResult.lineItems.length).toEqual(2);
  });

  it('should be able to update the total price to be displayed', () => {
    let priceResult = new PriceResult(10);
    priceResult.updateTotalPrice(20);

    expect(priceResult.totalPrice).toEqual(20);
  });
});
