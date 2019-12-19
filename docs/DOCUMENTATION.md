# [node-seal](https://morfix.io/sandbox) *3.0.1*

> Microsoft SEAL in Javascript


### src/lib/Seal.js


#### BatchEncoder(options) 

Create an instance of a BatchEncoder

Provides functionality for CRT batching. If the polynomial modulus degree is N, and
the plaintext modulus is a prime number T such that T is congruent to 1 modulo 2N,
then BatchEncoder allows the plaintext elements to be viewed as 2-by-(N/2)
matrices of integers modulo T. Homomorphic operations performed on such encrypted
matrices are applied coefficient (slot) wise, enabling powerful SIMD functionality
for computations that are vectorizable. This functionality is often called "batching"
in the homomorphic encryption literature.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Returns


- `BatchEncoder`  A 'batching' encoder used for the BFV scheme type



#### CipherText() 

Create an instance of a CipherText

Class to store a ciphertext element. The data for a ciphertext consists
of two or more polynomials, which are in Microsoft SEAL stored in a CRT
form with respect to the factors of the coefficient modulus. This data
itself is not meant to be modified directly by the user, but is instead
operated on by functions in the Evaluator class. The size of the backing
array of a ciphertext depends on the encryption parameters and the size
of the ciphertext (at least 2). If the poly_modulus_degree encryption
parameter is N, and the number of primes in the coeff_modulus encryption
parameter is K, then the ciphertext backing array requires precisely
8*N*K*size bytes of memory. A ciphertext also carries with it the
parms_id of its associated encryption parameters, which is used to check
the validity of the ciphertext for homomorphic operations and decryption.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `CipherText`  An empty CipherText instance



#### CKKSEncoder(options) 

Create an instance of a CKKSEncoder

Provides functionality for encoding vectors of complex or real numbers into
plaintext polynomials to be encrypted and computed on using the CKKS scheme.
If the polynomial modulus degree is N, then CKKSEncoder converts vectors of
N/2 complex numbers into plaintext elements. Homomorphic operations performed
on such encrypted vectors are applied coefficient (slot-)wise, enabling
powerful SIMD functionality for computations that are vectorizable. This
functionality is often called "batching" in the homomorphic encryption
literature.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Returns


- `CKKSEncoder`  An encoder used for the CKKS scheme type



#### CoeffModulus() 

CoeffModulus

This class contains static methods for creating a coefficient modulus easily.
Note that while these functions take a sec_level_type argument, all security
guarantees are lost if the output is used with encryption parameters with
a mismatching value for the poly_modulus_degree.

The default value sec_level_type::tc128 provides a very high level of security
and is the default security level enforced by Microsoft SEAL when constructing
a SEALContext object. Normal users should not have to specify the security
level explicitly anywhere.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `CoeffModulus`  The CoeffModulus singleton



#### ComprModeType() 

ComprModeType

A type to describe the compression algorithm applied to serialized data.
Ciphertext and key data consist of a large number of 64-bit words storing
integers modulo prime numbers much smaller than the word size, resulting in
a large number of zero bytes in the output. Any compression algorithm should
be able to clean up these zero bytes and hence compress both ciphertext and
key data.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `ComprModeType`  The ComprModeType singleton



#### Context(options) 

Create an instance of a Context

Performs sanity checks (validation) and pre-computations for a given set of encryption
parameters. While the EncryptionParameters class is intended to be a light-weight class
to store the encryption parameters, the SEALContext class is a heavy-weight class that
is constructed from a given set of encryption parameters. It validates the parameters
for correctness, evaluates their properties, and performs and stores the results of
several costly pre-computations.

After the user has set at least the poly_modulus, coeff_modulus, and plain_modulus
parameters in a given EncryptionParameters instance, the parameters can be validated
for correctness and functionality by constructing an instance of SEALContext. The
constructor of SEALContext does all of its work automatically, and concludes by
constructing and storing an instance of the EncryptionParameterQualifiers class, with
its flags set according to the properties of the given parameters. If the created
instance of EncryptionParameterQualifiers has the parameters_set flag set to true, the
given parameter set has been deemed valid and is ready to be used. If the parameters
were for some reason not appropriately set, the parameters_set flag will be false,
and a SEALContext will have to be created after the parameters are corrected.

By default, SEALContext creates a chain of SEALContext::ContextData instances. The
first one in the chain corresponds to special encryption parameters that are reserved
to be used by the various key classes (SecretKey, PublicKey, etc.). These are the exact
same encryption parameters that are created by the user and passed to th constructor of
SEALContext. The functions key_context_data() and key_parms_id() return the ContextData
and the parms_id corresponding to these special parameters. The rest of the ContextData
instances in the chain correspond to encryption parameters that are derived from the
first encryption parameters by always removing the last one of the moduli in the
coeff_modulus, until the resulting parameters are no longer valid, e.g., there are no
more primes left. These derived encryption parameters are used by ciphertexts and
plaintexts and their respective ContextData can be accessed through the
get_context_data(parms_id_type) function. The functions first_context_data() and
last_context_data() return the ContextData corresponding to the first and the last
set of parameters in the "data" part of the chain, i.e., the second and the last element
in the full chain. The chain itself is a doubly linked list, and is referred to as the
modulus switching chain.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encryptionParams | `EncryptionParameters`  | A set of specific encryption parameters | &nbsp; |
| options.expandModChain | `boolean`  | Determines whether or not to enable modulus switching | &nbsp; |
| options.securityLevel | `SecurityLevel`  | The security strength in bits. | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encryptionParams | `EncryptionParameters`  | A set of specific encryption parameters | &nbsp; |
| options.expandModChain | `boolean`  | Determines whether or not to enable modulus switching | &nbsp; |
| options.securityLevel | `SecurityLevel`  | The security strength in bits. | &nbsp; |



##### Returns


- `Context`  An encryption context to be used for all operations



#### Decryptor(options) 

Create an instance of a Decryptor

Decrypts Ciphertext objects into Plaintext objects. Constructing a Decryptor
requires a SEALContext with valid encryption parameters, and the secret key.
The Decryptor is also used to compute the invariant noise budget in a given
ciphertext.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |
| options.secretKey | `SecretKey`  | SecretKey to be used for decryption | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |
| options.secretKey | `SecretKey`  | SecretKey to be used for decryption | &nbsp; |



##### Returns


- `Decryptor`  A decryptor instance that can be used to decrypt CipherTexts



#### EncryptionParameters(options) 

Create an instance of EncryptionParameters

Represents user-customizable encryption scheme settings. The parameters (most
importantly poly_modulus, coeff_modulus, plain_modulus) significantly affect
the performance, capabilities, and security of the encryption scheme. Once
an instance of EncryptionParameters is populated with appropriate parameters,
it can be used to create an instance of the SEALContext class, which verifies
the validity of the parameters, and performs necessary pre-computations.

Picking appropriate encryption parameters is essential to enable a particular
application while balancing performance and security. Some encryption settings
will not allow some inputs (e.g. attempting to encrypt a polynomial with more
coefficients than poly_modulus or larger coefficients than plain_modulus) or,
support the desired computations (with noise growing too fast due to too large
plain_modulus and too small coeff_modulus).




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.schemeType | `SchemeType`  | The desired scheme type to use | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.schemeType | `SchemeType`  | The desired scheme type to use | &nbsp; |



##### Returns


- `EncryptionParameters`  A set of encryption parameters based from the scheme type



#### Encryptor(options) 

Create an instance of an Encryptor

Encrypts Plaintext objects into Ciphertext objects. Constructing an Encryptor
requires a SEALContext with valid encryption parameters, the public key and/or
the secret key. If an Encrytor is given a secret key, it supports symmetric-key
encryption. If an Encryptor is given a public key, it supports asymmetric-key
encryption.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |
| options.publicKey | `PublicKey`  | PublicKey to be used for encryption | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |
| options.publicKey | `PublicKey`  | PublicKey to be used for encryption | &nbsp; |



##### Returns


- `Encryptor`  An encryptor instance that can be used to encrypt PlainTexts



#### Evaluator(options) 

Create an instance of an Evaluator

Provides operations on ciphertexts. Due to the properties of the encryption
scheme, the arithmetic operations pass through the encryption layer to the
underlying plaintext, changing it according to the type of the operation. Since
the plaintext elements are fundamentally polynomials in the polynomial quotient
ring Z_T[x]/(X^N+1), where T is the plaintext modulus and X^N+1 is the polynomial
modulus, this is the ring where the arithmetic operations will take place.
BatchEncoder (batching) provider an alternative possibly more convenient view
of the plaintext elements as 2-by-(N2/2) matrices of integers modulo the plaintext
modulus. In the batching view the arithmetic operations act on the matrices
element-wise. Some of the operations only apply in the batching view, such as
matrix row and column rotations. Other operations such as relinearization have
no semantic meaning but are necessary for performance reasons.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Returns


- `Evaluator`  An evaluator instance to be used to perform homomorphic evaluations



#### Exception() 

Get the Exception singleton





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `Exception`  The Exception singleton



#### GaloisKeys() 

Create an instance of GaloisKeys

Class to store Galois keys.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `GaloisKeys`  An empty GaloisKeys instance



#### IntegerEncoder(options) 

Create an instance of an IntegerEncoder

Encodes integers into plaintext polynomials that Encryptor can encrypt. An instance of
the IntegerEncoder class converts an integer into a plaintext polynomial by placing its
binary digits as the coefficients of the polynomial. Decoding the integer amounts to
evaluating the plaintext polynomial at x=2.

Addition and multiplication on the integer side translate into addition and multiplication
on the encoded plaintext polynomial side, provided that the length of the polynomial
never grows to be of the size of the polynomial modulus (poly_modulus), and that the
coefficients of the plaintext polynomials appearing throughout the computations never
experience coefficients larger than the plaintext modulus (plain_modulus).




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |



##### Returns


- `IntegerEncoder`  An encoder to be used for encoding only integers to PlainTexts



#### KeyGenerator(options) 

Create an instance of a KeyGenerator

Generates matching secret key and public key. An existing KeyGenerator can
also at any time be used to generate relinearization keys and Galois keys.
Constructing a KeyGenerator requires only a SEALContext.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |
| options.secretKey | `SecretKey`  | Previously generated SecretKey | *Optional* |
| options.publicKey | `PublicKey`  | Previously generated PublicKey | *Optional* |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context | &nbsp; |
| options.secretKey | `SecretKey`  | Previously generated SecretKey | *Optional* |
| options.publicKey | `PublicKey`  | Previously generated PublicKey | *Optional* |



##### Returns


- `KeyGenerator`  A KeyGenerator to be used to generate keys depending on how it was initialized



#### MemoryPoolHandle() 

MemoryPoolHandle

Manages a shared pointer to a memory pool. Microsoft SEAL uses memory pools
for improved performance due to the large number of memory allocations
needed by the homomorphic encryption operations, and the underlying polynomial
arithmetic. The library automatically creates a shared global memory pool
that is used for all dynamic allocations by default, and the user can
optionally create any number of custom memory pools to be used instead.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `MemoryPoolHandle`  The MemoryPoolHandle singleton



#### PlainModulus() 

Get the PlainModulus singleton





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `PlainModulus`  The PlainModulus singleton



#### PlainText() 

Create an instance of a PlainText

Class to store a plaintext element. The data for the plaintext is a polynomial
with coefficients modulo the plaintext modulus. The degree of the plaintext
polynomial must be one less than the degree of the polynomial modulus. The
backing array always allocates one 64-bit word per each coefficient of the
polynomial.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `PlainText`  An empty PlainText instance



#### PublicKey() 

Create an instance of a PublicKey

Class to store a public key.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `PublicKey`  An empty PublicKey instance



#### RelinKeys() 

Create an instance of a RelinKeys

Class to store relinearization keys.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `RelinKeys`  An empty RelinKeys instance



#### SchemeType() 

Get the SchemeType singleton





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `SchemeType`  The SchemeType singleton



#### SecretKey() 

Create an instance of a SecretKey

Class to store a secret key.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `SecretKey`  An empty SecretKey instance



#### SecurityLevel() 

SecurityLevel

Represents a standard security level according to the HomomorphicEncryption.org
security standard. The value sec_level_type::none signals that no standard
security level should be imposed. The value sec_level_type::tc128 provides
a very high level of security and is the default security level enforced by
Microsoft SEAL when constructing a SEALContext object. Normal users should not
have to specify the security level explicitly anywhere.





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `SecurityLevel`  The SecurityLevel singleton



#### SmallModulus() 

Create an instance of a SmallModulus





##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |



##### Returns


- `SmallModulus`  An empty SmallModulus instance



#### Vector(options) 

Create an instance of a C++ Vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.array | `Int32Array` `Uint32Array` `Float64Array`  | Typed Array of data | &nbsp; |



##### Properties

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.array | `Int32Array` `Uint32Array` `Float64Array`  | Typed Array of data | &nbsp; |



##### Returns


- `Vector`  Vector containing the typed data




### src/components/batch-encoder.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### encodeVectorInt32(options) 

Creates a plaintext from a given matrix. This function "batches" a given matrix
of Int32 integers modulo the plaintext modulus into a plaintext element, and stores
the result in the destination parameter. The input vector must have size at most equal
to the degree of the polynomial modulus. The first half of the elements represent the
first row of the matrix, and the second half represent the second row. The numbers
in the matrix can be at most equal to the plaintext modulus for it to represent
a valid plaintext.

If the destination plaintext overlaps the input values in memory, the behavior of
this function is undefined.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.vector | `Vector`  | Data to encode | &nbsp; |
| options.plainText | `PlainText`  | Destination to store the encoded result | &nbsp; |




##### Returns


- `Void`



#### encodeVectorUInt32(options) 

Creates a plaintext from a given matrix. This function "batches" a given matrix
of UInt32 integers modulo the plaintext modulus into a plaintext element, and stores
the result in the destination parameter. The input vector must have size at most equal
to the degree of the polynomial modulus. The first half of the elements represent the
first row of the matrix, and the second half represent the second row. The numbers
in the matrix can be at most equal to the plaintext modulus for it to represent
a valid plaintext.

If the destination plaintext overlaps the input values in memory, the behavior of
this function is undefined.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.vector | `Vector`  | Data to encode | &nbsp; |
| options.plainText | `PlainText`  | Destination to store the encoded result | &nbsp; |




##### Returns


- `Void`



#### decodeVectorInt32(options) 

Inverse of encode Int32. This function "unbatches" a given plaintext into a matrix
of integers modulo the plaintext modulus, and stores the result in the destination
parameter. The input plaintext must have degress less than the polynomial modulus,
and coefficients less than the plaintext modulus, i.e. it must be a valid plaintext
for the encryption parameters. Dynamic memory allocations in the process are
allocated from the memory pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plainText | `PlainText`  | Data to decode | &nbsp; |
| options.vector | `Vector`  | Destination to store the decoded result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  |  | *Optional* |




##### Returns


- `Void`



#### decodeVectorUInt32(options) 

Inverse of encode UInt32. This function "unbatches" a given plaintext into a matrix
of integers modulo the plaintext modulus, and stores the result in the destination
parameter. The input plaintext must have degress less than the polynomial modulus,
and coefficients less than the plaintext modulus, i.e. it must be a valid plaintext
for the encryption parameters. Dynamic memory allocations in the process are
allocated from the memory pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plainText | `PlainText`  | Data to decode | &nbsp; |
| options.vector | `Vector`  | Destination to store the decoded result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  |  | *Optional* |




##### Returns


- `Void`



#### slotCount() 

Returns the total number of batching slots available to hold data






##### Returns


- `number`  Number of batching slots available to hold data




### src/components/cipher-text.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### coeffModCount() 

Returns the number of primes in the coefficient modulus of the
associated encryption parameters. This directly affects the
allocation size of the ciphertext.






##### Returns


- `number`  number of primes in the coefficient modulus



#### polyModulusDegree() 

Returns the degree of the polynomial modulus of the associated
encryption parameters. This directly affects the allocation size
of the ciphertext.






##### Returns


- `number`  degree of the polynomial modulus



#### size() 

Returns the size of the ciphertext.






##### Returns


- `number`  size of the ciphertext



#### sizeCapacity() 

Returns the capacity of the allocation. This means the largest size
of the ciphertext that can be stored in the current allocation with
the current encryption parameters.






##### Returns


- `number`  capacity of the allocation



#### isTransparent() 

Check whether the current ciphertext is transparent, i.e. does not require
a secret key to decrypt. In typical security models such transparent
ciphertexts would not be considered to be valid. Starting from the second
polynomial in the current ciphertext, this function returns true if all
following coefficients are identically zero. Otherwise, returns false.






##### Returns


- `boolean`  ciphertext is transparent



#### isNttForm() 

Returns whether the ciphertext is in NTT form.






##### Returns


- `boolean`  ciphertext is in NTT form



#### parmsId() 

Returns a reference to parmsId.






##### Returns


- `pointer`  pointer to the parmsId



#### scale() 

Returns a reference to the scale. This is only needed when using the
CKKS encryption scheme. The user should have little or no reason to ever
change the scale by hand.






##### Returns


- `pointer`  pointer to the scale



#### pool() 

Returns the currently used MemoryPoolHandle.






##### Returns


- `pointer`  pointer to the MemoryPoolHandle



#### save(options) 

Save a cipherText to a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.deflate | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string



#### load(options) 

Load a cipherText from a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context to enforce | &nbsp; |
| options.encoded | `string`  | base64 encoded string | &nbsp; |




##### Returns


- `Void`




### src/components/ckks-encoder.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### encodeVectorDouble(options) 

Encodes a vector of type double to a given plainText




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.vector | `Vector`  | Data to encode | &nbsp; |
| options.scale | `number`  | Scaling parameter defining encoding precision | &nbsp; |
| options.plainText | `PlainText`  | Destination to store the encoded result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  |  | *Optional* |




##### Returns


- `Void`



#### decodeVectorDouble(options) 

Decodes a double vector to a given plainText




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plainText | `PlainText`  | Data to decode | &nbsp; |
| options.vector | `Vector`  | Destination to store the decoded result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  |  | *Optional* |




##### Returns


- `Void`



#### slotCount() 

Returns the total number of CKKS slots available to hold data






##### Returns


- `number`  Number of CKKS slots available




### src/components/compr-mode-type.js


#### none() 

Return the `none` Compression Mode Type






##### Returns


- `ComprModeType.none`  Compression mode 'none'



#### deflate() 

Return the `deflate` Compression Mode Type






##### Returns


- `ComprModeType.deflate`  Compression mode 'deflate'




### src/components/decryptor.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### decrypt(options) 

Decrypts a Ciphertext and stores the result in the destination parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.cipherText | `CipherText`  | CipherText to decrypt | &nbsp; |
| options.plainText | `PlainText`  | PlainText destination to store the result | &nbsp; |




##### Returns


- `Void`



#### invariantNoiseBudget(options) 

Computes the invariant noise budget (in bits) of a ciphertext. The invariant
noise budget measures the amount of room there is for the noise to grow while
ensuring correct decryptions. This function works only with the BFV scheme.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.cipherText | `CipherText`  | CipherText to measure | &nbsp; |




##### Returns


- `number`  invariant noise budget (in bits)




### src/components/coeff-modulus.js


#### MaxBitCount(options) 

Returns the Maximum Bit Count for the specified polyModulusDegree and securityLevel




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.polyModulusDegree | `number`  | degree of the polynomial modulus | &nbsp; |
| options.securityLevel | `SecurityLevel`  | Security Level | &nbsp; |




##### Returns


- `number`  Maximum bit count



#### BFVDefault(options) 

Returns a default vector of primes for the BFV CoeffModulus parameter




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.polyModulusDegree | `number`  | degree of the polynomial modulus | &nbsp; |
| options.securityLevel | `SecurityLevel`  | Security Level | &nbsp; |




##### Returns


- `Vector`  Vector containing SmallModulus primes



#### Create(options) 

Creates a vector of primes for a given polyModulusDegree and bitSizes




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.polyModulusDegree | `number`  | degree of the polynomial modulus | &nbsp; |
| options.bitSizes | `Vector`  | Vector containing int32 values representing bit-sizes of primes | &nbsp; |




##### Returns


- `Vector`  Vector containing SmallModulus primes




### src/components/context.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### print() 

Prints the context parameters to STDOUT (console.log)






##### Returns


- `Void`



#### getContextData(options) 

Returns the ContextData corresponding to encryption parameters with a given
parmsId. If parameters with the given parmsId are not found then the
function returns nullptr.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.parmsId |  | specific id to return contextdata for | &nbsp; |




##### Returns


-  contextData corresponding to encryption parameters



#### keyContextData() 

Returns the ContextData corresponding to encryption parameters that are used for keys.






##### Returns


-  contextData corresponding to encryption parameters that are used for keys.



#### firstContextData() 

Returns the ContextData corresponding to the first encryption parameters that are used for data.






##### Returns


-  contextData corresponding to the first encryption parameters that are used for data



#### lastContextData() 

Returns the ContextData corresponding to the last encryption parameters that are used for data.






##### Returns


-  contextData corresponding to the last encryption parameters that are used for data



#### parametersSet() 

If the encryption parameters are set in a way that is considered valid by
Microsoft SEAL, the variable parameters_set is set to true.






##### Returns


- `boolean`  are encryption parameters set in a way that is considered valid



#### keyParmsId() 

Returns a parmsIdType corresponding to the set of encryption parameters that are used for keys.






##### Returns


-  parmsIdType corresponding to the set of encryption parameters that are used for keys



#### firstParmsId() 

Returns a parmsIdType corresponding to the first encryption parameters that are used for data.






##### Returns


-  parmsIdType corresponding to the first encryption parameters that are used for data



#### lastParmsId() 

Returns a parmsIdType corresponding to the last encryption parameters that are used for data.






##### Returns


-  parmsIdType corresponding to the last encryption parameters that are used for data



#### usingKeyswitching() 

Returns whether the coefficient modulus supports keyswitching. In practice,
support for keyswitching is required by Evaluator.relinearize,
Evaluator.applyGalois, and all rotation and conjugation operations. For
keyswitching to be available, the coefficient modulus parameter must consist
of at least two prime number factors.






##### Returns


- `boolean`  coefficient modulus supports keyswitching




### src/components/encryption-parameters.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### setPolyModulusDegree(options) 

Sets the degree of the polynomial modulus parameter to the specified value.
The polynomial modulus directly affects the number of coefficients in
plaintext polynomials, the size of ciphertext elements, the computational
performance of the scheme (bigger is worse), and the security level (bigger
is better). In Microsoft SEAL the degree of the polynomial modulus must be a power
of 2 (e.g.  1024, 2048, 4096, 8192, 16384, or 32768).




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.polyModulusDegree | `number`  | degree of the polynomial modulus | &nbsp; |




##### Returns


- `Void`



#### setCoeffModulus(options) 

Sets the coefficient modulus parameter. The coefficient modulus consists
of a list of distinct prime numbers, and is represented by a vector of
SmallModulus objects. The coefficient modulus directly affects the size
of ciphertext elements, the amount of computation that the scheme can perform
(bigger is better), and the security level (bigger is worse). In Microsoft SEAL each
of the prime numbers in the coefficient modulus must be at most 60 bits,
and must be congruent to 1 modulo 2*degree(poly_modulus).




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.coeffModulus | `Vector`  | Vector of SmallModulus primes | &nbsp; |




##### Returns


- `Void`



#### setPlainModulus(options) 

Sets the plaintext modulus parameter. The plaintext modulus is an integer
modulus represented by the SmallModulus class. The plaintext modulus
determines the largest coefficient that plaintext polynomials can represent.
It also affects the amount of computation that the scheme can perform
(bigger is worse). In Microsoft SEAL the plaintext modulus can be at most 60 bits
long, but can otherwise be any integer. Note, however, that some features
(e.g. batching) require the plaintext modulus to be of a particular form.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plainModulus | `SmallModulus`  | plaintext modulus parameter | &nbsp; |




##### Returns


- `Void`



#### scheme() 

Returns the encryption scheme type.






##### Returns


- `SchemeType`  Encryption scheme type



#### polyModulusDegree() 

Returns the degree of the polynomial modulus parameter.






##### Returns


- `number`  degree of the polynomial modulus



#### coeffModulus() 

Returns the currently set coefficient modulus parameter.






##### Returns


- `Vector`  Vector containing SmallModulus primes



#### plainModulus() 

Returns the currently set plaintext modulus parameter.






##### Returns


- `SmallModulus`  plaintext modulus



#### save(options) 

Save the Encryption Parameters to a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.deflate | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string



#### load(options) 

Load the Encryption Parameters from a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encoded | `string`  | base64 encoded string | &nbsp; |




##### Returns


- `Void`




### src/components/encryptor.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### encrypt(options) 

Encrypts a plaintext and stores the result in the destination parameter.
Dynamic memory allocations in the process are allocated from the memory
pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plainText | `PlainText`  | PlainText to encrypt | &nbsp; |
| options.cipherText | `CipherText`  | CipherText destination to store the result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`




### src/components/evaluator.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### negate(options) 

Negates a ciphertext and stores the result in the destination parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to negate | &nbsp; |
| options.destination | `CipherText`  | CipherText to store the negated result | &nbsp; |




##### Returns


- `Void`



#### add(options) 

Adds two ciphertexts. This function adds together a and b
and stores the result in the destination parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.a | `CipherText`  | CipherText operand A | &nbsp; |
| options.b | `CipherText`  | CipherText operand B | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the sum | &nbsp; |




##### Returns


- `Void`



#### sub(options) 

Subtracts two ciphertexts. This function computes the difference of a
and b and stores the result in the destination parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.a | `CipherText`  | CipherText operand A | &nbsp; |
| options.b | `CipherText`  | CipherText operand B | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the difference | &nbsp; |




##### Returns


- `Void`



#### multiply(options) 

Multiplies two ciphertexts. This functions computes the product of a
and b and stores the result in the destination parameter. Dynamic
memory allocations in the process are allocated from the memory pool pointed
to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.a | `CipherText`  | CipherText operand A | &nbsp; |
| options.b | `CipherText`  | CipherText operand B | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the product | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### square(options) 

Squares a ciphertext. This functions computes the square of encrypted and
stores the result in the destination parameter. Dynamic memory allocations
in the process are allocated from the memory pool pointed to by the given
MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to square | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the squared result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### relinearize(options) 

Relinearizes a ciphertext. This functions relinearizes encrypted, reducing
its size down to 2, and stores the result in the destination parameter.
If the size of encrypted is K+1, the given relinearization keys need to
have size at least K-1. Dynamic memory allocations in the process are allocated
from the memory pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to relinearize | &nbsp; |
| options.relinKeys | `RelinKeys`  | RelinKey used to perform relinearization | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the relinearized result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### cipherModSwitchToNext(options) 

Given a ciphertext encrypted modulo q_1...q_k, this function switches the
modulus down to q_1...q_{k-1} and stores the result in the destination
parameter. Dynamic memory allocations in the process are allocated from
the memory pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to switch its modulus down | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the switched result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### cipherModSwitchTo(options) 

Given a ciphertext encrypted modulo q_1...q_k, this function switches the
modulus down until the parameters reach the given parmsId and stores the
result in the destination parameter. Dynamic memory allocations in the process
are allocated from the memory pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to switch its modulus down | &nbsp; |
| options.parmsId |  | Target parmsId to switch to | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the switched result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### plainModSwitchToNext(options) 

Modulus switches an NTT transformed plaintext from modulo q_1...q_k down
to modulo q_1...q_{k-1} and stores the result in the destination parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plain | `PlainText`  | PlainText to switch its modulus down | &nbsp; |
| options.destination | `PlainText`  | PlainText destination to store the switched result | &nbsp; |




##### Returns


- `Void`



#### plainModSwitchTo(options) 

Given an NTT transformed plaintext modulo q_1...q_k, this function switches
the modulus down until the parameters reach the given parmsId and stores
the result in the destination parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plain | `PlainText`  | PlainText to switch its modulus down | &nbsp; |
| options.parmsId |  | Target parmsId to switch to | &nbsp; |
| options.destination | `PlainText`  | PlainText destination to store the switched result | &nbsp; |




##### Returns


- `Void`



#### rescaleToNext(options) 

Given a ciphertext encrypted modulo q_1...q_k, this function switches the
modulus down to q_1...q_{k-1}, scales the message down accordingly, and
stores the result in the destination parameter. Dynamic memory allocations
in the process are allocated from the memory pool pointed to by the given
MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to rescale | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the rescaled result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### rescaleTo(options) 

Given a ciphertext encrypted modulo q_1...q_k, this function switches the
modulus down until the parameters reach the given parms_id, scales the message
down accordingly, and stores the result in the destination parameter. Dynamic
memory allocations in the process are allocated from the memory pool pointed
to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to rescale | &nbsp; |
| options.parmsId |  | Target parmsId to rescale to | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the rescaled result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### exponentiate(options) 

Exponentiates a ciphertext. This functions raises encrypted to a power and
stores the result in the destination parameter. Dynamic memory allocations
in the process are allocated from the memory pool pointed to by the given
MemoryPoolHandle. The exponentiation is done in a depth-optimal order, and
relinearization is performed automatically after every multiplication in
the process. In relinearization the given relinearization keys are used.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to exponentiate | &nbsp; |
| options.exponent | `number`  | Positive integer to exponentiate the CipherText | &nbsp; |
| options.relinKeys | `RelinKeys`  | RelinKeys used to perform relinearization after each exponentiation | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the exponentiated result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### addPlain(options) 

Adds a ciphertext and a plaintext. This function adds a ciphertext and
a plaintext and stores the result in the destination parameter. The plaintext
must be valid for the current encryption parameters.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText operand A | &nbsp; |
| options.plain | `PlainText`  | PlainText operand B | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the sum | &nbsp; |




##### Returns


- `Void`



#### subPlain(options) 

Subtracts a plaintext from a ciphertext. This function subtracts a plaintext
from a ciphertext and stores the result in the destination parameter. The
plaintext must be valid for the current encryption parameters.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText operand A | &nbsp; |
| options.plain | `PlainText`  | PlainText operand B | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the difference | &nbsp; |




##### Returns


- `Void`



#### multiplyPlain(options) 

Multiplies a ciphertext with a plaintext. This function multiplies
a ciphertext with a plaintext and stores the result in the destination
parameter. The plaintext must be a valid for the current encryption parameters,
and cannot be identially 0. Dynamic memory allocations in the process are
allocated from the memory pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText operand A | &nbsp; |
| options.plain | `PlainText`  | PlainText operand B | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the product | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### plainTransformToNtt(options) 

Transforms a plaintext to NTT domain. This functions applies the Number
Theoretic Transform to a plaintext by first embedding integers modulo the
plaintext modulus to integers modulo the coefficient modulus and then
performing David Harvey's NTT on the resulting polynomial. The transformation
is done with respect to encryption parameters corresponding to a given
parmsId. The result is stored in the destinationNtt parameter. For the
operation to be valid, the plaintext must have degree less than poly_modulus_degree
and each coefficient must be less than the plaintext modulus, i.e., the plaintext
must be a valid plaintext under the current encryption parameters. Dynamic
memory allocations in the process are allocated from the memory pool pointed
to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plain | `PlainText`  | PlainText to transform | &nbsp; |
| options.parmsId |  | target parmsId to perform NTT transformation | &nbsp; |
| options.destinationNtt | `PlainText`  | PlainText destination to store the transformed result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### cipherTransformToNtt(options) 

Transforms a ciphertext to NTT domain. This functions applies David Harvey's
Number Theoretic Transform separately to each polynomial of a ciphertext.
The result is stored in the destinationNtt parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to transform | &nbsp; |
| options.destinationNtt | `CipherText`  | CipherText destination to store the transformed result | &nbsp; |




##### Returns


- `Void`



#### cipherTransformFromNtt(options) 

Transforms a ciphertext back from NTT domain. This functions applies the
inverse of David Harvey's Number Theoretic Transform separately to each
polynomial of a ciphertext. The result is stored in the destination parameter.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encryptedNtt | `CipherText`  | CipherText to transform | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the transformed result | &nbsp; |




##### Returns


- `Void`



#### applyGalois(options) 

Applies a Galois automorphism to a ciphertext and writes the result to the
destination parameter. To evaluate the Galois automorphism, an appropriate
set of Galois keys must also be provided. Dynamic memory allocations in
the process are allocated from the memory pool pointed to by the given
MemoryPoolHandle.

The desired Galois automorphism is given as a Galois element, and must be
an odd integer in the interval [1, M-1], where M = 2*N, and N = degree(poly_modulus).
Used with batching, a Galois element 3^i % M corresponds to a cyclic row
rotation i steps to the left, and a Galois element 3^(N/2-i) % M corresponds
to a cyclic row rotation i steps to the right. The Galois element M-1 corresponds
to a column rotation (row swap) in BFV, and complex conjugation in CKKS.
In the polynomial view (not batching), a Galois automorphism by a Galois
element p changes Enc(plain(x)) to Enc(plain(x^p)).




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to apply the automorphism | &nbsp; |
| options.galoisElt | `number`  | Number representing the Galois element | &nbsp; |
| options.galoisKeys | `GaloisKeys`  | GaloisKeys used to perform rotations | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### rotateRows(options) 

Rotates plaintext matrix rows cyclically. When batching is used with the
BFV scheme, this function rotates the encrypted plaintext matrix rows
cyclically to the left (steps > 0) or to the right (steps < 0) and writes
the result to the destination parameter. Since the size of the batched
matrix is 2-by-(N/2), where N is the degree of the polynomial modulus,
the number of steps to rotate must have absolute value at most N/2-1. Dynamic
memory allocations in the process are allocated from the memory pool pointed
to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to rotate rows | &nbsp; |
| options.steps | `number`  | Int representing steps to rotate (negative = right, positive = left) | &nbsp; |
| options.galoisKeys | `GaloisKeys`  | GaloisKeys used to perform rotations | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the rotated result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### rotateColumns(options) 

Rotates plaintext matrix columns cyclically. When batching is used with
the BFV scheme, this function rotates the encrypted plaintext matrix columns
cyclically, and writes the result to the destination parameter. Since the
size of the batched matrix is 2-by-(N/2), where N is the degree of the
polynomial modulus, this means simply swapping the two rows. Dynamic memory
allocations in the process are allocated from the memory pool pointed to
by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to rotate columns | &nbsp; |
| options.galoisKeys | `GaloisKeys`  | GaloisKeys used to perform rotations | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the rotated result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### rotateVector(options) 

Rotates plaintext vector cyclically. When using the CKKS scheme, this function
rotates the encrypted plaintext vector cyclically to the left (steps > 0)
or to the right (steps < 0) and writes the result to the destination parameter.
Since the size of the batched matrix is 2-by-(N/2), where N is the degree
of the polynomial modulus, the number of steps to rotate must have absolute
value at most N/2-1. Dynamic memory allocations in the process are allocated
from the memory pool pointed to by the given MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to rotate the entire vector | &nbsp; |
| options.steps | `number`  | Int representing steps to rotate (negative = right, positive = left) | &nbsp; |
| options.galoisKeys | `GaloisKeys`  | GaloisKeys used to perform rotations | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the rotated result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`



#### complexConjugate(options) 

Complex conjugates plaintext slot values. When using the CKKS scheme, this
function complex conjugates all values in the underlying plaintext, and
writes the result to the destination parameter. Dynamic memory allocations
in the process are allocated from the memory pool pointed to by the given
MemoryPoolHandle.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.encrypted | `CipherText`  | CipherText to complex conjugate | &nbsp; |
| options.galoisKeys | `GaloisKeys`  | GaloisKeys used to perform rotations | &nbsp; |
| options.destination | `CipherText`  | CipherText destination to store the conjugated result | &nbsp; |
| options.pool&#x3D;MemoryPoolHandle.global | `MemoryPoolHandle`  | Memory pool pointer | *Optional* |




##### Returns


- `Void`




### src/components/exception.js


#### getHuman(options) 

Returns the human readable exception string from
an emscripten exception pointer




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.pointer | `number`  | The integer pointer thrown from emscripten | &nbsp; |




##### Returns


- `string`  Human readable exception message




### src/components/galois-keys.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### save(options) 

Save the GaloisKeys to a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.deflate | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string



#### load(options) 

Load a set of GaloisKeys from a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context to enforce | &nbsp; |
| options.encoded | `string`  | base64 encoded string | &nbsp; |




##### Returns


- `Void`




### src/components/integer-encoder.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### encodeInt32(options) 

Encode an Int32 value to a PlainText




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.value | `number`  | Integer to encode | &nbsp; |
| options.destination | `PlainText`  | Plaintext to store the encoded data | &nbsp; |




##### Returns


- `Void`



#### encodeUInt32(options) 

Encode an UInt32 value to a PlainText




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.value | `number`  | Unsigned integer to encode | &nbsp; |
| options.destination | `PlainText`  | Plaintext to store the encoded data | &nbsp; |




##### Returns


- `Void`



#### decodeInt32(options) 

Decode an Int32 value from a PlainText




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plainText | `PlainText`  | Plaintext to decode | &nbsp; |




##### Returns


- `number`  Int32 value



#### decodeUInt32(options) 

Decode an UInt32 value from a PlainText




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.plainText | `PlainText`  | Plaintext to decode | &nbsp; |




##### Returns


- `number`  Uint32 value




### src/components/key-generator.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### getSecretKey() 

Return the generated SecretKey






##### Returns


- `SecretKey`  The secret key that was generated upon instantiation of this KeyGenerator



#### getPublicKey() 

Return the generated PublicKey






##### Returns


- `PublicKey`  The public key that was generated upon instantiation of this KeyGenerator



#### genRelinKeys() 

Generate and return a set of RelinKeys






##### Returns


- `RelinKeys`  New RelinKeys from the KeyGenerator's internal secret key



#### genGaloisKeys() 

Generate and return a set of GaloisKeys






##### Returns


- `GaloisKeys`  New GaloisKeys from the KeyGenerator's internal secret key




### src/components/library.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### initialize(options) 

Initialize the library




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.source |  | Source library | &nbsp; |
| options.sourceWasm |  | Source WASM file | &nbsp; |




##### Returns


- `Promise.&lt;null&gt;`  




### src/components/plain-modulus.js


#### Batching(options) 

Creates a prime number SmallModulus for use as plainModulus encryption
parameter that supports batching with a given polyModulusDegree.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.polyModulusDegree | `number`  | degree of the polynomial modulus | &nbsp; |
| options.bitSize | `number`  | Bit size of the prime | &nbsp; |




##### Returns


- `SmallModulus`  prime number



#### BatchingVector(options) 

Creates several prime number SmallModulus elements that can be used as
plainModulus encryption parameters, each supporting batching with a given
polyModulusDegree.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.polyModulusDegree | `number`  | degree of the polynomial modulus | &nbsp; |
| options.bitSizes | `Vector`  | Vector containing int32 values representing bit-sizes of primes | &nbsp; |




##### Returns


- `Vector`  Vector of SmallModulus




### src/components/plain-text.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### shrinkToFit() 

Allocates enough memory to accommodate the backing array of the current
plaintext and copies it over to the new location. This function is meant
to reduce the memory use of the plaintext to smallest possible and can be
particularly important after modulus switching.






##### Returns


- `Void`



#### setZero() 

Sets the plaintext polynomial to zero.






##### Returns


- `Void`



#### isZero() 

Returns whether the current plaintext polynomial has all zero coefficients.






##### Returns


- `boolean`  plaintext polynomial has all zero coefficients



#### capacity() 

Returns the capacity of the current allocation.






##### Returns


- `number`  capacity of the current allocation



#### coeffCount() 

Returns the coefficient count of the current plaintext polynomial.






##### Returns


- `number`  coefficient count of the current plaintext polynomial



#### significantCoeffCount() 

Returns the significant coefficient count of the current plaintext polynomial.






##### Returns


- `number`  significant coefficient count of the current plaintext polynomial



#### nonzeroCoeffCount() 

Returns the non-zero coefficient count of the current plaintext polynomial.






##### Returns


- `number`  non-zero coefficient count of the current plaintext polynomial



#### toPolynomial() 

Returns a human-readable string description of the plaintext polynomial.

The returned string is of the form "7FFx^3 + 1x^1 + 3" with a format
summarized by the following:
1. Terms are listed in order of strictly decreasing exponent
2. Coefficient values are non-negative and in hexadecimal format (hexadecimal
letters are in upper-case)
3. Exponents are positive and in decimal format
4. Zero coefficient terms (including the constant term) are omitted unless
the polynomial is exactly 0 (see rule 9)
5. Term with the exponent value of one is written as x^1
6. Term with the exponent value of zero (the constant term) is written as
just a hexadecimal number without x or exponent
7. Terms are separated exactly by <space>+<space>
8. Other than the +, no other terms have whitespace
9. If the polynomial is exactly 0, the string "0" is returned






##### Returns


- `string`  Polynomial string



#### isNttForm() 

Returns whether the plaintext is in NTT form.






##### Returns


- `boolean`  plaintext is in NTT form



#### parmsId() 

Returns a reference to parms_id. The parms_id must remain zero unless the
plaintext polynomial is in NTT form.






##### Returns


-  parmsId pointer



#### scale() 

Returns a reference to the scale. This is only needed when using the CKKS
encryption scheme. The user should have little or no reason to ever change
the scale by hand.






##### Returns


-  reference to the scale



#### pool() 

Returns the currently used MemoryPoolHandle.






##### Returns


- `MemoryPoolHandle`  Pointer to the current memory pool handle



#### save(options) 

Save the PlainText to a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.deflate | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string



#### load(options) 

Load a PlainText from a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context to enforce | &nbsp; |
| options.encoded | `string`  | base64 encoded string | &nbsp; |




##### Returns


- `Void`




### src/components/memory-pool-handle.js


#### global() 

Returns a MemoryPoolHandle pointing to the global memory pool.






##### Returns


- `MemoryPoolHandle`  pointer to the global memory pool



#### threadLocal() 

Returns a MemoryPoolHandle pointing to the thread-local memory pool.






##### Returns


- `MemoryPoolHandle`  pointer to the thread-local memory pool




### src/components/public-key.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### save(options) 

Save the PublicKey to a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.deflate | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string



#### load(options) 

Load a PublicKey from a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context to enforce | &nbsp; |
| options.encoded | `string`  | base64 encoded string | &nbsp; |




##### Returns


- `Void`




### src/components/relin-keys.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### save(options) 

Save the RelinKeys to a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.deflate | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string



#### load(options) 

Load a set of RelinKeys from a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context to enforce | &nbsp; |
| options.encoded | `string`  | base64 encoded string | &nbsp; |




##### Returns


- `Void`




### src/components/scheme-type.js


#### none() 

Return the none scheme type






##### Returns


- `SchemeType.none`  'none' scheme type



#### BFV() 

Return the BFV scheme type






##### Returns


- `SchemeType.BFV`  'BFV' scheme type



#### CKKS() 

Return the CKKS scheme type






##### Returns


- `SchemeType.CKKS`  'CKKS' scheme type




### src/components/small-modulus.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### setValue(value) 

Loads a SmallModulus from a string representing an uint64 value.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| value | `string`  | string representation of a uint64 value | &nbsp; |




##### Returns


- `Void`



#### value() 

Returns the value of the current SmallModulus as a string.

It's a string because JS does not support uint64
data type very well






##### Returns


- `string`  integer value of the SmallModulus



#### bitCount() 

Returns the significant bit count of the value of the current SmallModulus.






##### Returns


- `number`  significant bit count of the value of the current SmallModulus



#### isZero() 

Returns whether the value of the current SmallModulus is zero.






##### Returns


- `boolean`  value of the current SmallModulus is zero



#### isPrime() 

Returns whether the value of the current SmallModulus is a prime number.






##### Returns


- `boolean`  value of the current SmallModulus is a prime number



#### save(options) 

Save the SmallModulus as a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.deflate | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string




### src/components/vector.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### type() 

Return the vector type






##### Returns


- `Int32ArrayConstructor` `Uint32ArrayConstructor` `Float64ArrayConstructor`  Constructor used to create the vector



#### size() 

Return the vector size






##### Returns


- `number`  number of elements in the vector



#### printMatrix(options) 

Prints a matrix to the console

This method is mainly used for debugging this library




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.rowSize | `number`  |  | &nbsp; |




##### Returns


- `Void`



#### printVector(options) 

Prints a vector to the console

This method is mainly used for debugging this library




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.printSize&#x3D;4 | `number`  |  | *Optional* |
| options.precision&#x3D;5 | `number`  |  | *Optional* |




##### Returns


- `Void`



#### fromArray(options) 

Convert a typed array to a vector.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.array | `Int32Array` `Uint32Array` `Float64Array`  | Array of data to save to a Vector | &nbsp; |




##### Returns


- `Vector`  Vector whos contents are of the same type as the array passed in.



#### getValue(options) 

Get a value pointed to by the specified index




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.index | `number`  | Vector index | &nbsp; |




##### Returns


- `number`  value in the Vector pointed to by the index



#### resize(options) 

Resizes a vector to the given size




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.size | `number`  | number of elements to resize | &nbsp; |
| options.fill | `number`  | data to fill the vector with | &nbsp; |




##### Returns


- `Void`



#### toArray() 

Copy a vector's data into a Typed Array






##### Returns


- `Int32Array` `Uint32Array` `Float64Array`  Typed Array containing values from the Vector




### src/components/security-level.js


#### none() 

Returns the 'none' security level






##### Returns


- `SecurityLevel.none`  none security level



#### tc128() 

Returns the '128' security level






##### Returns


- `SecurityLevel.tc128`  128 bit security level



#### tc192() 

Returns the '192' security level






##### Returns


- `SecurityLevel.tc192`  192 bit security level



#### tc256() 

Returns the '256' security level






##### Returns


- `SecurityLevel.tc256`  256 bit security level




### src/components/secret-key.js


#### instance()  *private method*

Get the underlying wasm instance






##### Returns


- `instance`  wasm instance



#### inject(options)  *private method*

Inject this object with a raw wasm instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.instance | `instance`  | wasm instance | &nbsp; |




##### Returns


- `Void`



#### save(options) 

Save the Encryption Parameters to a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.compression&#x3D;ComprModeType.none | `ComprModeType`  | activate compression | *Optional* |




##### Returns


- `string`  base64 encoded string



#### load(options) 

Load a SecretKey from a base64 string




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `Object`  | Options | &nbsp; |
| options.context | `Context`  | Encryption context to enforce | &nbsp; |
| options.encoded | `string`  | base64 encoded string | &nbsp; |




##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
