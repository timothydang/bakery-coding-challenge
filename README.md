# PH Bakery Coding Challenge

## Prerequisite
Run this to install external dependencies required.

```
npm install -g ts-node
npm install
```

## Usage
* To run the application with console prompting input

```
npm start
```

* To run the app with a test input file from `fixtures/input.txt`

```
npm run start-from-file
```

or you can point it to use with any external file path

```
ts-node src/app fixtures/input.txt
```


* To run the Jasmine test suite

```
npm test
```
