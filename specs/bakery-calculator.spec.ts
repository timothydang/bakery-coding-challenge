import BakeryCalculator from './../src/bakery-calculator';
import Product from './../src/models/product';
import PricingItem from './../src/models/pricing-item';
import PriceRequest from './../src/models/price-request';
import { PriceResult, PriceResultItem } from './../src/models/price-result';

describe('bakery price calculator', () => {
  it('should be constructed with data files paths', () => {
    const PRODUCT_CSV_PATH = '//dummy-path/products.csv';
    const PRICING_CSV_PATH = '//dummy-path/pricings.csv';

    let bakeryCalculator = new BakeryCalculator(PRODUCT_CSV_PATH, PRICING_CSV_PATH);
    expect(bakeryCalculator.pricingCSVPath).toEqual(PRICING_CSV_PATH);
    expect(bakeryCalculator.productCSVPath).toEqual(PRODUCT_CSV_PATH);
  });

  describe('should parse products and pricing information from csv files', () => {
    let bakeryCalculator:BakeryCalculator;
    const PRODUCT_CSV_PATH = 'data/products.csv';
    const PRICING_CSV_PATH = 'data/pricing.csv';

    afterAll(function(done) {
      done();
    });

    afterEach(function(done) {
      done();
    });

    it('and parse products information', () => {
      bakeryCalculator = new BakeryCalculator(PRODUCT_CSV_PATH, PRICING_CSV_PATH);

      bakeryCalculator.parseProductInformation(() => {
        expect(bakeryCalculator.products.length).toEqual(3);

        let firstProduct:Product = bakeryCalculator.products[0];
        expect(firstProduct.name).toEqual('Vegemite Scroll');
        expect(firstProduct.code).toEqual('VS5');

        let lastProduct:Product = bakeryCalculator.products[2];
        expect(lastProduct.name).toEqual('Croissant');
        expect(lastProduct.code).toEqual('CF');
      });
    });

    it('and parse pricings information', () => {
      bakeryCalculator.parsePricingInformation(() => {
        expect(bakeryCalculator.products.length).toEqual(3);

        let firstProduct:Product = bakeryCalculator.products[0];
        expect(firstProduct.pricings.length).toEqual(2);
        expect(firstProduct.pricings[0].price).toEqual(8.99);

        let lastProduct:Product = bakeryCalculator.products[2];
        expect(lastProduct.name).toEqual('Croissant');
        expect(lastProduct.code).toEqual('CF');
        expect(lastProduct.pricings.length).toEqual(3);
        expect(lastProduct.pricings[0].price).toEqual(16.99);
      });
    });

    it('and return pricings with givin price requests', () => {
      bakeryCalculator.parsePricingInformation(() => {
        let requestA = new PriceRequest('15', 'VS5');
        let pricingResultA: PriceResult = bakeryCalculator.getPrice(requestA) as PriceResult;

        expect(pricingResultA.quantity).toEqual(15);
        expect(pricingResultA.totalPrice).toEqual('26.97');
        expect(pricingResultA.lineItems.length).toEqual(1);
        expect(pricingResultA.lineItems[0].quantityPerItem).toEqual(5);
        expect(pricingResultA.lineItems[0].calculatedPrice).toEqual(26.97);

        let requestB = new PriceRequest('17', 'CF');
        let pricingResultB: PriceResult = bakeryCalculator.getPrice(requestB) as PriceResult;

        expect(pricingResultB.quantity).toEqual(17);
        expect(pricingResultB.totalPrice).toEqual('32.89');
        expect(pricingResultB.lineItems.length).toEqual(3);
        expect(pricingResultB.lineItems[0].quantityPerItem).toEqual(9);
        expect(pricingResultB.lineItems[0].calculatedPrice).toEqual(16.99);
        expect(pricingResultB.lineItems[1].quantityPerItem).toEqual(5);
        expect(pricingResultB.lineItems[2].calculatedPrice).toEqual(5.95);

        let requestC = new PriceRequest('3', 'MB11');
        let spyFunc = spyOn(console, 'log');
        let pricingResultC: PriceResult = bakeryCalculator.getPrice(requestC) as PriceResult;
        expect(spyFunc).toHaveBeenCalledWith('Unable to calculate cost with the given pricing');
        expect(pricingResultC).toBeNull();
      });
    });
  });

  it('should be able to return an optimal list of number required to calculate a given number', () => {
    const PRODUCT_CSV_PATH = '//dummy-path/products.csv';
    const PRICING_CSV_PATH = '//dummy-path/pricings.csv';

    let bakeryCalculator = new BakeryCalculator(PRODUCT_CSV_PATH, PRICING_CSV_PATH);

    expect(bakeryCalculator.getListOfQuantityRequired(7, [9, 5, 3])).toEqual([]);
    expect(bakeryCalculator.getListOfQuantityRequired(13, [9, 5, 3])).toEqual([5, 3]);
    expect(bakeryCalculator.getListOfQuantityRequired(15, [9, 5, 3])).toEqual([9, 3]);
    expect(bakeryCalculator.getListOfQuantityRequired(17, [9, 5, 3])).toEqual([9, 5, 3]);
    expect(bakeryCalculator.getListOfQuantityRequired(20, [9, 5, 3])).toEqual([5]);
    expect(bakeryCalculator.getListOfQuantityRequired(22, [9, 5, 3])).toEqual([5, 3]);

    expect(bakeryCalculator.getListOfQuantityRequired(7, [5, 3])).toEqual([]);
    expect(bakeryCalculator.getListOfQuantityRequired(13, [5, 3])).toEqual([5, 3]);
    expect(bakeryCalculator.getListOfQuantityRequired(15, [5, 3])).toEqual([5]);
    expect(bakeryCalculator.getListOfQuantityRequired(17, [5, 3])).toEqual([5, 3]);
    expect(bakeryCalculator.getListOfQuantityRequired(20, [5, 3])).toEqual([5]);
    expect(bakeryCalculator.getListOfQuantityRequired(22, [5, 3])).toEqual([5, 3]);

    expect(bakeryCalculator.getListOfQuantityRequired(4, [8, 5, 2])).toEqual([2]);
    expect(bakeryCalculator.getListOfQuantityRequired(7, [8, 5, 2])).toEqual([5, 2]);
    expect(bakeryCalculator.getListOfQuantityRequired(10, [8, 5, 2])).toEqual([5]);
    expect(bakeryCalculator.getListOfQuantityRequired(11, [8, 5, 2])).toEqual([5, 2]);
    expect(bakeryCalculator.getListOfQuantityRequired(14, [8, 5, 2])).toEqual([8, 2]);
    expect(bakeryCalculator.getListOfQuantityRequired(15, [8, 5, 2])).toEqual([8, 5, 2]);
    expect(bakeryCalculator.getListOfQuantityRequired(16, [8, 5, 2])).toEqual([8]);
  });
});
