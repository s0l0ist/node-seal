const library = require('../classes')

class Crypt {
  constructor() {
    this.module = library
  }

  set module(m) {
    this._module = m
  }
  get module() {
    return this._module
  }

  schemeType({type}) {
    switch (type) {
      case 'BFV': return this.module.SchemeType.BFV
      case 'CKKS': return this.module.SchemeType.CKKS
      default: return this.module.SchemeType.BFV
    }
  }

  initializeLow({schemeType}) {

    this.module.SmallModulus.initialize()
    this.module.SmallModulus.setValue({value: 8192})

    this.module.EncryptionParameters.initialize({
      schemeType: schemeType,
      polyDegree: 8192,
      coeffModulus: this.module.DefaultParams.coeffModulus128({value: 8192}),
      plainModulus: this.module.SmallModulus.instance
    })

    this.module.Context.initialize({
      encryptionParams: this.module.EncryptionParameters.instance,
      expandModChain: true
    })

    // Print
    this.module.Context.print()

    this.module.IntegerEncoder.initialize({
      context: this.module.Context.instance
    })

  }

  genKeys() {
    this.module.KeyGenerator.initialize({
      context: this.module.Context.instance
    })

    this.module.PublicKey.initialize()
    this.module.PublicKey.inject({instance: this.module.KeyGenerator.getPublicKey()})

    this.module.SecretKey.initialize()
    this.module.SecretKey.inject({instance: this.module.KeyGenerator.getSecretKey()})

    this.module.Encryptor.initialize({
      context: this.module.Context.instance,
      publicKey: this.module.PublicKey.instance
    })

    this.module.Decryptor.initialize({
      context: this.module.Context.instance,
      secretKey: this.module.SecretKey.instance
    })
  }

  encrypt({value}) {
    const plainText = (this.module.IntegerEncoder.encodeInt32({value})).instance
    const cipherText = (this.module.CipherText.initialize()).instance
    this.module.Encryptor.encrypt({plainText, cipherText})
    return this.module.CipherText
  }

  decrypt({cipherText}) {
    const plainText = (this.module.PlainText.initialize()).instance
    this.module.Decryptor.decrypt({cipherText, plainText})
    return this.module.IntegerEncoder.decodeInt32({plainText})
  }

  publicKey() {
    return this.module.PublicKey.save()
  }

  secretKey() {
    return this.module.SecretKey.save()

  }
}

module.exports = new Crypt()
