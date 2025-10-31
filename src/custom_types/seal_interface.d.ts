// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  // @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
  [Symbol.dispose](): void;
  clone(): this;
}
export interface VectorPlaintext extends ClassHandle {
  push_back(_0: Plaintext): void;
  resize(_0: number, _1: Plaintext): void;
  size(): number;
  get(_0: number): Plaintext | undefined;
  set(_0: number, _1: Plaintext): boolean;
}

export interface VectorCiphertext extends ClassHandle {
  push_back(_0: Ciphertext): void;
  resize(_0: number, _1: Ciphertext): void;
  size(): number;
  get(_0: number): Ciphertext | undefined;
  set(_0: number, _1: Ciphertext): boolean;
}

export interface VectorU8 extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface VectorI32 extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface VectorU32 extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface VectorI64 extends ClassHandle {
  size(): number;
  get(_0: number): bigint | undefined;
  push_back(_0: bigint): void;
  resize(_0: number, _1: bigint): void;
  set(_0: number, _1: bigint): boolean;
}

export interface VectorU64 extends ClassHandle {
  size(): number;
  get(_0: number): bigint | undefined;
  push_back(_0: bigint): void;
  resize(_0: number, _1: bigint): void;
  set(_0: number, _1: bigint): boolean;
}

export interface VectorF64 extends ClassHandle {
  size(): number;
  get(_0: number): number | undefined;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
}

export interface VectorModulus extends ClassHandle {
  push_back(_0: Modulus): void;
  resize(_0: number, _1: Modulus): void;
  size(): number;
  get(_0: number): Modulus | undefined;
  set(_0: number, _1: Modulus): boolean;
}

export interface UtilHashFunction extends ClassHandle {
}

export interface ParmsIdType extends ClassHandle {
  values(): any;
}

export interface SecLevelTypeValue<T extends number> {
  value: T;
}
export type SecLevelType = SecLevelTypeValue<0>|SecLevelTypeValue<128>|SecLevelTypeValue<192>|SecLevelTypeValue<256>;

export interface ComprModeTypeValue<T extends number> {
  value: T;
}
export type ComprModeType = ComprModeTypeValue<0>|ComprModeTypeValue<1>|ComprModeTypeValue<2>;

export interface CoeffModulus extends ClassHandle {
}

export interface PlainModulus extends ClassHandle {
}

export interface Modulus extends ClassHandle {
  saveToArray(_0: ComprModeType): VectorU8;
  isZero(): boolean;
  isPrime(): boolean;
  bitCount(): number;
  saveToString(_0: ComprModeType): string;
  loadFromString(_0: EmbindString): void;
  setValue(_0: EmbindString): void;
  value(): string;
  loadFromArray(_0: any): void;
}

export interface EncryptionParameters extends ClassHandle {
  coeffModulus(): VectorModulus;
  plainModulus(): Modulus;
  parmsId(): ParmsIdType;
  saveToArray(_0: ComprModeType): VectorU8;
  scheme(): SchemeType;
  setCoeffModulus(_0: VectorModulus): void;
  setPlainModulus(_0: Modulus): void;
  setPolyModulusDegree(_0: number): void;
  polyModulusDegree(): number;
  saveToString(_0: ComprModeType): string;
  loadFromString(_0: EmbindString): void;
  loadFromArray(_0: any): void;
}

export interface EncryptionParameterQualifiers extends ClassHandle {
  securityLevel: SecLevelType;
  usingFFT: boolean;
  usingNTT: boolean;
  usingBatching: boolean;
  usingFastPlainLift: boolean;
  usingDescendingModulusChain: boolean;
  parametersSet(): boolean;
}

export interface ContextData extends ClassHandle {
  parms(): EncryptionParameters;
  parmsId(): ParmsIdType;
  qualifiers(): EncryptionParameterQualifiers;
  prevContextData(): ContextData;
  nextContextData(): ContextData;
  totalCoeffModulusBitCount(): number;
  chainIndex(): number;
}

export interface SEALContext extends ClassHandle {
  duplicate(): SEALContext;
  getContextData(_0: ParmsIdType): ContextData;
  keyContextData(): ContextData;
  firstContextData(): ContextData;
  lastContextData(): ContextData;
  keyParmsId(): ParmsIdType;
  firstParmsId(): ParmsIdType;
  lastParmsId(): ParmsIdType;
  copy(_0: SEALContext): void;
  move(_0: SEALContext): void;
  parametersSet(): boolean;
  usingKeyswitching(): boolean;
  toHuman(): string;
}

export interface Evaluator extends ClassHandle {
  linearTransformPlain(_0: Ciphertext, _1: VectorPlaintext, _2: GaloisKeys): Ciphertext;
  negate(_0: Ciphertext, _1: Ciphertext): void;
  add(_0: Ciphertext, _1: Ciphertext, _2: Ciphertext): void;
  addPlain(_0: Ciphertext, _1: Plaintext, _2: Ciphertext, _3: MemoryPoolHandle): void;
  sub(_0: Ciphertext, _1: Ciphertext, _2: Ciphertext): void;
  subPlain(_0: Ciphertext, _1: Plaintext, _2: Ciphertext, _3: MemoryPoolHandle): void;
  multiply(_0: Ciphertext, _1: Ciphertext, _2: Ciphertext, _3: MemoryPoolHandle): void;
  multiplyPlain(_0: Ciphertext, _1: Plaintext, _2: Ciphertext, _3: MemoryPoolHandle): void;
  square(_0: Ciphertext, _1: Ciphertext, _2: MemoryPoolHandle): void;
  relinearize(_0: Ciphertext, _1: RelinKeys, _2: Ciphertext, _3: MemoryPoolHandle): void;
  cipherModSwitchToNext(_0: Ciphertext, _1: Ciphertext, _2: MemoryPoolHandle): void;
  cipherModSwitchTo(_0: Ciphertext, _1: ParmsIdType, _2: Ciphertext, _3: MemoryPoolHandle): void;
  plainModSwitchToNext(_0: Plaintext, _1: Plaintext): void;
  plainModSwitchTo(_0: Plaintext, _1: ParmsIdType, _2: Plaintext): void;
  rescaleToNext(_0: Ciphertext, _1: Ciphertext, _2: MemoryPoolHandle): void;
  rescaleTo(_0: Ciphertext, _1: ParmsIdType, _2: Ciphertext, _3: MemoryPoolHandle): void;
  modReduceToNext(_0: Ciphertext, _1: Ciphertext, _2: MemoryPoolHandle): void;
  modReduceTo(_0: Ciphertext, _1: ParmsIdType, _2: Ciphertext, _3: MemoryPoolHandle): void;
  plainTransformToNtt(_0: Plaintext, _1: ParmsIdType, _2: Plaintext, _3: MemoryPoolHandle): void;
  cipherTransformToNtt(_0: Ciphertext, _1: Ciphertext): void;
  cipherTransformFromNtt(_0: Ciphertext, _1: Ciphertext): void;
  rotateColumns(_0: Ciphertext, _1: GaloisKeys, _2: Ciphertext, _3: MemoryPoolHandle): void;
  complexConjugate(_0: Ciphertext, _1: GaloisKeys, _2: Ciphertext, _3: MemoryPoolHandle): void;
  sumElements(_0: Ciphertext, _1: GaloisKeys, _2: SchemeType, _3: Ciphertext, _4: MemoryPoolHandle): void;
  rotateRows(_0: Ciphertext, _1: number, _2: GaloisKeys, _3: Ciphertext, _4: MemoryPoolHandle): void;
  rotateVector(_0: Ciphertext, _1: number, _2: GaloisKeys, _3: Ciphertext, _4: MemoryPoolHandle): void;
  exponentiate(_0: Ciphertext, _1: number, _2: RelinKeys, _3: Ciphertext, _4: MemoryPoolHandle): void;
  applyGalois(_0: Ciphertext, _1: number, _2: GaloisKeys, _3: Ciphertext, _4: MemoryPoolHandle): void;
}

export interface KSwitchKeys extends ClassHandle {
  saveToArray(_0: ComprModeType): VectorU8;
  size(): number;
  saveToString(_0: ComprModeType): string;
  loadFromString(_0: SEALContext, _1: EmbindString): void;
  loadFromArray(_0: SEALContext, _1: any): void;
}

export interface RelinKeys extends KSwitchKeys {
  duplicate(): RelinKeys;
  copy(_0: RelinKeys): void;
  move(_0: RelinKeys): void;
  hasKey(_0: number): boolean;
  getIndex(_0: number): number;
}

export interface GaloisKeys extends KSwitchKeys {
  duplicate(): GaloisKeys;
  copy(_0: GaloisKeys): void;
  move(_0: GaloisKeys): void;
  hasKey(_0: number): boolean;
  getIndex(_0: number): number;
}

export interface SerializablePublicKey extends ClassHandle {
  saveToArray(_0: ComprModeType): VectorU8;
  saveToString(_0: ComprModeType): string;
}

export interface SerializableRelinKeys extends ClassHandle {
  saveToArray(_0: ComprModeType): VectorU8;
  saveToString(_0: ComprModeType): string;
}

export interface SerializableGaloisKeys extends ClassHandle {
  saveToArray(_0: ComprModeType): VectorU8;
  saveToString(_0: ComprModeType): string;
}

export interface SerializableCiphertext extends ClassHandle {
  saveToArray(_0: ComprModeType): VectorU8;
  saveToString(_0: ComprModeType): string;
}

export interface KeyGenerator extends ClassHandle {
  createPublicKeySerializable(): SerializablePublicKey;
  createRelinKeysSerializable(): SerializableRelinKeys;
  secretKey(): SecretKey;
  createPublicKey(_0: PublicKey): void;
  createRelinKeys(_0: RelinKeys): void;
  createGaloisKeys(_0: any, _1: GaloisKeys): void;
  createGaloisKeysSerializable(_0: any): SerializableGaloisKeys;
}

export interface PublicKey extends ClassHandle {
  duplicate(): PublicKey;
  saveToArray(_0: ComprModeType): VectorU8;
  copy(_0: PublicKey): void;
  move(_0: PublicKey): void;
  saveToString(_0: ComprModeType): string;
  loadFromString(_0: SEALContext, _1: EmbindString): void;
  loadFromArray(_0: SEALContext, _1: any): void;
}

export interface SecretKey extends ClassHandle {
  duplicate(): SecretKey;
  saveToArray(_0: ComprModeType): VectorU8;
  copy(_0: SecretKey): void;
  move(_0: SecretKey): void;
  saveToString(_0: ComprModeType): string;
  loadFromString(_0: SEALContext, _1: EmbindString): void;
  loadFromArray(_0: SEALContext, _1: any): void;
}

export interface Plaintext extends ClassHandle {
  duplicate(): Plaintext;
  saveToArray(_0: ComprModeType): VectorU8;
  parmsId(): ParmsIdType;
  pool(): MemoryPoolHandle;
  copy(_0: Plaintext): void;
  move(_0: Plaintext): void;
  shrinkToFit(): void;
  release(): void;
  setZero(): void;
  isZero(): boolean;
  isNttForm(): boolean;
  reserve(_0: number): void;
  resize(_0: number): void;
  capacity(): number;
  coeffCount(): number;
  significantCoeffCount(): number;
  nonzeroCoeffCount(): number;
  scale(): number;
  saveToString(_0: ComprModeType): string;
  loadFromString(_0: SEALContext, _1: EmbindString): void;
  toPolynomial(): string;
  loadFromArray(_0: SEALContext, _1: any): void;
  setScale(_0: any): number;
}

export interface Ciphertext extends ClassHandle {
  duplicate(): Ciphertext;
  saveToArray(_0: ComprModeType): VectorU8;
  parmsId(): ParmsIdType;
  pool(): MemoryPoolHandle;
  copy(_0: Ciphertext): void;
  move(_0: Ciphertext): void;
  release(): void;
  isTransparent(): boolean;
  isNttForm(): boolean;
  reserve(_0: SEALContext, _1: number): void;
  resize(_0: number): void;
  coeffModulusSize(): number;
  polyModulusDegree(): number;
  size(): number;
  sizeCapacity(): number;
  scale(): number;
  correctionFactor(): number;
  saveToString(_0: ComprModeType): string;
  loadFromString(_0: SEALContext, _1: EmbindString): void;
  loadFromArray(_0: SEALContext, _1: any): void;
  setScale(_0: any): number;
}

export interface BatchEncoder extends ClassHandle {
  decodeInt32(_0: Plaintext, _1: MemoryPoolHandle): VectorI32;
  decodeUint32(_0: Plaintext, _1: MemoryPoolHandle): VectorU32;
  slotCount(): number;
  encode(_0: any, _1: Plaintext, _2: EmbindString): void;
  decodeBigInt(_0: Plaintext, _1: boolean, _2: MemoryPoolHandle): any;
}

export interface CKKSEncoder extends ClassHandle {
  decodeDouble(_0: Plaintext, _1: MemoryPoolHandle): VectorF64;
  slotCount(): number;
  encode(_0: any, _1: number, _2: Plaintext, _3: MemoryPoolHandle): void;
}

export interface MemoryPoolHandle extends ClassHandle {
}

export interface MemoryManager extends ClassHandle {
}

export interface MMProf extends ClassHandle {
}

export interface MMProfGlobal extends MMProf {
  getPool(_0: bigint): MemoryPoolHandle;
}

export interface MMProfNew extends MMProf {
  getPool(_0: bigint): MemoryPoolHandle;
}

export interface MMProfFixed extends MMProf {
  getPool(_0: bigint): MemoryPoolHandle;
}

export interface MMProfThreadLocal extends MMProf {
  getPool(_0: bigint): MemoryPoolHandle;
}

export interface Encryptor extends ClassHandle {
  encryptSerializable(_0: Plaintext, _1: MemoryPoolHandle): SerializableCiphertext;
  encryptSymmetricSerializable(_0: Plaintext, _1: MemoryPoolHandle): SerializableCiphertext;
  encryptZeroSerializable(_0: MemoryPoolHandle): SerializableCiphertext;
  setPublicKey(_0: PublicKey): void;
  setSecretKey(_0: SecretKey): void;
  encrypt(_0: Plaintext, _1: Ciphertext, _2: MemoryPoolHandle): void;
  encryptSymmetric(_0: Plaintext, _1: Ciphertext, _2: MemoryPoolHandle): void;
  encryptZero(_0: Ciphertext, _1: MemoryPoolHandle): void;
}

export interface Decryptor extends ClassHandle {
  decrypt(_0: Ciphertext, _1: Plaintext): void;
  invariantNoiseBudget(_0: Ciphertext): number;
}

export interface SchemeTypeValue<T extends number> {
  value: T;
}
export type SchemeType = SchemeTypeValue<0>|SchemeTypeValue<1>|SchemeTypeValue<2>|SchemeTypeValue<3>;

interface EmbindModule {
  VectorPlaintext: {
    new(): VectorPlaintext;
  };
  VectorCiphertext: {
    new(): VectorCiphertext;
  };
  VectorU8: {
    new(): VectorU8;
  };
  VectorI32: {
    new(): VectorI32;
  };
  VectorU32: {
    new(): VectorU32;
  };
  VectorI64: {
    new(): VectorI64;
  };
  VectorU64: {
    new(): VectorU64;
  };
  VectorF64: {
    new(): VectorF64;
  };
  VectorModulus: {
    new(): VectorModulus;
  };
  UtilHashFunction: {
    hashBlockUint64Count: number;
    hashBlockByteCount: number;
  };
  ParmsIdType: {
    new(): ParmsIdType;
    new(_0: ParmsIdType): ParmsIdType;
  };
  SecLevelType: {none: SecLevelTypeValue<0>, tc128: SecLevelTypeValue<128>, tc192: SecLevelTypeValue<192>, tc256: SecLevelTypeValue<256>};
  ComprModeType: {none: ComprModeTypeValue<0>, zlib: ComprModeTypeValue<1>, zstd: ComprModeTypeValue<2>};
  CoeffModulus: {
    MaxBitCount(_0: number, _1: SecLevelType): number;
    BFVDefault(_0: number, _1: SecLevelType): VectorModulus;
    CreateFromArray(_0: number, _1: any): VectorModulus;
  };
  PlainModulus: {
    Batching(_0: number, _1: number): Modulus;
    BatchingVector(_0: number, _1: VectorI32): VectorModulus;
  };
  Modulus: {
    new(): Modulus;
    new(_0: Modulus): Modulus;
  };
  EncryptionParameters: {
    new(_0: SchemeType): EncryptionParameters;
  };
  EncryptionParameterQualifiers: {};
  ContextData: {};
  SEALContext: {
    new(_0: EncryptionParameters, _1: boolean, _2: SecLevelType): SEALContext;
  };
  Evaluator: {
    new(_0: SEALContext): Evaluator;
  };
  KSwitchKeys: {
    new(): KSwitchKeys;
  };
  RelinKeys: {
    new(): RelinKeys;
    new(_0: RelinKeys): RelinKeys;
  };
  GaloisKeys: {
    new(): GaloisKeys;
    new(_0: GaloisKeys): GaloisKeys;
  };
  SerializablePublicKey: {};
  SerializableRelinKeys: {};
  SerializableGaloisKeys: {};
  SerializableCiphertext: {};
  KeyGenerator: {
    new(_0: SEALContext): KeyGenerator;
    new(_0: SEALContext, _1: SecretKey): KeyGenerator;
  };
  PublicKey: {
    new(): PublicKey;
    new(_0: PublicKey): PublicKey;
  };
  SecretKey: {
    new(): SecretKey;
    new(_0: SecretKey): SecretKey;
  };
  Plaintext: {
    new(_0: MemoryPoolHandle): Plaintext;
    new(_0: number, _1: MemoryPoolHandle): Plaintext;
    new(_0: number, _1: number, _2: MemoryPoolHandle): Plaintext;
  };
  Ciphertext: {
    new(_0: MemoryPoolHandle): Ciphertext;
    new(_0: SEALContext, _1: MemoryPoolHandle): Ciphertext;
    new(_0: SEALContext, _1: ParmsIdType, _2: MemoryPoolHandle): Ciphertext;
    new(_0: SEALContext, _1: ParmsIdType, _2: number, _3: MemoryPoolHandle): Ciphertext;
  };
  BatchEncoder: {
    new(_0: SEALContext): BatchEncoder;
  };
  CKKSEncoder: {
    new(_0: SEALContext): CKKSEncoder;
  };
  MemoryPoolHandle: {
    new(): MemoryPoolHandle;
    MemoryPoolHandleGlobal(): MemoryPoolHandle;
    MemoryPoolHandleThreadLocal(): MemoryPoolHandle;
    MemoryPoolHandleNew(_0: boolean): MemoryPoolHandle;
  };
  MemoryManager: {
    GetPool(_0: bigint): MemoryPoolHandle;
  };
  MMProf: {};
  MMProfGlobal: {};
  MMProfNew: {};
  MMProfFixed: {};
  MMProfThreadLocal: {};
  Encryptor: {
    new(_0: SEALContext, _1: PublicKey): Encryptor;
    new(_0: SEALContext, _1: PublicKey, _2: SecretKey): Encryptor;
  };
  Decryptor: {
    new(_0: SEALContext, _1: SecretKey): Decryptor;
  };
  SchemeType: {none: SchemeTypeValue<0>, bfv: SchemeTypeValue<1>, ckks: SchemeTypeValue<2>, bgv: SchemeTypeValue<3>};
  getException(_0: number): string;
  jsArrayUint8FromVec(_0: VectorU8): any;
  jsArrayInt32FromVec(_0: VectorI32): any;
  jsArrayUint32FromVec(_0: VectorU32): any;
  jsArrayFloat64FromVec(_0: VectorF64): any;
  jsArrayStringFromVecInt64(_0: VectorI64): any;
  jsArrayStringFromVecUint64(_0: VectorU64): any;
  jsArrayStringFromVecModulus(_0: VectorModulus): any;
  vecFromArrayUint8(_0: any): VectorU8;
  vecFromArrayInt32(_0: any): VectorI32;
  vecFromArrayUint32(_0: any): VectorU32;
  vecFromArrayFloat64(_0: any): VectorF64;
  vecFromArrayBigInt64(_0: any): VectorI64;
  vecFromArrayBigUint64(_0: any): VectorU64;
  vecFromArrayModulus(_0: any): VectorModulus;
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
