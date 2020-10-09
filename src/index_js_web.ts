import sealLibrary from 'seal_js_web'

import { NestedLibrary, createLoader } from './loader'
import { SEALLibrary, SEALConstructor } from './implementation/seal'
import { BatchEncoderInit } from './implementation/batch-encoder'
import { CipherTextInit } from './implementation/cipher-text'
import { CKKSEncoderInit } from './implementation/ckks-encoder'
import { CoeffModulusInit } from './implementation/coeff-modulus'
import { ComprModeTypeInit } from './implementation/compr-mode-type'
import { ContextDataInit } from './implementation/context-data'
import { ContextInit } from './implementation/context'
import { DecryptorInit } from './implementation/decryptor'
import { EncryptionParameterQualifiersInit } from './implementation/encryption-parameter-qualifiers'
import { EncryptionParametersInit } from './implementation/encryption-parameters'
import { EncryptorInit } from './implementation/encryptor'
import { EvaluatorInit } from './implementation/evaluator'
import { ExceptionInit } from './implementation/exception'
import { GaloisKeysInit } from './implementation/galois-keys'
import { IntegerEncoderInit } from './implementation/integer-encoder'
import { MemoryPoolHandleInit } from './implementation/memory-pool-handle'
import { ModulusInit } from './implementation/modulus'
import { ParmsIdTypeInit } from './implementation/parms-id-type'
import { PlainTextInit } from './implementation/plain-text'
import { PlainModulusInit } from './implementation/plain-modulus'
import { PublicKeyInit } from './implementation/public-key'
import { RelinKeysInit } from './implementation/relin-keys'
import { SchemeTypeInit } from './implementation/scheme-type'
import { SecretKeyInit } from './implementation/secret-key'
import { SecurityLevelInit } from './implementation/security-level'
import { SerializableInit } from './implementation/serializable'
import { VectorInit } from './implementation/vector'
const Loader = (): Promise<NestedLibrary> => createLoader(sealLibrary)

/**
 * Main export for the library
 */
export default async (): Promise<SEALLibrary> => {
  const loader = await Loader()
  return SEALConstructor({
    BatchEncoder: BatchEncoderInit({
      loader
    }),
    CipherText: CipherTextInit({
      loader
    }),
    CKKSEncoder: CKKSEncoderInit({
      loader
    }),
    CoeffModulus: CoeffModulusInit({
      loader
    }),
    ComprModeType: ComprModeTypeInit({
      loader
    }),
    ContextData: ContextDataInit({
      loader
    }),
    Context: ContextInit({
      loader
    }),
    Decryptor: DecryptorInit({
      loader
    }),
    EncryptionParameterQualifiers: EncryptionParameterQualifiersInit({
      loader
    }),
    EncryptionParameters: EncryptionParametersInit({
      loader
    }),
    Encryptor: EncryptorInit({
      loader
    }),
    Evaluator: EvaluatorInit({
      loader
    }),
    Exception: ExceptionInit({
      loader
    }),
    GaloisKeys: GaloisKeysInit({
      loader
    }),
    IntegerEncoder: IntegerEncoderInit({
      loader
    }),
    MemoryPoolHandle: MemoryPoolHandleInit({
      loader
    }),
    Modulus: ModulusInit({
      loader
    }),
    ParmsIdType: ParmsIdTypeInit({
      loader
    }),
    PlainText: PlainTextInit({
      loader
    }),
    PlainModulus: PlainModulusInit({
      loader
    }),
    PublicKey: PublicKeyInit({
      loader
    }),
    RelinKeys: RelinKeysInit({
      loader
    }),
    SchemeType: SchemeTypeInit({
      loader
    }),
    SecretKey: SecretKeyInit({
      loader
    }),
    SecurityLevel: SecurityLevelInit({
      loader
    }),
    Serializable: SerializableInit({
      loader
    }),
    Vector: VectorInit({
      loader
    })
  })
}