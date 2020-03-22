export const pipe = (...functions) => x => functions.reduce((y, f) => f(y), x)
export const entries = x => Object.entries(x)
export const reduce = fn => acc => x => x.reduce(fn, acc)

export const applyDependencies = (...dependencies) => module =>
  module.apply(null, dependencies)

const addToComponents = dep => (prev, [key, val]) => ({
  ...prev,
  [key]: val(dep)
})

export const addLibraryToComponents = library =>
  pipe(entries, reduce(addToComponents(library))({}))
