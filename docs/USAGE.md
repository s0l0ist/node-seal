# The Basics

There are two __Scheme Types__ that SEAL supports:
- `BFV` operates on Int32/UInt32
- `CKKS` operates on JS Float (Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER)

`BFV` is used to encrypt/decrypt on real integers whereas `CKKS` is used for floats.
However, there are additional differences. `CKKS` delivers an _approximate_ result 
back to you. Ex. A decrypted `CKKS` cipher may be a few decimals off depending on 
several factors. If 100% accuracy is needed, use `BFV`. However, `BFV` is limited by the
minimum and maximum values depending on the encryption parameters whereas `CKKS` is typically
not limited in min/max values (other than +- 2^53 due to JS Numbers not representing
true 64 bit values)

There are several __Keys__ in SEAL:
- `PublicKey` used to encrypt data
- `SecretKey` used to decrypt data
- `RelinKeys` used to extend the number of homomorphic evaluations on a given cipher
- `GaloisKeys` used to perform matrix rotations on a cipher

You may generate and share `RelinKeys` and `GaloisKeys` with a 3rd party where
they could be used in an untrusted execution environment. You may also share the `PublicKey`
as the name implies. This allows 3rd parties to perform homomorphic evaluations on the
ciphers that were encrypted by the `SecretKey`. Never share your `SecretKey` unless you _want_
others to decrypt the data.

#### Note on homomorphic evaluations:
Microsoft SEAL is not a fully homomorphic encryption library and as such, encrypted ciphers 
have a limit on the total number of evaluations performed before decryption fails, thus 
limiting the circuit depth of a homomorphic function. When designing a 
leveled homomorphic algorithm, you can test the limits to see where decryption fails and where
you can increase the `computationLevel` or use the raw SEAL api to further fine tune the parameters.

# Usage

Steps:
1. Import the library
2. Create encryption parameters and initialize the context 
   (sets the library to work in a given constraint of parameters)
3. Create or load previously generated public/secret keys
4. Create some data to encrypt. Save it, send it to a 3rd party for evaluation, or evaluate locally
5. Decrypt the encrypted cipher result

### Import / require the library

Due to limitations with how the WASM file is loaded, 
we need to await on the main library in order to have
a fully instanciated instance. This limitation mostly
because of how chrome limits the size of synchronously
loaded WASM files. Therefore, loading must be done 
asynchronously.

```
(async () => {

  // Due to limitations with how the WASM file is loaded, 
  // we need to await on the main library in order to have
  // a fully instanciated instance. This limitation mostly
  // because of how chrome limits the size of synchronously
  // loaded WASM files. Therefore, loading must be done 
  // asynchronously.
  
  // If you're using a tool to bundle, such as webpack, you may omit 
  // the `require` line for testing inside a browser.
  const { Seal } = require('node-seal')
  const Morfix = await Seal
  
})()
```

### Creating parameters

There are 3 different computationLevel's that have been predefined
for ease of use. `low`, `medium`, and `high`. The computation levels
allow for more homomorphic operations __on__ encrypted cipherText's
at the cost of more CPU/memory.

Security is by default `128` bits, but can be changed to `192` or `256` bits again 
at the cost of more CPU/memory.

The computation level and security settings that you choose 
here limit the total number of elements in an array as well
as their min/max values.

You're free to use this helper to auto generate parameters used to initialize 
SEAL. These can be manually created using the low level APIs as well.

```
const parms = Morfix.createParams({computationLevel: 'low', security: 128})
```

### Initialize Seal

SEAL supports two encryption schemes, `BFV` and `CKKS`. Depending on the type of
data you wish to encrypt, select the appropriate scheme.

`BFV` operates on Int32/UInt32

`CKKS` operates on JS Float (Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER)

```
  Morfix.initialize({...parms, schemeType: 'BFV'})
  
  // - or - 
  
  Morfix.initialize({...parms, schemeType: 'CKKS'})
```

### Generate Keys

#### Public / Secret Keys

Can be generated, saved to a base64 string, or loaded from a base64 string

```
  Morfix.genKeys()
  
  // Save the keys
  const publicKey = Morfix.savePublicKey()
  const secretKey = Morfix.saveSecretKey()
  
  // You can skip `Morfix.genKeys()` by loading them instead 
  Morfix.loadPublicKey({encoded: publicKey})
  Morfix.loadSecretKey({encoded: secretKey})

```

#### Relin Keys

Can be generated, saved to a base64 string, or loaded from a base64 string

```
  Morfix.genRelinKeys()
  
  // Save the keys
  const relinKeys = Morfix.saveRelinKeys()
  
  // You can skip `Morfix.genRelinKeys()` by loading them instead 
  Morfix.loadRelinKeys({encoded: relinKeys})
```

#### Galois Keys

Can be generated, saved to a base64 string, or loaded from a base64 string.
Please note generating Galois keys can take a long time and the output is **very** large.

```
  Morfix.genGaloisKeys()
  
  // Save the keys
  const galoisKeys = Morfix.saveGaloisKeys()
  
  // You can skip `Morfix.genGaloisKeys()` by loading them instead 
  Morfix.loadGaloisKeys({encoded: galoisKeys})
```

### Creating data to encrypt

Creating values can be a bit tricky. SEAL has limitations on the length
of the array __and__ a limit on the minimum and maximum values of each
array element depending on the Encryption Parameters and Scheme Type used
to initialize the library. There is also no way to detect an overflow during
homomorphic evaluations, but you may attempt to increase the `plainModulus` 
value. This comes with its own caveats as well, larger `plainModulus` allows
higher values to be encrypted, but increases the noise budget which lowers the
amount of homomorphic evaluations that can also be performed.

For `BFV`:
 
Max array length = `polyModulusDegree`.

We have two types __Int32__ and __UInt32__ with the following restrictions:


* Int32, valid range is from `-1/2 * plainModulus` to `1/2 * plainModulus`
* UInt32, valid range is from `0` to `plainModulus - 1`

`BFV` Example Data
```
/*
  Create an array of max length `polyModulusDegree` with elements that
  are in the valid range.
 
  Create data to be encrypted (connect the dots). Saw tooth about the x-axis.
 
   |            .             |   <- (Max value) Y = + 1/2 (plainModulus)
   |                   .      |
   |. _______________________.|   <- Y = 0
   |      .                   |
   |            .             |   <- (Min value) Y =  - 1/2 (plainModulus)
   ^.           ^.            ^.
     `-> X = 0    `-> X = 2048  `-> X = 4095 (max length, `polyModulusDegree`)
 
*/
const step = parms.plainModulus / parms.polyModulusDegree // ~192.00024
const array = Int32Array.from({length: parms.polyModulusDegree}).map(
 (x, i) =>  {
   if (i >= (parms.polyModulusDegree / 2)) {
     return Math.floor((parms.plainModulus - (step * i)))
   }
   return  Math.ceil(-(step + (step * i)))
 })
})
```

For `CKKS`:

Max array length = `polyModulusDegree / 2`.

There is only one type, __Double__ with the following restrictions:

* A JS Number between -(2^53 - 1) <-> + (2^53 - 1)

`CKKS` Example Data
```
/*
  Create an array of max length `polyModulusDegree / 2` with elements that
  are in the valid range.
 
  Create data to be encrypted (connect the dots). Saw tooth about the x-axis.
 
   |            .             |   <- (Max value) Y = (2^53 - 1)
   |                   .      |
   |.________________________.|   <- Y = 0
   |      .                   |
   |            .             |   <- (Min value) Y = -(2^53 - 1)
   ^.           ^.            ^.
     `-> X = 0    `-> X = 1024  `-> X = 2048 (max length, `polyModulusDegree` / 2)
 
*/

// Create data to be encrypted
const arraySize = parms.polyModulusDegree / 2
const step = Number.MAX_SAFE_INTEGER / arraySize // (2^53 - 1) / (polyModulusDegree / 2)

const array = Float64Array.from({length: arraySize})
  .map( (x, i) =>  {
    if (i >= (arraySize / 2)) {
      return Number.MAX_SAFE_INTEGER - (step * i)
    }
    return -(step * i)
})
```

### Encrypt data

Encryption is easily performed by passing an array to the `array` parameter
of the `encrypt` function.

There are helper methods to save and revitalize a cipher. When reviving a cipher, there
will need to be additional attributes set on the instance using the `set...` functions.
This is to ensure decryption will go smoothly.

```

const oldCipherText = Morfix.encrypt({array: Int32Array.from([1,2,3]})

  
// You can save the oldCipherText as a base64 string
const base64Cipher = oldCipherText.save()

// Revive a cipher from a cipherText base64 string
const revivedCipherText = Morfix.loadCipher({encoded: base64Cipher})

// But you will need to reinitialize some values. It would be best
// to also serialize this data in combination with the raw cipherText
// so that you may retrieve all the related information in one go.

revivedCipherText.setSchemeType({scheme: oldCipherText.getSchemeType()})
revivedCipherText.setVectorSize({size: oldCipherText.getVectorSize()})
revivedCipherText.setVectorType({type: oldCipherText.getVectorType()})
```

### Decrypt data

Decryption is performed similarly to encryption. The returned Array is a type
of TypedArray that was originally encrypted. 

```
const cipherText = Morfix.encrypt({array: Int32Array.from([1,2,3]})

const decryptedResult = Morfix.decrypt({cipherText})

console.log(decryptedResult)
// Int32Array(3) [1, 2, 3]

```
# Evaluations on encrypted data

For a full list of methods, please take a look at [/src/classes/evaluator](../src/components/evaluator.js)

### Add

Adding two ciphers results in another cipher.
```

// Create two cipherTexts from an `array`
const cipherText = Morfix.encrypt({array: Uint32Array.from([1,2,3]})
const cipherText2 = Morfix.encrypt({array: Uint32Array.from([1,2,3]})

const resultCipher = Morfix.add({a: cipherText, b: cipherText2})
const resultInt32Array = Morfix.decrypt({cipherText: resultCipher})

console.log(resultInt32Array)
// Uint32Array(3) [2, 4, 6]

```

### Subtract

Subtracting two ciphers results in another cipher.
```

// Create two cipherTexts from an `array`
const cipherText = Morfix.encrypt({array: Uint32Array.from([5,5,5]})
const cipherText2 = Morfix.encrypt({array: Uint32Array.from([1,2,3]})

const resultCipher = Morfix.sub({a: cipherText, b: cipherText2})
const resultUInt32Array = Morfix.decrypt({cipherText: resultCipher})

console.log(resultUInt32Array)
// Uint32Array(3) [4, 3, 2]

```

### Multiply

Multiplying two ciphers results in another cipher.
```

// Create two cipherTexts from an `array`
const cipherText = Morfix.encrypt({array: Int32Array.from([1,2,3]})
const cipherText2 = Morfix.encrypt({array: Int32Array.from([1,2,3]})

const resultCipher = Morfix.multiply({a: cipherText, b: cipherText2})
const resultInt32Array = Morfix.decrypt({cipherText: resultCipher})

console.log(resultInt32Array)
// Int32Array(3) [1, 4, 9]

```

### Relinearize

Relinearization is needed to help extend the number of evaluations on a cipherText. Too many
evaluations will not decrypt correctly. This method is most useful after multiplication, but it 
is *not* the same as bootstrapping and you will eventually hit a limit before this fails to decrypt.

```

// Create two cipherTexts from an `array`
const cipherText = Morfix.encrypt({array: Int32Array.from([1,2,3]})
const cipherText2 = Morfix.encrypt({array: Int32Array.from([1,2,3]})

const resultCipher = Morfix.multiply({a: cipherText, b: cipherText2})
// Attempt decryption now, or after relinearization
// const resultInt32Array = Morfix.decrypt({cipherText: resultCipher})

// (Optional) Relinearize the cipher
const relinearizedCipher = Morfix.relinearize({cipherText: resultCipher})
const resultInt32Array = Morfix.decrypt({cipherText: relinearizedCipher})

console.log('resultInt32Array', resultInt32Array)
// Int32Array(3) [1, 4, 9]

```
