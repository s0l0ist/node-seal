# Getting started

This example uses BFV to double encrypted integers, then decrypts the result.
Save it as `example.mjs` in a project with node-seal installed and run
`node example.mjs`. It uses `using` for cleanup; see
[object lifetime](advanced.md#object-lifetime) for the manual alternative.

```javascript
import SEAL from 'node-seal'

const seal = await SEAL()
const degree = 4096
const security = seal.SecLevelType.tc128

// Parameters and context.
using encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
using coeffModulus = seal.CoeffModulus.BFVDefault(degree, security)
using plainModulus = seal.PlainModulus.Batching(degree, 20)
encParms.setPolyModulusDegree(degree)
encParms.setCoeffModulus(coeffModulus)
encParms.setPlainModulus(plainModulus)

using context = new seal.SEALContext(encParms, true, security)
if (!context.parametersSet()) {
  throw new Error(context.parameterErrorMessage())
}

// Keys and helpers.
using keygen = new seal.KeyGenerator(context)
using publicKey = keygen.createPublicKey()
using secretKey = keygen.secretKey()
using encoder = new seal.BatchEncoder(context)
using encryptor = new seal.Encryptor(context, publicKey)
using decryptor = new seal.Decryptor(context, secretKey)
using evaluator = new seal.Evaluator(context)

// Encrypt and calculate.
const data = BigInt64Array.from([1n, 2n, 3n])
using plain = new seal.Plaintext()
encoder.encode(data, plain)
using cipher = new seal.Ciphertext()
encryptor.encrypt(plain, cipher)
evaluator.addInplace(cipher, cipher)

// Decrypt the result.
decryptor.decrypt(cipher, plain)
const decoded = encoder.decodeBigInt64(plain)
console.log(Array.from(decoded.slice(0, data.length)))
// [2n, 4n, 6n]
```

Continue with [advanced usage](advanced.md) for JavaScript integration.
