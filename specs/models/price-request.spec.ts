import PriceRequest from './../../src/models/price-request';

describe('price-request', () => {
  it('should be constructed with named parameters', () => {
    let priceRequest = new PriceRequest('10', 'Product Code');

    expect(priceRequest.quantity).toEqual(10);
    expect(priceRequest.code).toEqual('Product Code');
  });
});
