import * as parse from 'csv-parse';
import * as async from 'async';
import * as fs from 'fs';
import Product from './models/product';
import PricingItem from './models/pricing-item';
import PriceRequest from './models/price-request';
import { PriceResult, PriceResultItem } from './models/price-result';

const PARSER_OPTIONS = {
  delimiter: ',',
  columns: true
}

export default class BakeryCalculator {
  products: Product[];
  pricing: PricingItem[];
  productCSVPath: string;
  pricingCSVPath: string
  pricingCallback: Function;

  constructor(productPath: string, pricingPath: string) {
    this.productCSVPath = productPath;
    this.pricingCSVPath = pricingPath;
    this.products = [];
    this.pricing = [];
  }

  init(callback: Function) {
    this.pricingCallback = callback;

    this.parseProductInformation(this.parsePricingInformation);
  }

  parseProductInformation(callback: Function) {
    let parser = parse(PARSER_OPTIONS, (err, productsData) => {
      if(productsData) {
        productsData.forEach((productData: any) => {
          let product = new Product(
            productData.name,
            productData.code
          )
          this.products.push(product);
        });

        if(callback) {
          callback.apply(this, [this.pricingCallback]);
        }
      }
    });

    fs.createReadStream(this.productCSVPath).pipe(parser);
  }

  parsePricingInformation(callback: Function) {
    let parser = parse(PARSER_OPTIONS, (err, pricingData) => {
      if(pricingData) {
        pricingData.forEach((pricingData: any) => {
          let product = this.products.find((item) => {
            return item.code === pricingData.code;
          });

          if(product) {
            let pricingItem = new PricingItem(
              pricingData.quantity,
              pricingData.price
            )
            product.addPricingItem(pricingItem);
          }
        });

        // Sort product pricings from desencing order of quantity
        this.products.map((product) => {
          product.pricings.sort((a, b) => {
            return b.quantity - a.quantity;
          });
        })

        if(callback) {
          callback.apply(this);
        }
      }
    });

    fs.createReadStream(this.pricingCSVPath).pipe(parser);
  }

  getPrice(priceRequest: PriceRequest) {
    let product = this.products.find((item) => {
      return item.code === priceRequest.code;
    });

    let price = null;

    if(!product) {
      console.log('Invalid product code');
      return null;
    }

    let amount = priceRequest.quantity;
    let pricingItems = product.pricings;

    let quantityList: number[] = [];
    pricingItems.map((item) => {
      quantityList.push(item.quantity);
    });

    // Get all the quantity required to make up the amount of item order
    let listOfQuantity = this.getListOfQuantityRequired(amount, quantityList);
    if(listOfQuantity.length === 0) {
      console.log('Unable to calculate cost with the given pricing');
      return null;
    }

    let totalPrice = 0;
    let remainingAmount = amount;
    let priceResult = new PriceResult(amount);
    let listOfPriceItem: PricingItem[] = [];

    // Convert the result reduced array back to a list of price items
    listOfQuantity.map((item:number, index:number) => {
      let priceItem = pricingItems.find((i) => {
        return i.quantity === item;
      });
      if(priceItem) {
        listOfPriceItem.push(priceItem);
      }
    });

    // Looping through all line items
    let i = 0;
    let isCorrectQuantity = false;

    while(i < listOfPriceItem.length) {
      let currentPriceItem = listOfPriceItem[i];
      let nextPriceItem = listOfPriceItem[i + 1];
      let quantityOfPriceItem = Math.floor(remainingAmount / currentPriceItem.quantity);

      let remainingCount = remainingAmount;
      let reducedList = listOfPriceItem.slice(i+1);
      let j = 0;

      while(reducedList && j < reducedList.length) {
        nextPriceItem = reducedList[j];

        if(nextPriceItem) {
          remainingCount -= quantityOfPriceItem * currentPriceItem.quantity;

          if(remainingCount % nextPriceItem.quantity === 0) {

            // Mark this as the correct quantity
            isCorrectQuantity = true;
            break;
          } else {
            remainingCount = remainingCount % nextPriceItem.quantity;
          }
        }
        j++;
      }

      // If it isn't the correct quantity that we're looking for
      // Try to reduce it to the correct quantity

      if(!isCorrectQuantity) {
        if(nextPriceItem) {
          while((remainingAmount - currentPriceItem.quantity * quantityOfPriceItem) % nextPriceItem.quantity !== 0) {
            quantityOfPriceItem--;
          }
        }
      }

      if(quantityOfPriceItem <= 0) {
        quantityOfPriceItem = 1;
      }

      let itemPrice = quantityOfPriceItem * currentPriceItem.price;
      totalPrice += itemPrice;
      remainingAmount -= currentPriceItem.quantity * quantityOfPriceItem;

      // Add line item to the result object
      priceResult.addLineItem({
        quantity: quantityOfPriceItem,
        quantityPerItem: currentPriceItem.quantity,
        singlePrice: currentPriceItem.price,
        calculatedPrice: itemPrice
      } as PriceResultItem);

      i++;
    }

    priceResult.updateTotalPrice(totalPrice.toFixed(2));
    return priceResult;
  }

  getListOfQuantityRequired(amount:number, list:number[]) {
    let i = 0;
    let listOfQuantity = [];
    const smallestQuantityNumber = Math.min.apply(Math, list);
    let nextDenominator = 0;

    while(i < list.length && amount > 0) {
      if(amount < list[i]) {
        i++;
        continue;
      }

      if(amount % list[i] === 0) {
        listOfQuantity.push(list[i]);
        amount = 0;
      } else {
        let j = 1;
        let nextDenominator = 0;
        let reducingAmount = 0;
        let amountToTest = amount % list[i];

        while(i + j < list.length) {
          nextDenominator = list[i + j];

          let previousAmountToTest = 0;
          while(amountToTest < nextDenominator) {
            reducingAmount = Math.abs(Math.floor(amount / list[i]) - j);
            amountToTest = amount % (reducingAmount * list[i]);

            if(amountToTest === previousAmountToTest) {
              break;
            } else {
              previousAmountToTest = amountToTest;
            }

            if(amountToTest === 1) {
              amountToTest = amount - (reducingAmount * list[i]);
            }

            if(amountToTest % nextDenominator === 1) {
              reducingAmount--;
              amountToTest = amount - (reducingAmount * list[i]);
              break;
            }
          }

          if((amountToTest % nextDenominator) === 0) {
            listOfQuantity.push(list[i]);
            if(reducingAmount !== 0) {
              amount -= reducingAmount * list[i];
            } else {
              amount -= Math.floor(amount / list[i]) * list[i];
            }
            break;
          }
          amountToTest = amountToTest % list[i+j];
          j++;
        }

      }
      i++;
    }
    return listOfQuantity;
  }
}
