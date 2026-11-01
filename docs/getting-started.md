# Getting started

This example follows a small encrypted request: the owner encrypts integers,
serializes a ciphertext, sends it for computation, and decrypts the returned
result. The computation doubles each value without decrypting it.

Save this as `example.mjs` with node-seal installed and run `node example.mjs`.
The example uses `using`; see [object lifetime](advanced.md#object-lifetime)
if your runtime needs manual cleanup.

```javascript
import SEAL from 'node-seal'

const seal = await SEAL()
const degree = 4096
const security = seal.SecLevelType.tc128
const mode = seal.ComprModeType.zstd

using parameters = new seal.EncryptionParameters(seal.SchemeType.bfv)
using coeffModulus = seal.CoeffModulus.BFVDefault(degree, security)
using plainModulus = seal.PlainModulus.Batching(degree, 20)
parameters.setPolyModulusDegree(degree)
parameters.setCoeffModulus(coeffModulus)
parameters.setPlainModulus(plainModulus)

using context = new seal.SEALContext(parameters, true, security)
if (!context.parametersSet()) {
  throw new Error(context.parameterErrorMessage())
}

using keygen = new seal.KeyGenerator(context)
using publicKey = keygen.createPublicKey()
using secretKey = keygen.secretKey()
using encoder = new seal.BatchEncoder(context)
using encryptor = new seal.Encryptor(context, publicKey)
using decryptor = new seal.Decryptor(context, secretKey)
using evaluator = new seal.Evaluator(context)

// Client: encode and encrypt the input.
const values = BigInt64Array.from([1n, 2n, 3n])
using plain = new seal.Plaintext()
encoder.encode(values, plain)
using cipher = new seal.Ciphertext()
encryptor.encrypt(plain, cipher)
const requestBytes = cipher.saveToArray(mode)

// Send requestBytes from the client to the server.

// Server: load and compute using the same parameters. No secret key is needed.
using received = new seal.Ciphertext()
received.loadFromArray(context, requestBytes)
evaluator.addInplace(received, received)
const responseBytes = received.saveToArray(mode)

// Send responseBytes from the server back to the client.

// Client: load and decrypt the result.
using result = new seal.Ciphertext()
result.loadFromArray(context, responseBytes)
decryptor.decrypt(result, plain)
const decoded = encoder.decodeBigInt64(plain)
console.log(Array.from(decoded.slice(0, values.length)))
// [2n, 4n, 6n]
```

`saveToArray()` returns a `Uint8Array` that can be sent or stored. The receiving
side loads it using the same encryption parameters. This example keeps both
sides in one program; in an application, the secret key stays with the owner.

Use `saveToBase64(mode)` and `loadFromBase64(context, text)` when a string is
more convenient. Parameters can also be saved and loaded; their
`loadFromArray(bytes)` method does not take a context.

These parameters are enough for this addition example. See
[advanced usage](advanced.md) for choosing a scheme, planning your parameters,
and reducing key and ciphertext sizes.
