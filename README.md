*** PH Bakery Coding Challenge ***

## Prerequisite
Run this to install external dependencies required to run.

```
npm install -g ts-node
yarn install
```

## Usage
* To run the application with console prompting input

```
npm start
```

* To run the app with a test input file from `fixtures/input.txt`

```
npm start-from-file
```

or you can point it to use with any external file path

```
ts-node src/app fixtures/input.txt
```


* To run the Jasmine test suite

```
npm test
```
