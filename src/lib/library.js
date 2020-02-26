export const Library = source => {
  let _instance = null

  return {
    get instance() {
      return _instance
    },

    initialize: async () => {
      return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Could not initialize library in time!'))
        }, 10000)

        const module = source()

        module.onRuntimeInitialized = () => {
          clearTimeout(timeout)
          _instance = module
          resolve()
        }
      })
    }
  }
}
