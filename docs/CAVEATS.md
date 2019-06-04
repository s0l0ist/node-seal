# Caveats

Our goal is to allow client-side and server-side Javascript to use a well established
homomorphic library. However, there will be several limitations due to transitions from 
C++ to Javascript.

Limitations:

- Dealing with 2^53 numbers (not true 64 bit). 
  JS Arrays may infer the wrong type definition for the elements inside.
  For consistent results, use a TypedArray.
  
- Generating large keys and saving them in the browser could be problematic.
  We can control NodeJS heap size, but not inside a user's browser. 
  
  Saving keys is very memory intensive especially for `computationLevel`s above low. 
  This is because there's currently no way (that we have found) to use io streams 
  across JS and Web Assembly code, so the strings have to be buffered completely in RAM and 
  they can be very, very large. This holds especially true for `GaloisKeys`.
  
- Performance is less than the C++ native library despite being converted to Web Assembly. 
  This is mainly due to poorly optimized SIMD, random number generator, 
  slow memory allocations, etc. We have not benchmarked them directly, but the slowdown
  is noticeable.
  
- By default, we encrypt/decrypt arrays (typed) of data. If you're encrypting a single
  integer (Int32/UInt32) you will receive back a TypedArray of length 1 containing the 
  decrypted result. We do this because we _want_ to have batching mode enabled for both 
  `BFV` and `CKKS` schemes by default.
  
- If you specify a JS Array with JS Numbers and the elements are greater than the bounds 
  of an Int32/UInt32, the data will be treated as a C++ 'double' and may cause undesirable
  results. __Why?__ For users who want to get started with both Scheme Types 
  with some small test data without needing to think about TypedArrays.
