# [node-seal](https://morfix.io/sandbox)  &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/morfix-io/node-seal/blob/master/LICENSE) [![CodeFactor](https://www.codefactor.io/repository/github/morfix-io/node-seal/badge)](https://www.codefactor.io/repository/github/morfix-io/node-seal) [![DeepScan grade](https://deepscan.io/api/teams/6431/projects/8438/branches/100710/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6431&pid=8438&bid=100710) [![npm version](https://badge.fury.io/js/node-seal.svg)](https://www.npmjs.com/package/node-seal)

node-seal is a homomorphic encryption library in JavaScript.

* **Web Assembly:** Fastest web implementation of the C++ [Microsoft SEAL](https://github.com/microsoft/SEAL) library
* **Zero dependencies:** Very lean, only contains a low level API which is very close to the C++ calls from Microsoft SEAL.
* **Node.js or the browser:** Install once, work in any server/client configuration.

**Now supporting Microsoft SEAL 3.4.5**

## Installation

node-seal can be installed with your favorite package manager:
```
npm install node-seal
```
```
yarn add node-seal
```

## Demo

Go to [morfix.io/sandbox](https://morfix.io/sandbox)

This sandbox was built for users to experiment and learn how to use Microsoft SEAL featuring node-seal.

* **Encryption Parameters:** experiment with many settings to prototype a context.
* **Keys:** Create, download, upload Secret/Public Keys - even for  Relinearization and Galois Keys.
* **Variables:** Create, download, upload PlainTexts or CipherTexts
* **Functions:** Create a list of HE functions to execute!
* **Code Generation:** After your experimentation is complete, generate working code to use!

## Usage

Checkout the [basics](USAGE.md)

## Documentation

View the latest docs [here](https://htmlpreview.github.io/?https://github.com/morfix-io/node-seal/blob/master/docs/index.html)

## Examples

Check out the [Sandbox](https://morfix.io/sandbox) to run HE functions and even generate working code!

If you'd rather read an example, take a look [here](FULL-EXAMPLE.md).

For more exhaustive examples, view the tests [here](src/test).

## Changes

For changes in this library, take a look [here](CHANGES.md).

For changes in Microsoft SEAL, 
take a look at their [list of changes](https://github.com/microsoft/SEAL/blob/master/Changes.md).

## Caveats

Conversion from C++ to Web Assembly has some limitations:

* **±2^53 bit numbers:** JavaScript uses 2^53 numbers (not true 64 bit). Values higher than these 
  will typically result in inaccuracies. `BFV` users will inherently adhere to these 
  limitations due to the Int32/UInt32 TypedArrays. `CKKS` users will need to keep this in mind.
  
* **Memory:** Generating large keys and saving them in the browser could be problematic.
  We can control NodeJS heap size, but not inside a user's browser. 
  
  Saving keys is very memory intensive especially for `polyModulusDegrees`s above `16384`. 
  This is because there's currently no way (that we have found) to use io streams 
  across JS and Web Assembly code, so the strings have to be buffered completely in RAM and 
  they can be very, very large. This holds especially true for `GaloisKeys` where you may hit
  JS max string limits (256MB).
  
* **Garbage Collection:** Unfortunately, the typical way of cleaning up dereferenced JS objects will
  leave behind a the Web Assembly (C++) object in memory. There is no way to automatically call the destructors
  on C++ objects. JavaScript code must explicitly delete any C++ object handles it has received, or the 
  heap will grow indefinitely.
  
  ```
  <instance>.delete()
  ```

## Contributing

The main purpose of this library is to continue to 
evolve and promote the adoption of homomorphic encryption 
(using Microsoft SEAL) in modern
web applications today. Development of node-seal happens 
in the open on GitHub, and we are grateful to the community for 
contributing bugfixes and improvements.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

node-seal is [MIT licensed](LICENSE).
