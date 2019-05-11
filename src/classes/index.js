const Module = require('./module')

const CipherText = require('./cipher-text')
const Context = require('./context')
const Decryptor = require('./decryptor')
const DefaultParams = require('./default-params')
const EncryptionParameters = require('./encryption-parameters')
const Encryptor = require('./encryptor')
const IntegerEncoder = require('./integer-encoder')
const KeyGenerator = require('./key-generator')
const PlainText = require('./plain-text')
const PublicKey = require('./public-key')
const SchemeType = require('./scheme-type')
const SecretKey = require('./secret-key')
const SmallModulus = require('./small-modulus')

const library = new Module()
library.initialize()

module.exports = {
  Module: library,
  CipherText: new CipherText({module: library.instance}),
  Context: new Context({module: library.instance}),
  Decryptor: new Decryptor({module: library.instance}),
  DefaultParams: new DefaultParams({module: library.instance}),
  EncryptionParameters: new EncryptionParameters({module: library.instance}),
  Encryptor: new Encryptor({module: library.instance}),
  IntegerEncoder: new IntegerEncoder({module: library.instance}),
  KeyGenerator: new KeyGenerator({module: library.instance}),
  PlainText: new PlainText({module: library.instance}),
  PublicKey: new PublicKey({module: library.instance}),
  SchemeType: new SchemeType({module: library.instance}),
  SecretKey: new SecretKey({module: library.instance}),
  SmallModulus: new SmallModulus({module: library.instance})
}

