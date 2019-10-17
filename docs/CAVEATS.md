# Caveats

Our goal is to allow client-side and server-side Javascript to use a well established
homomorphic library. However, there will be several limitations due to transitions from 
C++ to Javascript.

Limitations:

- Dealing with 2^53 numbers (not true 64 bit). Spoiler: Don't exceede ±2^53.
  `BFV` users will inherently adhere to these limitations due to the Int32/UInt32 TypedArrays.
  `CKKS` users will need to keep this in mind even though one of the primary benefits of using
  `CKKS` was to remove the bounds on the initial values to be encrypted.
  
- Generating large keys and saving them in the browser could be problematic.
  We can control NodeJS heap size, but not inside a user's browser. 
  
  Saving keys is very memory intensive especially for `computationLevel`s above low. 
  This is because there's currently no way (that we have found) to use io streams 
  across JS and Web Assembly code, so the strings have to be buffered completely in RAM and 
  they can be very, very large. This holds especially true for `GaloisKeys` where you may hit
  JS max string limits (256MB).
