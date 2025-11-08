# Node-SEAL Basics (with explanations)

### Import the library

Emscripten-built WASM needs to be initialized **asynchronously**. Browsers and
some runtimes don't always allow a big wasm to be pulled in synchronously, so
`node-seal` exposes a factory you must `await`.

```ts
import SEAL from 'node-seal'

// returns a fully instantiated SEAL runtime (wasm + JS glue)
const seal = await SEAL()
```

---

### Encryption parameters

Creating parameters is the first and most important step. They control:

- **security** (how hard it is to break)
- **capacity** (how many operations you can do)
- **performance** (bigger params = slower/larger ciphertexts)

A good workflow is:

1. pick a scheme (`bfv`/`bgv`/`ckks`)
2. start with 128-bit security
3. start with `polyModulusDegree = 4096`
4. use helper functions to get coeff/plain modulus

```ts
// 1) choose a scheme. BFV = exact ints, CKKS = approximate reals
const scheme = seal.SchemeType.bfv

// 2) choose a security level (128-bit is a typical baseline)
const security = seal.SecLevelType.tc128

// 3) choose the polynomial modulus degree (must be power of 2)
const polyModulusDegree = 4096

// 4) for BFV, choose a plaintext modulus size (20 bits is a common start)
const plainBitSize = 20

// create the parameter container
const parms = new seal.EncryptionParameters(scheme)

// tell SEAL how big the polynomials should be
parms.setPolyModulusDegree(polyModulusDegree)

// choose coefficient moduli compatible with this degree + security
// this helper gives you a “standard” set for BFV at that degree
parms.setCoeffModulus(seal.CoeffModulus.BFVDefault(polyModulusDegree, security))

// BFV/BGV need a plaintext modulus to define the plaintext space
parms.setPlainModulus(
  seal.PlainModulus.Batching(polyModulusDegree, plainBitSize)
)
```

Notes:

- CKKS wouldn't set `PlainModulus` like this.
- You can fine-tune by giving your own coeff-modulus bit sizes.

---

### SEALContext

A `SEALContext` freezes these parameters and checks they make sense. Everything else
(keys, encoders, encryptors…) is created off the same SEALContext so they're all
compatible.

```ts
const context = new seal.SEALContext(
  parms, // the parameters we just built
  true, // expandModChain: pre-compute key switching data
  security // enforce the security level we picked
)

// always check this: if it fails, your params weren't acceptable
if (!context.parametersSet()) {
  throw new Error('Invalid encryption parameters for this SEALContext.')
}
```

---

### Keys

We need keys to encrypt/decrypt and sometimes to do advanced ops.

- **Secret key**: decrypt
- **Public key**: encrypt
- **Relinearization keys**: shrink ciphertext size after multiplies
- **Galois keys**: rotate/permute slots (for batching)

```ts
// builds a fresh key set tied to this SEALContext
const keygen = new seal.KeyGenerator(context)

const secretKey = keygen.secretKey() // for decryption
const publicKey = keygen.createPublicKey() // for encryption
const relinKeys = keygen.createRelinKeys() // for relinearization
const galoisKeys = keygen.createGaloisKeys() // for rotations (can be large)

// you can serialize to send/store
const secretB64 = secretKey.saveToBase64(seal.ComprModeType.zstd)

// and later deserialize in another process/machine
const newSecretKey = new seal.SecretKey()
newSecretKey.loadFromBase64(context, secretB64)
```

---

### Helper instances

These are the things you actually call during HE operations:

- **Encoder**: turn JS typed arrays → SEAL plaintexts (and back)
- **Encryptor**: plaintext → ciphertext
- **Decryptor**: ciphertext → plaintext
- **Evaluator**: homomorphic ops on ciphertexts (add, multiply, rotate…)

```ts
// for BFV/BGV batching
const encoder = new seal.BatchEncoder(context)
// for CKKS you'd use: const encoder = new seal.CKKSEncoder(context);

const encryptor = new seal.Encryptor(context, publicKey)
const decryptor = new seal.Decryptor(context, secretKey)
const evaluator = new seal.Evaluator(context)
```

---

### Example: encode → encrypt → operate → decrypt

```ts
// 1) start with plain JS data
const data = BigInt64Array.from([1n, 2n, 3n])

// 2) encode into a SEAL plaintext (structure suitable for HE)
const plainA = new seal.Plaintext()
encoder.encode(data, plainA)

// 3) encrypt the plaintext → ciphertext
const cipherA = new seal.Ciphertext()
encryptor.encrypt(plainA, cipherA)

// 4) homomorphic op: add ciphertext to itself
// result goes into a separate destination ciphertext
const cipherSum = new seal.Ciphertext()
evaluator.add(cipherA, cipherA, cipherSum)

// 5) decrypt back to plaintext
const plainSum = new seal.Plaintext()
decryptor.decrypt(cipherSum, plainSum)

// 6) decode back to a BigInt64Array
const decoded = encoder.decodeBigInt64(plainSum) as BigInt64Array
console.log('decoded:', decoded)
```
