# The Basics

There are two __Scheme Types__ that SEAL supports:
- `BFV` operates on Int32/UInt32
- `CKKS` operates on JS Float (Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER)

`BFV` is used to encrypt/decrypt on real integers whereas `CKKS` is used for floats.
However, there are additional differences. `CKKS` delivers an _approximate_ result 
back to you. Ex. A decrypted `CKKS` cipher may be a few decimals off depending on 
several factors. If 100% accuracy is needed, use `BFV`. However, `BFV` is limited by the
minimum and maximum values depending on the encryption parameters whereas in `CKKS` the min/max
values maybe higher (given the appropriate encryption parameters and `scale`) but are
other wise +- 2^53 due to JS Numbers not representing true 64 bit values

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
you can increase the `polyModulusDegree` or other encryption parameters to further fine tune the parameters.

### Import / require the library

Due to limitations with how the WASM file is loaded, 
we need to await on the main library in order to have
a fully instantiated instance. This limitation mostly
because of how chrome limits the size of synchronously
loaded WASM files. Therefore, loading must be done 
asynchronously.

```
    // ES6 import
    // import { Seal } from 'node-seal'
    const { Seal } = require('node-seal')
    const Morfix = await Seal
```

### Encryption Parameters

Setting up a set of encryption parameters is the first step.

There are two `SchemeTypes`:
```
    Morfix.SchemeType.BFV
    Morfix.SchemeType.CKKS
```
A security level determines the bit level security of the encrypted data. 
There are 3 modes you should be primarily concerned with:

```
    Morfix.SchemeType.none // Use unless you know what you're doing
    Morfix.SchemeType.tc128
    Morfix.SchemeType.tc192
    Morfix.SchemeType.tc256
``` 

PolyModulusDegree needs to be a power of 2. We've set up initial helpers on the demo to create the following:
```
    1024 Bits,
    2048 Bits,
    4096 Bits,
    8192 Bits,
    16384 Bits,
    32768 Bits,
    etc...
```

CoeffModulus need to be set by a string of integers representing the bit-sizes of each prime number. We've 
auto generated a list of bit-lengths in the demo, but they can easily be overridden manually.

A PlainModulus is only used for the `BFV` scheme and is not needed for `CKKS` we arbitrarily set this value to `20`
as it works for most of the encryption parameters; however, advanced users should tweak this value.

Example:
```
    ////////////////////////
    // Encryption Parameters
    ////////////////////////
    
    // Create a new EncryptionParameters
    const encParms = Morfix.EncryptionParameters({
      schemeType: Morfix.SchemeType.BFV
    })

    // Assign Poly Modulus Degree
    encParms.setPolyModulusDegree({
      polyModulusDegree: 4096
    })

    // Create a C++ vector from JS string of integers representing bit-lengths of primes
    const bitSizesVector = Morfix.Vector({
      array: new Int32Array([36,36,37])
    })

    // Create a suitable set of CoeffModulus primes from the vector
    const coeffModulusVector = Morfix.CoeffModulus.Create({
      polyModulusDegree: 4096,
      bitSizes: bitSizesVector,
      securityLevel: Morfix.SecurityLevel.tc128
    })

    // Assign Coefficient Modulus
    encParms.setCoeffModulus({
      coeffModulus: coeffModulusVector
    })
    
    // Assign a PlainModulus (only for BFV scheme type)
    encParms.setPlainModulus({
      plainModulus: Morfix.PlainModulus.Batching({
        polyModulusDegree: 4096,
        bitSize: 20,
      })
    })
```

### Context

After encryption parameters are created, we need to use them to create a Context. A Context is used to create all
other instances which execute within the same **context** as the encryption parameters we specify.
```
    ////////////////////////
    // Context
    ////////////////////////
    
    // Create a new Context
    const context = Morfix.Context({
      encryptionParams: encParms,
      expandModChain: true,
      securityLevel: Morfix.SecurityLevel.tc128 // Enforces we will be operating in 128-bit security context
    })

    // Helper to check if the Context was created successfully
    if (!context.parametersSet()) {
      throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
    }
```
### Generate Keys

A KeyGenerator is used to create all the keys necessary for encryption and decryption.

```
    ////////////////////////
    // Keys
    ////////////////////////
    
    // Create a new KeyGenerator (creates a new keypair)
    const keyGenerator = Morfix.KeyGenerator({ 
      context
    })

    // A KeyGenerator can also be instantiated with existing keys. This allows you to generate
    // new Relin/Galois keys with a previously generated SecretKey.

    // Uploading a SecretKey: first, create an Empty SecretKey to load
    const UploadedSecretKey = Morfix.SecretKey()

    // Load from the base64 encoded string
    UploadedSecretKey.load({ context, encoded: <(base64 string from the saved key)> })
    
    // Create a new KeyGenerator (use uploaded secretKey)
    const keyGenerator = Morfix.KeyGenerator({ 
      context,
      secretKey: UploadedSecretKey
    })

    // Similarly, you may also create a KeyGenerator with a PublicKey. However, the benefit is purley to
    // save time by not generating a new PublicKey
    
    // Uploading a PublicKey: first, create an Empty PublicKey to load
    const UploadedPublicKey = Morfix.PublicKey()

    // Load from the base64 encoded string
    UploadedPublicKey.load({ context, encoded: <(base64 string from the saved key)> })
    
    // Create a new KeyGenerator (use both uploaded keys)
    const keyGenerator = Morfix.KeyGenerator({ 
      context,
      secretKey: UploadedSecretKey,
      publicKey: UploadedPublicKey
    })

```

#### Relin Keys

Can be generated, saved to a base64 string, or loaded from a base64 string

```
    // Create a new KeyGenerator (creates a new keypair)
    const keyGenerator = Morfix.KeyGenerator({ 
      context
    })
  
    // Create the RelinKey from the KeyGenerator
    const relinKey = keyGenerator.genRelinKeys()
  
    // Uploading a RelinKey: first, create an empty RelinKey to load
    const uploadedRelinKey = Morfix.RelinKey()

    // Load from the base64 encoded string
    uploadedRelinKey.load({ context, encoded: <(base64 string from the saved key)> })
```

#### Galois Keys

Can be generated, saved to a base64 string, or loaded from a base64 string.
Please note generating Galois keys can take a long time and the output is **very** large.

```
    // Create a new KeyGenerator (creates a new keypair)
    const keyGenerator = Morfix.KeyGenerator({ 
      context
    })
  
    // Create the GaloisKey from the KeyGenerator
    const galoisKey = keyGenerator.genGaloisKeys()
  
    // Uploading a GaloisKey: first, create an empty GaloisKey to load
    const uploadedGaloisKey = Morfix.GaloisKey()

    // Load from the base64 encoded string
    uploadedGaloisKey.load({ context, encoded: <(base64 string from the saved key)> })
```

### Variables

Variables hold data we are manipulating. PlainTexts store encoded values of the human readable data that we
 provide. CipherTexts store encrypted values of the encoded PlainText.

```
    ////////////////////////
    // Variables
    ////////////////////////

    // Creating PlainText(s) 
    const plainA = Morfix.PlainText()
    const plainB = Morfix.PlainText()
    
    // Creating CipherText(s) 
    const cipherA = Morfix.CipherText()
    const cipherB = Morfix.CipherText()

    // Saving / Loading
    const plainAbase64 = plainA.save() // Saves as a base64 string
    const uploadedPlain = Morfix.PlainText()
    uploadedPlain.load({ context, encoded: <(base64 string from the saved variable)> })

    const cipherAbase64 = cipherA.save() // Saves as a base64 string
    const uploadedCipher = Morfix.CipherText()
    uploadedCipher.load({ context, encoded: <(base64 string from the saved variable)> })
```

### Instances

To perform homomorphic evaluations, we need to construct a few helpers:

```
    ////////////////////////
    // Instances
    ////////////////////////
    
    // Create an Evaluator which will allow HE functions to execute
    const evaluator = Morfix.Evaluator({ context })
    
    // Create a BatchEncoder (only BFV SchemeType)
    const encoder = Morfix.BatchEncoder({ context })

    // Or a CKKSEncoder (only CKKS SchemeType)
    // const encoder = Morfix.CKKSEncoder({ context })
    
    // Create an Encryptor to encrypt PlainTexts
    const encryptor = Morfix.Encryptor({
      context,
      publicKey
    })
    
    // Create a Decryptor to decrypt CipherTexts
    const decryptor = Morfix.Decryptor({
      context,
      secretKey
    })
```

### Functions

Now, we're ready for performing HE operations! You will notice the usage of `Vector` which comes from C++. For the sake
of simplicity, you can think of them like arrays, but we need to convert JS TypedArrays to C++ Vectors using
 `Morfix.Vector({ array: <typed array of values> })`

```
    ////////////////////////
    // Homomorphic Functions
    ////////////////////////
    
    // Encode data to a PlainText
    batchEncoder.encodeVectorInt32({
      vector: Morfix.Vector({ array: new Int32Array([1,2,3]) }),
      plainText: plainA
    })
    
    // Encrypt a PlainText
    encryptor.encrypt({
      plainText: plainA,
      cipherText: cipherA
    })    
    
    // Add CipherText B to CipherText A and store the sum in a destination CipherText
    evaluator.add({
      a: cipherA,
      b: cipherA,
      destination: cipherB
    })    
    
    // Decrypt a CipherText
    decryptor.decrypt({
      cipherText: cipherB,
      plainText: plainB
    })    
    
    // Decode data from a PlainText
    // Create a vector to store the decoded PlainText
    const destinationVector_plainB = Morfix.Vector({ array: new Int32Array() })

    batchEncoder.decodeVectorInt32({
      plainText: plainB,
      vector: destinationVector_plainB
    })
    
    console.log('decoded', destinationVector_plainB.toArray() )
```
