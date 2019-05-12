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
    this.module.SmallModulus.setValue({value: 256})

    this.module.EncryptionParameters.initialize({
      schemeType: schemeType,
      polyDegree: 2048,
      coeffModulus: this.module.DefaultParams.coeffModulus128({value: 2048}),
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
    const plainText = this.module.IntegerEncoder.encodeInt32({value})


    this.module.PlainText.initialize()
    this.module.PlainText.inject({instance: plainText})

    this.module.CipherText.initialize()
    const cipherText = this.module.CipherText.instance
    this.module.Encryptor.encrypt({plainText, cipherText})
    return this.module.CipherText
  }

  decrypt({cipherText}) {
    this.module.PlainText.initialize()
    const plainText = this.module.PlainText.instance
    this.module.Decryptor.decrypt({cipherText: cipherText.instance, plainText})
    return this.module.IntegerEncoder.decodeInt32({plainText})
  }

  publicKey() {
    return this.module.PublicKey.save()
  }

  secretKey() {
    return this.module.SecretKey.save()
  }

  loadEncodedCipher({encoded}) {
    console.log('context:', this.module.Context.instance)
    this.module.CipherText.load({context: this.module.Context.instance, encoded})
  }
}

module.exports = new Crypt()
