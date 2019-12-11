export const Encryptor = ({library, context, publicKey}) => {

  const _MemoryPoolHandleGlobal = library.MemoryPoolHandle.MemoryPoolHandleGlobal
  let _instance = new library.Encryptor(context.instance, publicKey.instance)

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
      _instance.encrypt(plainText.instance, cipherText.instance, pool)
    }
  }
}
