export const Encryptor = ({library, context, publicKey}) => {

  const _getException = library.getException
  const _MemoryPoolHandleGlobal = library.MemoryPoolHandle.MemoryPoolHandleGlobal
  let _instance = null
  try {
    _instance = new library.Encryptor(context.instance, publicKey.instance)
  } catch (e) {
    // eslint-disable-next-line no-nested-ternary
    throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
  }

  return {
    get instance() {
      return _instance
    },
    inject({instance}) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Encrypts a plaintext and stores the result in the destination parameter.
     * Dynamic memory allocations in the process are allocated from the memory
     * pool pointed to by the given MemoryPoolHandle.
     *
     * @param plainText
     * @param cipherText
     * @param pool
     */
    encrypt({plainText, cipherText, pool = _MemoryPoolHandleGlobal()}) {
      try {
        _instance.encrypt(plainText.instance, cipherText.instance, pool)
      } catch (e) {
        // eslint-disable-next-line no-nested-ternary
        throw new Error(typeof e === 'number' ? _getException(e) : e instanceof Error ? e.message : e)
      }
    }
  }
}
