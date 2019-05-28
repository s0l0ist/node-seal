describe('Creating Encryption Parameters', () => {

  describe('computationLevel low', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      const parms = Crypt.createParams({computationLevel: 'low', security: 128})
      expect(parms).toEqual({
        polyDegree: 4096,
        coeffModulus: 4096,
        plainModulus: 786433,
        scale: Math.pow(2, 54),
        security: 128
      })
    })
    test('192-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'low', security: 192})).toEqual({
        polyDegree: 4096,
        coeffModulus: 4096,
        plainModulus: 786433,
        scale: Math.pow(2, 54),
        security: 192
      })
    })
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'low', security: 256})).toEqual({
        polyDegree: 4096,
        coeffModulus: 4096,
        plainModulus: 786433,
        scale: Math.pow(2, 54),
        security: 256
      })
    })
  })

  describe('computationLevel medium', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'medium', security: 128})).toEqual({
        polyDegree: 8192,
        coeffModulus: 8192,
        plainModulus: 786433,
        scale: Math.pow(2, 163),
        security: 128
      })
    })
    test('192-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'medium', security: 192})).toEqual({
        polyDegree: 8192,
        coeffModulus: 8192,
        plainModulus: 786433,
        scale: Math.pow(2, 163),
        security: 192
      })
    })
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'medium', security: 256})).toEqual({
        polyDegree: 8192,
        coeffModulus: 8192,
        plainModulus: 786433,
        scale: Math.pow(2, 163),
        security: 256
      })
    })
  })

  describe('computationLevel high', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'high', security: 128})).toEqual({
        polyDegree: 16384,
        coeffModulus: 16384,
        plainModulus: 786433,
        scale: Math.pow(2, 383),
        security: 128
      })
    })
    test('192-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'high', security: 192})).toEqual({
        polyDegree: 16384,
        coeffModulus: 16384,
        plainModulus: 786433,
        scale: Math.pow(2, 383),
        security: 192
      })
    })
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Crypt = await Seal
      expect(Crypt.createParams({computationLevel: 'high', security: 256})).toEqual({
        polyDegree: 16384,
        coeffModulus: 16384,
        plainModulus: 786433,
        scale: Math.pow(2, 383),
        security: 256
      })
    })
  })
})
