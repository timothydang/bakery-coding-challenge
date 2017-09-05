import { ReadLine, createInterface } from 'readline';
import * as fs from 'fs';
import BakeryCalculator from './bakery-calculator';
import PriceRequest from './models/price-request';
import { PriceResult, PriceResultItem } from './models/price-result';

if (process.argv.length < 2) {
  console.log(`Usage: ts-node ${__filename} <external-file-path>`);
  process.exit(-1);
}

let filePath = process.argv[2];

let input: fs.ReadStream | NodeJS.ReadStream;
if(filePath) {
  input = fs.createReadStream(filePath);
} else {
  input = process.stdin;
}

const bakery = new BakeryCalculator(
  'data/products.csv',
  'data/pricing.csv'
);

bakery.init(function() {
  const readLine = createInterface({
    input: input,
    output: process.stdout,
    terminal: false
  });

  readLine.on('line', (line) => {
    if (line) {
      let priceData = line.split(' ');
      let priceRequest = new PriceRequest(
        priceData[0],
        priceData[1]
      );

      let priceResult: PriceResult | null = bakery.getPrice(priceRequest);
      if(priceResult) {
        console.log(`${priceRequest.quantity} ${priceRequest.code} $${priceResult.totalPrice}`);
        priceResult.lineItems.map((lineItem) => {
          console.log(`        ${lineItem.quantity} x ${lineItem.quantityPerItem} $${lineItem.singlePrice}`);
        })
      }
    } else {
      readLine.emit('end');
    }
  }).on('end', () => {
    process.exit();
  });

  readLine.prompt();
});

