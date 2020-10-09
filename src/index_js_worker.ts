import sealLibrary from './bin/js/seal'

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
export default async (): Promise<SEALLibrary> =>
  SEALConstructor({
    BatchEncoder: BatchEncoderInit({
      loader: await Loader()
    }),
    CipherText: CipherTextInit({
      loader: await Loader()
    }),
    CKKSEncoder: CKKSEncoderInit({
      loader: await Loader()
    }),
    CoeffModulus: CoeffModulusInit({
      loader: await Loader()
    }),
    ComprModeType: ComprModeTypeInit({
      loader: await Loader()
    }),
    ContextData: ContextDataInit({
      loader: await Loader()
    }),
    Context: ContextInit({
      loader: await Loader()
    }),
    Decryptor: DecryptorInit({
      loader: await Loader()
    }),
    EncryptionParameterQualifiers: EncryptionParameterQualifiersInit({
      loader: await Loader()
    }),
    EncryptionParameters: EncryptionParametersInit({
      loader: await Loader()
    }),
    Encryptor: EncryptorInit({
      loader: await Loader()
    }),
    Evaluator: EvaluatorInit({
      loader: await Loader()
    }),
    Exception: ExceptionInit({
      loader: await Loader()
    }),
    GaloisKeys: GaloisKeysInit({
      loader: await Loader()
    }),
    IntegerEncoder: IntegerEncoderInit({
      loader: await Loader()
    }),
    MemoryPoolHandle: MemoryPoolHandleInit({
      loader: await Loader()
    }),
    Modulus: ModulusInit({
      loader: await Loader()
    }),
    ParmsIdType: ParmsIdTypeInit({
      loader: await Loader()
    }),
    PlainText: PlainTextInit({
      loader: await Loader()
    }),
    PublicKey: PublicKeyInit({
      loader: await Loader()
    }),
    RelinKeys: RelinKeysInit({
      loader: await Loader()
    }),
    SchemeType: SchemeTypeInit({
      loader: await Loader()
    }),
    SecretKey: SecretKeyInit({
      loader: await Loader()
    }),
    SecurityLevel: SecurityLevelInit({
      loader: await Loader()
    }),
    Serializable: SerializableInit({
      loader: await Loader()
    }),
    Vector: VectorInit({
      loader: await Loader()
    })
  })
