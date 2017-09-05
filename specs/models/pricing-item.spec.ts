import PricingItem from './../../src/models/pricing-item';

describe('pricing-item', () => {
  it('should be constructed with named parameters', () => {
    let priceItem = new PricingItem('2', '10.25');

    expect(priceItem.quantity).toEqual(2);
    expect(priceItem.price).toEqual(10.25);
    expect(priceItem.price).not.toEqual(2);
  });

});
