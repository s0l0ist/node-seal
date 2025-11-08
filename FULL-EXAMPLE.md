# Full Example

CommonJS (but also works with `import`)

```javascript
import SEAL from "node-seal";

// load wasm
const seal = await SEAL();

// ----- 1. params/context -----
const scheme = seal.SchemeType.bfv;
const security = seal.SecLevelType.tc128;
const polyModulusDegree = 4096;

const parms = new seal.EncryptionParameters(scheme);
parms.setPolyModulusDegree(polyModulusDegree);
parms.setCoeffModulus(
  seal.CoeffModulus.BFVDefault(polyModulusDegree, security)
);
parms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, 20));

const context = new seal.SEALContext(parms, true, security);
if (!context.parametersSet()) {
  throw new Error("SEAL context: invalid parameters");
}

// ----- 2. helpers / keys -----
const encoder = new seal.BatchEncoder(context);
const keygen = new seal.KeyGenerator(context);
const publicKey = keygen.createPublicKey();
const secretKey = keygen.secretKey();

const encryptor = new seal.Encryptor(context, publicKey);
const decryptor = new seal.Decryptor(context, secretKey);
const evaluator = new seal.Evaluator(context);

// ----- 3. encode + encrypt -----
const data = BigInt64Array.from([1n, 2n, 3n, 4n, 5n]);

const plain = new seal.Plaintext();
encoder.encode(data, plain);

const cipher = new seal.Ciphertext();
encryptor.encrypt(plain, cipher);

// ----- 4. operate on ciphertext -----
evaluator.addInplace(cipher, cipher); // ciphertext = ciphertext + ciphertext

// ----- 5. decrypt + decode -----
decryptor.decrypt(cipher, plain);
const decoded = encoder.decodeBigInt64(plain) as BigInt64Array;

console.log("decoded:", decoded);
```
