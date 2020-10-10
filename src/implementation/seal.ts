import {
  BatchEncoderConstructorOptions,
  BatchEncoderDependencies
} from './batch-encoder'
import {
  CipherTextConstructorOptions,
  CipherTextDependencies
} from './cipher-text'
import {
  CKKSEncoderConstructorOptions,
  CKKSEncoderDependencies
} from './ckks-encoder'
import { CoeffModulus, CoeffModulusDependencies } from './coeff-modulus'
import { ComprModeType, ComprModeTypeDependencies } from './compr-mode-type'
import {
  ContextDataConstructorOptions,
  ContextDataDependencies
} from './context-data'
import { ContextConstructorOptions, ContextDependencies } from './context'
import { DecryptorConstructorOptions, DecryptorDependencies } from './decryptor'
import {
  EncryptionParameterQualifiersConstructorOptions,
  EncryptionParameterQualifiersDependencies
} from './encryption-parameter-qualifiers'
import {
  EncryptionParametersConstructorOptions,
  EncryptionParametersDependencies
} from './encryption-parameters'
import { EncryptorConstructorOptions, EncryptorDependencies } from './encryptor'
import { EvaluatorConstructorOptions, EvaluatorDependencies } from './evaluator'
import { Exception, ExceptionDependencies } from './exception'
import {
  GaloisKeysConstructorOptions,
  GaloisKeysDependencies
} from './galois-keys'
import {
  IntegerEncoderConstructorOptions,
  IntegerEncoderDependencies
} from './integer-encoder'
import {
  MemoryPoolHandle,
  MemoryPoolHandleDependencies
} from './memory-pool-handle'
import { ModulusConstructorOptions, ModulusDependencies } from './modulus'
import {
  ParmsIdTypeConstructorOptions,
  ParmsIdTypeDependencies
} from './parms-id-type'
import {
  PlainTextConstructorOptions,
  PlainTextDependencies
} from './plain-text'
import { PlainModulus, PlainModulusDependencies } from './plain-modulus'
import {
  PublicKeyConstructorOptions,
  PublicKeyDependencies
} from './public-key'
import {
  RelinKeysConstructorOptions,
  RelinKeysDependencies
} from './relin-keys'
import { SchemeType, SchemeTypeDependencies } from './scheme-type'
import {
  SecretKeyConstructorOptions,
  SecretKeyDependencies
} from './secret-key'
import { SecurityLevel, SecurityLevelDependencies } from './security-level'
import {
  SerializableConstructorOptions,
  SerializableDependencies
} from './serializable'
import { VectorConstructorOptions, VectorDependencies } from './vector'
import {
  KeyGeneratorConstructorOptions,
  KeyGeneratorDependencies
} from './key-generator'

export type SEALLibrary = {
  readonly BatchEncoder: BatchEncoderConstructorOptions
  readonly CipherText: CipherTextConstructorOptions
  readonly CKKSEncoder: CKKSEncoderConstructorOptions
  readonly CoeffModulus: CoeffModulus
  readonly ComprModeType: ComprModeType
  readonly ContextData: ContextDataConstructorOptions
  readonly Context: ContextConstructorOptions
  readonly Decryptor: DecryptorConstructorOptions
  readonly EncryptionParameterQualifiers: EncryptionParameterQualifiersConstructorOptions
  readonly EncryptionParameters: EncryptionParametersConstructorOptions
  readonly Encryptor: EncryptorConstructorOptions
  readonly Evaluator: EvaluatorConstructorOptions
  readonly Exception: Exception
  readonly GaloisKeys: GaloisKeysConstructorOptions
  readonly KeyGenerator: KeyGeneratorConstructorOptions
  readonly IntegerEncoder: IntegerEncoderConstructorOptions
  readonly MemoryPoolHandle: MemoryPoolHandle
  readonly Modulus: ModulusConstructorOptions
  readonly ParmsIdType: ParmsIdTypeConstructorOptions
  readonly PlainText: PlainTextConstructorOptions
  readonly PlainModulus: PlainModulus
  readonly PublicKey: PublicKeyConstructorOptions
  readonly RelinKeys: RelinKeysConstructorOptions
  readonly SchemeType: SchemeType
  readonly SecretKey: SecretKeyConstructorOptions
  readonly SecurityLevel: SecurityLevel
  readonly Serializable: SerializableConstructorOptions
  readonly Vector: VectorConstructorOptions
}
type SEALConstructorOptions = {
  readonly BatchEncoder: BatchEncoderDependencies
  readonly CipherText: CipherTextDependencies
  readonly CKKSEncoder: CKKSEncoderDependencies
  readonly CoeffModulus: CoeffModulusDependencies
  readonly ComprModeType: ComprModeTypeDependencies
  readonly ContextData: ContextDataDependencies
  readonly Context: ContextDependencies
  readonly Decryptor: DecryptorDependencies
  readonly EncryptionParameterQualifiers: EncryptionParameterQualifiersDependencies
  readonly EncryptionParameters: EncryptionParametersDependencies
  readonly Encryptor: EncryptorDependencies
  readonly Evaluator: EvaluatorDependencies
  readonly Exception: ExceptionDependencies
  readonly GaloisKeys: GaloisKeysDependencies
  readonly KeyGenerator: KeyGeneratorDependencies
  readonly IntegerEncoder: IntegerEncoderDependencies
  readonly MemoryPoolHandle: MemoryPoolHandleDependencies
  readonly Modulus: ModulusDependencies
  readonly ParmsIdType: ParmsIdTypeDependencies
  readonly PlainText: PlainTextDependencies
  readonly PlainModulus: PlainModulusDependencies
  readonly PublicKey: PublicKeyDependencies
  readonly RelinKeys: RelinKeysDependencies
  readonly SchemeType: SchemeTypeDependencies
  readonly SecretKey: SecretKeyDependencies
  readonly SecurityLevel: SecurityLevelDependencies
  readonly Serializable: SerializableDependencies
  readonly Vector: VectorDependencies
}

/**
 * @implements SEAL
 */
export const SEALConstructor = ({
  BatchEncoder,
  CipherText,
  CKKSEncoder,
  CoeffModulus,
  ComprModeType,
  ContextData,
  Context,
  Decryptor,
  EncryptionParameterQualifiers,
  EncryptionParameters,
  Encryptor,
  Evaluator,
  Exception,
  GaloisKeys,
  KeyGenerator,
  IntegerEncoder,
  MemoryPoolHandle,
  Modulus,
  ParmsIdType,
  PlainText,
  PlainModulus,
  PublicKey,
  RelinKeys,
  SchemeType,
  SecretKey,
  SecurityLevel,
  Serializable,
  Vector
}: SEALConstructorOptions): SEALLibrary => {
  // Unfortunately, this library has nested depenencies
  // so we need to load them in order.

  // Define our singletons
  const exception = Exception({})()
  const comprModeType = ComprModeType({})()
  const memoryPoolHandle = MemoryPoolHandle({})()
  const securityLevel = SecurityLevel({})()
  const schemeType = SchemeType({})()

  // Define our constructors (ORDER MATTERS)
  const vector = Vector({ Exception: exception })
  const coeffModulus = CoeffModulus({
    Exception: exception,
    SecurityLevel: securityLevel,
    Vector: vector
  })()
  const modulus = Modulus({
    Exception: exception,
    ComprModeType: comprModeType,
    Vector: vector
  })
  const plainModulus = PlainModulus({
    Exception: exception,
    Modulus: modulus,
    Vector: vector
  })()
  const serializable = Serializable({
    Exception: exception,
    Vector: vector,
    ComprModeType: comprModeType
  })
  const parmsIdType = ParmsIdType({ Exception: exception })
  const plainText = PlainText({
    Exception: exception,
    ComprModeType: comprModeType,
    ParmsIdType: parmsIdType,
    MemoryPoolHandle: memoryPoolHandle,
    Vector: vector
  })
  const cipherText = CipherText({
    Exception: exception,
    ComprModeType: comprModeType,
    ParmsIdType: parmsIdType,
    MemoryPoolHandle: memoryPoolHandle,
    Vector: vector
  })
  const batchEncoder = BatchEncoder({
    Exception: exception,
    MemoryPoolHandle: memoryPoolHandle,
    PlainText: plainText,
    Vector: vector
  })
  const ckksEncoder = CKKSEncoder({
    Exception: exception,
    MemoryPoolHandle: memoryPoolHandle,
    PlainText: plainText,
    Vector: vector
  })
  const encryptionParameterQualifiers = EncryptionParameterQualifiers({})
  const encryptionParameters = EncryptionParameters({
    Exception: exception,
    ComprModeType: comprModeType,
    Modulus: modulus,
    SchemeType: schemeType,
    Vector: vector
  })
  const contextData = ContextData({
    Exception: exception,
    EncryptionParameters: encryptionParameters,
    ParmsIdType: parmsIdType,
    EncryptionParameterQualifiers: encryptionParameterQualifiers
  })
  const context = Context({
    ParmsIdType: parmsIdType,
    ContextData: contextData,
    SecurityLevel: securityLevel
  })
  const decryptor = Decryptor({
    Exception: exception,
    PlainText: plainText
  })
  const encryptor = Encryptor({
    Exception: exception,
    MemoryPoolHandle: memoryPoolHandle,
    CipherText: cipherText,
    Serializable: serializable
  })
  const evaluator = Evaluator({
    Exception: exception,
    MemoryPoolHandle: memoryPoolHandle,
    CipherText: cipherText,
    PlainText: plainText
  })
  const publicKey = PublicKey({
    Exception: exception,
    ComprModeType: comprModeType,
    Vector: vector
  })
  const secretKey = SecretKey({
    Exception: exception,
    ComprModeType: comprModeType,
    Vector: vector
  })
  const relinKeys = RelinKeys({
    Exception: exception,
    ComprModeType: comprModeType,
    Vector: vector
  })
  const galoisKeys = GaloisKeys({
    Exception: exception,
    ComprModeType: comprModeType,
    Vector: vector
  })
  const integerEncoder = IntegerEncoder({
    Exception: exception,
    PlainText: plainText
  })
  const keyGenerator = KeyGenerator({
    Exception: exception,
    PublicKey: publicKey,
    SecretKey: secretKey,
    RelinKeys: relinKeys,
    GaloisKeys: galoisKeys,
    Serializable: serializable
  })

  /**
   * @interface SEAL
   */
  return {
    BatchEncoder: batchEncoder,
    CipherText: cipherText,
    CKKSEncoder: ckksEncoder,
    CoeffModulus: coeffModulus, // Singleton
    ComprModeType: comprModeType, // Singleton
    ContextData: contextData,
    Context: context,
    Decryptor: decryptor,
    EncryptionParameterQualifiers: encryptionParameterQualifiers,
    EncryptionParameters: encryptionParameters,
    Encryptor: encryptor,
    Evaluator: evaluator,
    Exception: exception, // Singleton
    GaloisKeys: galoisKeys,
    KeyGenerator: keyGenerator,
    IntegerEncoder: integerEncoder,
    MemoryPoolHandle: memoryPoolHandle, // Singleton
    Modulus: modulus,
    ParmsIdType: parmsIdType,
    PlainText: plainText,
    PlainModulus: plainModulus, // Singleton
    PublicKey: publicKey,
    RelinKeys: relinKeys,
    SchemeType: schemeType,
    SecretKey: secretKey,
    SecurityLevel: securityLevel, // Singleton
    Serializable: serializable,
    Vector: vector
  }
}
