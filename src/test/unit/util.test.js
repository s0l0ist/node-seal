import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { Util } from '../../components'

let Morfix = null
let UtilObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  UtilObject = Util(lib)(Morfix)
})

describe('Util', () => {
  test('It should be a static instance', () => {
    expect(UtilObject).toBeDefined()
    expect(typeof UtilObject.constructor).toBe('function')
    expect(UtilObject).toBeInstanceOf(Object)
    expect(UtilObject.constructor).toBe(Object)
    expect(UtilObject.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(UtilObject).toHaveProperty('gcd')
  })
  test('It should return the gcd between two numbers', () => {
    const gcd = UtilObject.gcd('232', 81n)
    console.log('gcd', gcd)
    expect(typeof gcd).toBe('bigint')
  })
})
