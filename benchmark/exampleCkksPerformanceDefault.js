const { Seal } = require('../dist/seal.node')
const { performance } = require('perf_hooks')

;(async function() {
  const benchmark = create()
  await benchmark.init()
  benchmark.exampleCkksPerformanceDefault()
})()

function create() {
  let seal = null

  function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }

  async function init() {
    seal = await Seal()
  }

  function exampleCkksPerformanceDefault() {
    const parms = seal.EncryptionParameters(seal.SchemeType.CKKS)
    let polyModulusDegree = 4096
    let coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(coeffModulus)
    let context = seal.Context(parms)
    ckksPerformanceTest(context, seal)

    // Clear data to prevent memory buildup
    context.delete()
    coeffModulus.delete()

    polyModulusDegree = 8192
    coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(coeffModulus)
    context = seal.Context(parms)
    ckksPerformanceTest(context, seal)

    // Clear data to prevent memory buildup
    context.delete()
    coeffModulus.delete()

    polyModulusDegree = 16384
    coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(coeffModulus)
    context = seal.Context(parms)
    ckksPerformanceTest(context, seal)

    // Clear data to prevent memory buildup
    context.delete()
    coeffModulus.delete()
  }

  function ckksPerformanceTest(context, seal) {
    let timeStart = 0
    let timeEnd = 0
    let timeDiff = 0

    console.log(context.toHuman())

    const firstContextData = context.firstContextData
    const parms = firstContextData.parms
    const polyModulusDegree = parms.polyModulusDegree

    process.stdout.write('Generating secret/public keys: ')
    timeStart = performance.now()
    const keyGenerator = seal.KeyGenerator(context)
    timeEnd = performance.now()
    process.stdout.write(
      `Done [${Math.round((timeEnd - timeStart) * 1000)} microseconds]\r\n`
    )
    const secretKey = keyGenerator.getSecretKey()
    const publicKey = keyGenerator.getPublicKey()

    const relinKeys = seal.RelinKeys()
    const galoisKeys = seal.GaloisKeys()

    if (context.usingKeyswitching) {
      process.stdout.write('Generating relinearization keys: ')
      timeStart = performance.now()
      relinKeys.move(keyGenerator.genRelinKeys())
      timeEnd = performance.now()
      process.stdout.write(
        `Done [${Math.round((timeEnd - timeStart) * 1000)} microseconds]\r\n`
      )
      process.stdout.write('Generating Galois keys: ')
      timeStart = performance.now()
      galoisKeys.move(keyGenerator.genGaloisKeys())
      timeEnd = performance.now()
      process.stdout.write(
        `Done [${Math.round((timeEnd - timeStart) * 1000)} microseconds]\r\n`
      )

      const contextData = context.keyContextData
      const qualifiers = contextData.qualifiers
      if (!qualifiers.usingBatching) {
        throw new Error('Given encryption parameters do not support batching.')
      }
      // Cleanup
      contextData.delete()
      qualifiers.delete()
    }

    const encryptor = seal.Encryptor(context, publicKey)
    const decryptor = seal.Decryptor(context, secretKey)
    const evaluator = seal.Evaluator(context)
    const ckksEncoder = seal.CKKSEncoder(context)

    /*
      These will hold the total times used by each operation.
      */
    let timeBatchSum = 0
    let timeUnbatchSum = 0
    let timeEncryptSum = 0
    let timeDecryptSum = 0
    let timeAddSum = 0
    let timeMultiplySum = 0
    let timeMultiplyPlainSum = 0
    let timeSquareSum = 0
    let timeRelinearizeSum = 0
    let timeRescaleSum = 0
    let timeRotateOneStepSum = 0
    let timeRotateRandomSum = 0
    let timeConjugateSum = 0
    let timeSumElements = 0
    let timeDotProduct = 0

    /*
      How many times to run the test?
      */
    const count = 10

    /*
      Populate a vector of values to batch.
      */
    const slotCount = ckksEncoder.slotCount
    const array = new Float64Array(slotCount)
    for (let i = 0; i < slotCount; i++) {
      array[i] = 1.001 * i
    }

    process.stdout.write('Running tests ')
    for (let i = 0; i < count; i++) {
      /*
      [Encoding]
      For scale we use the square root of the last coeff_modulus prime
      from parms.
      */
      const plain = seal.PlainText({
        capacity: polyModulusDegree * parms.coeffModulus.length,
        coeffCount: 0
      })
      const scale = Math.floor(Math.sqrt(parms.coeffModulus.slice(-1)))
      timeStart = performance.now()
      ckksEncoder.encode(array, scale, plain)
      timeEnd = performance.now()

      timeDiff = timeEnd - timeStart
      timeBatchSum += timeDiff

      /*
      [Decoding]
      */
      timeStart = performance.now()
      ckksEncoder.decode(plain)
      timeEnd = performance.now()
      timeUnbatchSum += timeEnd - timeStart

      /*
      [Encryption]
      */
      const encrypted = seal.CipherText({
        context
      })
      timeStart = performance.now()
      encryptor.encrypt(plain, encrypted)
      timeEnd = performance.now()
      timeEncryptSum += timeEnd - timeStart

      /*
      [Decryption]
      */
      const plain2 = seal.PlainText({
        capacity: polyModulusDegree,
        coeffCount: 0
      })
      plain2.reserve(polyModulusDegree)
      timeStart = performance.now()
      decryptor.decrypt(encrypted, plain2)
      timeEnd = performance.now()
      timeDecryptSum += timeEnd - timeStart

      /*
      [Add]
      */
      const encrypted1 = seal.CipherText({ context })
      const encrypted2 = seal.CipherText({ context })
      const plain3 = ckksEncoder.encode(Float64Array.from([i]), scale)
      const plain4 = ckksEncoder.encode(Float64Array.from([i + 1]), scale)
      encryptor.encrypt(plain3, encrypted1)
      encryptor.encrypt(plain4, encrypted2)
      timeStart = performance.now()
      evaluator.add(encrypted1, encrypted1, encrypted1)
      evaluator.add(encrypted2, encrypted2, encrypted2)
      evaluator.add(encrypted1, encrypted2, encrypted1)
      timeEnd = performance.now()
      timeAddSum += timeEnd - timeStart

      /*
      [Multiply]
      */
      encrypted1.reserve(context, 3)
      timeStart = performance.now()
      evaluator.multiply(encrypted1, encrypted2, encrypted1)
      timeEnd = performance.now()
      timeMultiplySum += timeEnd - timeStart

      /*
      [Multiply Plain]
      */
      timeStart = performance.now()
      evaluator.multiplyPlain(encrypted2, plain, encrypted2)
      timeEnd = performance.now()
      timeMultiplyPlainSum += timeEnd - timeStart

      /*
      [Square]
      */
      timeStart = performance.now()
      evaluator.square(encrypted2, encrypted2)
      timeEnd = performance.now()
      timeSquareSum += timeEnd - timeStart

      if (context.usingKeyswitching) {
        /*
        [Relinearize]
        */
        timeStart = performance.now()
        evaluator.relinearize(encrypted1, relinKeys, encrypted1)
        timeEnd = performance.now()
        timeRelinearizeSum += timeEnd - timeStart

        /*
        [Rescale]
        */
        timeStart = performance.now()
        evaluator.rescaleToNext(encrypted, encrypted)
        timeEnd = performance.now()
        timeRescaleSum += timeEnd - timeStart

        /*
        [Rotate Vector]
        */
        timeStart = performance.now()
        evaluator.rotateVector(encrypted, 1, galoisKeys, encrypted)
        evaluator.rotateVector(encrypted, -1, galoisKeys, encrypted)
        timeEnd = performance.now()
        timeRotateOneStepSum += timeEnd - timeStart

        /*
        [Rotate Vector Random]
        */
        const randomRotation = randomIntInc(0, ckksEncoder.slotCount) - 1
        timeStart = performance.now()
        evaluator.rotateVector(encrypted, randomRotation, galoisKeys, encrypted)
        timeEnd = performance.now()
        timeRotateRandomSum += timeEnd - timeStart

        /*
        [Complex Conjugate]
        */
        timeStart = performance.now()
        evaluator.complexConjugate(encrypted, galoisKeys, encrypted)
        timeEnd = performance.now()
        timeConjugateSum += timeEnd - timeStart

        /*
        [Sum Elements]
         */
        timeStart = performance.now()
        evaluator.sumElements(encrypted, galoisKeys, parms.scheme, encrypted)
        timeEnd = performance.now()
        timeSumElements += timeEnd - timeStart

        /*
        [Dot Product]
         */
        timeStart = performance.now()
        evaluator.dotProduct(
          encrypted,
          encrypted,
          relinKeys,
          galoisKeys,
          parms.scheme,
          encrypted
        )
        timeEnd = performance.now()
        timeDotProduct += timeEnd - timeStart
      }

      // Cleanup
      plain.delete()
      plain2.delete()
      plain3.delete()
      plain4.delete()
      encrypted.delete()
      encrypted1.delete()
      encrypted2.delete()

      process.stdout.write('.')
    }
    process.stdout.write(' Done\r\n\r\n')

    const avgBatch = Math.round((timeBatchSum * 1000) / count)
    const avgUnbatch = Math.round((timeUnbatchSum * 1000) / count)
    const avgEncrypt = Math.round((timeEncryptSum * 1000) / count)
    const avgDecrypt = Math.round((timeDecryptSum * 1000) / count)
    const avgAdd = Math.round((timeAddSum * 1000) / (3 * count))
    const avgMultiply = Math.round((timeMultiplySum * 1000) / count)
    const avgMultiplyPlain = Math.round((timeMultiplyPlainSum * 1000) / count)
    const avgSquare = Math.round((timeSquareSum * 1000) / count)
    const avgRelinearize = Math.round((timeRelinearizeSum * 1000) / count)
    const avgRescale = Math.round((timeRescaleSum * 1000) / count)
    const avgRotateOneStep = Math.round(
      (timeRotateOneStepSum * 1000) / (2 * count)
    )
    const avgRotateRandom = Math.round((timeRotateRandomSum * 1000) / count)
    const avgConjugate = Math.round((timeConjugateSum * 1000) / count)
    const avgSumElements = Math.round((timeSumElements * 1000) / count)
    const avgDotProduct = Math.round((timeDotProduct * 1000) / count)

    console.log(`Average encode: ${avgBatch} microseconds`)
    console.log(`Average decode: ${avgUnbatch} microseconds`)
    console.log(`Average encrypt: ${avgEncrypt} microseconds`)
    console.log(`Average decrypt: ${avgDecrypt} microseconds`)
    console.log(`Average add: ${avgAdd} microseconds`)
    console.log(`Average multiply: ${avgMultiply} microseconds`)
    console.log(`Average multiply plain: ${avgMultiplyPlain} microseconds`)
    console.log(`Average square: ${avgSquare} microseconds`)
    if (context.usingKeyswitching) {
      console.log(`Average relinearize: ${avgRelinearize} microseconds`)
      console.log(`Average rescale: ${avgRescale} microseconds`)
      console.log(
        `Average rotate vector one step: ${avgRotateOneStep} microseconds`
      )
      console.log(
        `Average rotate vector random: ${avgRotateRandom} microseconds`
      )
      console.log(`Average complex conjugate: ${avgConjugate} microseconds`)
      console.log(`Average sum elements: ${avgSumElements} microseconds`)
      console.log(`Average dot product: ${avgDotProduct} microseconds`)
    }
    console.log('')

    // Cleanup
    parms.delete()
    firstContextData.delete()
    context.delete()
    keyGenerator.delete()
    secretKey.delete()
    publicKey.delete()
    relinKeys.delete()
    galoisKeys.delete()
    evaluator.delete()
    ckksEncoder.delete()
    encryptor.delete()
    decryptor.delete()
  }

  return {
    init,
    exampleCkksPerformanceDefault
  }
}
