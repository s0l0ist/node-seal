// Composition
export const pipe = (...fctns) => x => fctns.reduce((y, f) => f(y), x)
export const compose = (...fctns) => x => fctns.reduceRight((y, f) => f(y), x)

// Equality
export const isDefined = x => typeof x !== 'undefined'
export const isUndefined = x => !isDefined(x)
export const isNull = x => x === null
export const isNotNull = x => !isNull(x)
export const isArray = x => Array.isArray(x)
export const isNotArray = x => !isArray(x)
export const isObject = x => x.constructor === Object
export const isNotObject = x => !isObject(x)
export const isString = x => typeof x === 'string'
export const isNotString = x => !isString(x)
export const isFunction = x => typeof x === 'function'
export const isNotFunction = x => !isFunction(x)
export const isZero = x => x === 0
export const isNonZero = x => !isZero(x)
export const isEmpty = x => pipe(entries, length, isZero)(x)
export const isNotEmpty = x => !isEmpty(x)
export const max = a => b => Math.max(a, b)
export const min = a => b => Math.min(a, b)

// Iterables
export const keys = x => Object.keys(x)
export const values = x => Object.values(x)
export const entries = x => Object.entries(x)
export const forEach = fn => x => x.forEach(fn)
export const map = fn => x => x.map(fn)
export const sort = fn => x => x.sort(fn)
export const filter = fn => x => x.filter(fn)
export const reduce = fn => acc => x => x.reduce(fn, acc)
export const hasKey = key => x => key in x
export const includes = key => x => x.includes(key)
export const join = str => x => x.join(str)

// Custom
export const length = x => x.length
export const exit = (code = 1) => process.exit(code)

export const capitalizeAll = x => (isString(x) ? x.toUpperCase() : '')
export const capitalizeFirst = x =>
  isString(x) ? x.charAt(0).toUpperCase() + x.slice(1) : ''
