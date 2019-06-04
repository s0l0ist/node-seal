import source from '../bin/seal.js'
import sourceWasm from '../bin/seal'

import { HE } from './HE'
import * as Class from '../classes'

export const Seal = (async () => {

  /**
   * First, we initialize the library which loads from a WASM file.
   * This file is loaded asynchronously and therefore we must wait
   * until it has fully initialized before calling any other methods.
   */
  const Library = new Class.Library({source, sourceWasm})
  await Library.initialize()

  /**
   * Now, we can instantiate everything else we need.
   *
   * Some are singletons while others are class constructors.
   *
   * We are using singletons as a wrapper around some of the
   * WASM modules and keeps track of internal methods. It also
   * helps prevent a user from initializing the library with
   * different encryption parameters, thus ensuring they are
   * operating in the same context.
   */
  const methods = {
    BatchEncoder: new Class.BatchEncoder({library: Library.instance}),
    CipherText: Class.CipherText,
    CKKSEncoder: new Class.CKKSEncoder({library: Library.instance}),
    Context: new Class.Context({library: Library.instance}),
    Decryptor: new Class.Decryptor({library: Library.instance}),
    DefaultParams: new Class.DefaultParams({library: Library.instance}),
    EncryptionParameters: new Class.EncryptionParameters({library: Library.instance}),
    Encryptor: new Class.Encryptor({library: Library.instance}),
    Evaluator: new Class.Evaluator({library: Library.instance}),
    GaloisKeys: Class.GaloisKeys,
    IntegerEncoder: new Class.IntegerEncoder({library: Library.instance}),
    KeyGenerator: new Class.KeyGenerator({library: Library.instance}),
    Library: Library,
    PlainText: Class.PlainText,
    PublicKey: Class.PublicKey,
    RelinKeys: Class.RelinKeys,
    SchemeType: new Class.SchemeType({library: Library.instance}),
    SecretKey: Class.SecretKey,
    SmallModulus: new Class.SmallModulus({library: Library.instance}),
    Vector: new Class.Vector({library: Library.instance})
  }

  /**
   * Finally, return an instance of the Homomorphic Encryption library
   */
  return new HE({options: methods})
})()
