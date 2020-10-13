import { LoaderOptions, Library, Instance } from './seal'
import { Exception } from './exception'
import { PlainText, PlainTextConstructorOptions } from './plain-text'
import { Context } from './context'

export type IntegerEncoderDependencyOptions = {
  readonly Exception: Exception
  readonly PlainText: PlainTextConstructorOptions
}

export type IntegerEncoderDependencies = {
  ({
    Exception,
    PlainText
  }: IntegerEncoderDependencyOptions): IntegerEncoderConstructorOptions
}

export type IntegerEncoderConstructorOptions = {
  (context: Context): IntegerEncoder
}

export type IntegerEncoder = {
  readonly instance: Instance
  readonly unsafeInject: (instance: Instance) => void
  readonly delete: () => void
  readonly encodeInt32: (
    value: number,
    destination?: PlainText
  ) => PlainText | void
  readonly encodeUint32: (
    value: number,
    destination?: PlainText
  ) => PlainText | void
  readonly decodeInt32: (plainText: PlainText) => number
  readonly decodeUint32: (plainText: PlainText) => number
}

const IntegerEncoderConstructor = (
  library: Library
): IntegerEncoderDependencies => ({
  Exception,
  PlainText
}: IntegerEncoderDependencyOptions): IntegerEncoderConstructorOptions => (
  context
): IntegerEncoder => {
  const Constructor = library.IntegerEncoder
  let _instance: Instance
  try {
    _instance = new Constructor(context.instance)
  } catch (e) {
    throw Exception.safe(e)
  }
  /**
   * @implements IntegerEncoder
   */

  /**
   * @interface IntegerEncoder
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name IntegerEncoder#instance
     * @type {Instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance. No type checking is performed.
     *
     * @private
     * @function
     * @name IntegerEncoder#unsafeInject
     * @param {Instance} instance WASM instance
     */
    unsafeInject(instance: Instance) {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
      _instance = instance
    },

    /**
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name IntegerEncoder#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = undefined
      }
    },

    /**
     * Encode an Int32 value to a PlainText
     *
     * @function
     * @name IntegerEncoder#encodeInt32
     * @param {number} value Integer to encode
     * @param {PlainText} [destination] PlainText to store the encoded data
     * @returns {PlainText|void} PlainText containing the result or void if a destination was supplied
     */
    encodeInt32(value: number, destination?: PlainText): PlainText | void {
      try {
        if (destination) {
          _instance.encodeInt32(value, destination.instance)
          return
        }
        const tempPlain = PlainText()
        _instance.encodeInt32(value, tempPlain.instance)
        return tempPlain
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Encode an Uint32 value to a PlainText
     *
     * @function
     * @name IntegerEncoder#encodeUint32
     * @param {number} value Unsigned integer to encode
     * @param {PlainText} [destination] PlainText to store the encoded data
     * @returns {PlainText|void} PlainText containing the result or void if a destination was supplied
     */
    encodeUint32(value: number, destination?: PlainText): PlainText | void {
      try {
        if (destination) {
          _instance.encodeUint32(value, destination.instance)
          return
        }
        const tempPlain = PlainText()
        _instance.encodeUint32(value, tempPlain.instance)
        return tempPlain
      } catch (e) {
        throw Exception.safe(e)
      }
    },
    /**
     * Decode an Int32 value from a PlainText
     *
     * @function
     * @name IntegerEncoder#decodeInt32
     * @param {PlainText} plainText PlainText to decode
     * @returns {number} Int32 value
     */
    decodeInt32(plainText: PlainText): number {
      try {
        return _instance.decodeInt32(plainText.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    },

    /**
     * Decode an Uint32 value from a PlainText
     *
     * @function
     * @name IntegerEncoder#decodeUint32
     * @param {PlainText} plainText PlainText to decode
     * @returns {number} Uint32 value
     */
    decodeUint32(plainText: PlainText): number {
      try {
        return _instance.decodeUint32(plainText.instance)
      } catch (e) {
        throw Exception.safe(e)
      }
    }
  }
}

export const IntegerEncoderInit = ({
  loader
}: LoaderOptions): IntegerEncoderDependencies => {
  const library: Library = loader.library
  return IntegerEncoderConstructor(library)
}
