import Product from './../../src/models/product';
import PricingItem from './../../src/models/pricing-item';

describe('product', () => {
  it('should be constructed with named parameters', () => {
    let productA = new Product('Product A', 'Product A Code');

    expect(productA.name).toEqual('Product A');
    expect(productA.code).toEqual('Product A Code');
    expect(productA.pricings).toEqual([]);
  });

  it('should be able to add pricing line item', () => {
    let productA = new Product('Product A', 'Product A Code');

    let priceLineItemA = new PricingItem('2', '2.99');
    productA.addPricingItem(priceLineItemA);
    expect(productA.pricings.length).toEqual(1);
    expect(productA.pricings[0].quantity).toEqual(2);
    expect(productA.pricings[0].price).toEqual(2.99);

    let priceLineItemB = new PricingItem('5', '10.99');
    productA.addPricingItem(priceLineItemB);
    expect(productA.pricings.length).toEqual(2);
    expect(productA.pricings[1].quantity).toEqual(5);
    expect(productA.pricings[1].price).toEqual(10.99);
  });
});
