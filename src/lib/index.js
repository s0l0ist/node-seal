import source from '../bin/a.out'
import { HE } from './HE'
import * as Class from '../classes'

export const Module = (async () => {

  /**
   * First, we initialize the library which loads from a WASM file
   */
  const Library = new Class.Library({source})
  await Library.initialize()

  /**
   * Then, instantiate everything else we need
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
