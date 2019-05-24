const { Module } = require('./src')

Module.then((Crypt) => {

  const parms = Crypt.createParams({security: 'low'})
  Crypt.initialize({...parms, schemeType: 'BFV'})
  // Print the context for debugging
  Crypt._Context.print()

  console.log('Parameter set?: ', Crypt._Context.parametersSet())
  console.log('firstParmsId: ', Crypt._Context.firstParmsId())
  let asdf = Crypt._Context.firstParmsId()

  console.log('lastParmsId: ', Crypt._Context.lastParmsId())


  console.log('Generating keys...')
  Crypt.genKeys()
  console.log('Generating keys...done')


  // console.log('Gen Relin keys...')
  // Crypt.genRelinKeys()
  // console.log('Gen Relin keys...done')
  //
  // console.log('Gen Galois keys...')
  // Crypt.genGaloisKeys()
  // console.log('Gen Galois keys...done')
  //
  // console.log('Saving keys...')
  // let publicKeyEncoded = Crypt.savePublicKey()
  // let secretKeyEncoded = Crypt.saveSecretKey()
  // let relinKeysEncoded = Crypt.saveRelinKeys()
  // let galoisKeysEncoded = Crypt.saveGaloisKeys()
  // console.log('Saving keys...done')

  /**
   * For BFV
   *
   * If we are using `int32` then the maximum value for any element in the array
   * has to be __less_than_half__ of the `plainModulus` size (default = 786433, half = 393216.5)
   *
   * If we are using `uint32` then the max value for any element in the array
   * has to be __less_than__ `plainModulus` (default = 786433)
   *
   * The length of the array must also not exceed `polyDegree`
   *
   */
  console.log('Encrypting data...')
  let encrypted;

  const step = parms.plainModulus / parms.polyDegree
  encrypted = Crypt.encrypt({value: Array.from({length: parms.polyDegree}).map(
      (x, i) =>  {
        if (i >= (parms.polyDegree / 2)) {
          return Math.floor((parms.plainModulus - (step * i)))
        }
        return  Math.ceil(-(step + (step * i)))
      }),
    type: 'int32'
  })
  /**
   * For CKKS
   *
   * If we are using `double` then the maximum value for any element in the array
   * has to be __less than__ the maximum safe value of __2^53__. Any higher and
   * javascript begins to have rounding errors.
   *
   * The length of the array must also not exceed `polyDegree` / 2
   *
   * @type {*|CipherText}
   */
// encrypted = Crypt.encrypt({value: Array.apply(null, Array(parms.polyDegree/2)).map((x, i) =>  ((Math.pow(2, 53) - 0) - i)), type: 'double'})
  console.log('Encrypting data...done')

// TODO: Fix the return value. This is a struct so it craps out...
// console.log('encrypted parmsId:', encrypted.parmsId())
// console.log('encrypted scale:', encrypted.scale())


// console.log('Generating NEW keys...')
// Crypt.genKeys()
// console.log('Generating NEW keys...done')

// console.log('Reloading keys...')
// Crypt.loadPublicKey({encoded: publicKeyEncoded})
// Crypt.loadSecretKey({encoded: secretKeyEncoded})
// Crypt.loadRelinKeys({encoded: relinKeysEncoded})
// Crypt.loadGaloisKeys({encoded: galoisKeysEncoded})
// console.log('Reloading keys...done')

  console.log('Decrypting data...')
  let decrypted = Crypt.decrypt({cipherText: encrypted})
  console.log('Decrypting data...done')
})
