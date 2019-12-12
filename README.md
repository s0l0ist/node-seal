# node-seal

A zero-dependency Web Assembly port of the C++ [Microsoft SEAL](https://github.com/microsoft/SEAL) library.

**Now supporting Microsoft SEAL 3.4.5**

It contains a low level API which is very close to the C++ calls from Microsoft SEAL.

# Demo
### Go to [morfix.io/sandbox](https://morfix.io/sandbox)

This sandbox was built for users to experiment and learn how to use Microsoft SEAL. It uses
 [node-seal](https://github.com/morfix-io/node-seal) inside a WebWorker.
 
Not all functionality is implemented. For example:
 - No Integer Encoder is present - Almost everything can be implemented with the Batch Encoder.
 - Generating and attempting to download Galois Keys at PolyModulus Degree of `16384` with `128` security will
  result in a crash due to the browser running out of memory and the page will need to be refreshed.

# Microsoft SEAL

Microsoft SEAL is an easy-to-use open-source ([MIT licensed](LICENSE)) homomorphic
encryption library developed by the Cryptography and Privacy Research group at
Microsoft. Microsoft SEAL is written in modern standard C++ and has no external
dependencies, making it easy to compile and run in many different environments.
For more information about the Microsoft SEAL project, see
[sealcrypto.org](https://www.microsoft.com/en-us/research/project/microsoft-seal).

This document pertains to Microsoft SEAL version 3.4. Users of previous versions
of the library should look at the [list of changes](https://github.com/microsoft/SEAL/blob/master/Changes.md).

# License

[MIT license](LICENSE)

# Installation

npm:
```
npm install node-seal
```

yarn:
```
yarn add node-seal
```

# Usage

[Checkout the basics](docs/USAGE.md)

For those who are curious about the security of Microsoft SEAL, please
refer to [HomomorphicEncryption.org](http://homomorphicencryption.org/)

# Examples

Check out the [Sandbox](https://morfix.io/sandbox) to run HE functions and even generate working code!

If you'd rather read an example then take a look [here](docs/FULL-EXAMPLE.md).

For more exhaustive examples, view the tests [here](src/test).

# Changes

[See the version changes](CHANGES.md)

# Caveats

Conversion from C++ to Web Assembly has some limitations. In addition, the 
SEAL library itself demands some constraints on the size of arrays as well as
their max / min values.

[See limitations](docs/CAVEATS.md)


# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
