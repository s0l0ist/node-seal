const { Seal } = require('../dist/seal.node')
const { performance } = require('perf_hooks')

;(async function() {
  const benchmark = create()
  await benchmark.init()
  // benchmark.exampleBfvPerformanceDefault()
  benchmark.exampleCkksPerformanceDefault()
})()

function create() {
  let seal = null

  function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }

  async function init() {
    seal = await Seal
  }

  function exampleBfvPerformanceDefault() {
    const parms = seal.EncryptionParameters(seal.SchemeType.BFV)
    let polyModulusDegree = 4096
    let smallModulus = seal.SmallModulus('786433')
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(polyModulusDegree, seal.SecurityLevel.tc128)
    )
    parms.setPlainModulus(smallModulus)
    let context = seal.Context(parms, true, seal.SecurityLevel.tc128)
    bfvPerformanceTest(context)

    // Clear data to prevent memory buildup
    context.delete()
    smallModulus.delete()

    polyModulusDegree = 8192
    smallModulus = seal.SmallModulus('786433')
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(polyModulusDegree, seal.SecurityLevel.tc128)
    )
    parms.setPlainModulus(smallModulus)
    context = seal.Context(parms, true, seal.SecurityLevel.tc128)
    bfvPerformanceTest(context)

    // Clear data to prevent memory buildup
    context.delete()
    smallModulus.delete()

    polyModulusDegree = 16384
    smallModulus = seal.SmallModulus('786433')
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(polyModulusDegree, seal.SecurityLevel.tc128)
    )
    parms.setPlainModulus(smallModulus)
    context = seal.Context(parms, true, seal.SecurityLevel.tc128)
    bfvPerformanceTest(context)
  }

  function exampleCkksPerformanceDefault() {
    const parms = seal.EncryptionParameters(seal.SchemeType.CKKS)
    let polyModulusDegree = 4096
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(polyModulusDegree, seal.SecurityLevel.tc128)
    )
    let context = seal.Context(parms, true, seal.SecurityLevel.tc128)
    ckksPerformanceTest(context)

    // Clear data to prevent memory buildup
    context.delete()

    polyModulusDegree = 8192
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(polyModulusDegree, seal.SecurityLevel.tc128)
    )
    context = seal.Context(parms, true, seal.SecurityLevel.tc128)
    ckksPerformanceTest(context)

    // Clear data to prevent memory buildup
    context.delete()

    polyModulusDegree = 16384
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(polyModulusDegree, seal.SecurityLevel.tc128)
    )
    context = seal.Context(parms, true, seal.SecurityLevel.tc128)
    ckksPerformanceTest(context)
  }

  function bfvPerformanceTest(context) {
    let timeStart = 0
    let timeEnd = 0
    let timeDiff = 0

    console.log(context.toHuman())
    process.stdout.write('\r\n')

    const parms = context.firstContextData.parms
    const plainModulus = parms.plainModulus
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

      if (!context.keyContextData.qualifiers.usingBatching) {
        throw new Error('Given encryption parameters do not support batching.')
      }
    }

    const encryptor = seal.Encryptor(context, publicKey)
    const decryptor = seal.Decryptor(context, secretKey)
    const evaluator = seal.Evaluator(context)
    const batchEncoder = seal.BatchEncoder(context)

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
    let timeRotateRowsOneStepSum = 0
    let timeRotateRowsRandomSum = 0
    let timeRotateColumnsSum = 0

    /*
      How many times to run the test?
      */
    const count = 25

    /*
      Populate a vector of values to batch.
      */
    const slotCount = batchEncoder.slotCount
    const array = new Uint32Array(slotCount)
    const plainNumber = Number(plainModulus.value)
    for (let i = 0; i < slotCount; i++) {
      array[i] = Math.floor(randomIntInc(0, plainNumber) % plainNumber)
    }

    process.stdout.write('Running tests ')
    for (let i = 0; i < count; i++) {
      /*
        [Batching]
        There is nothing unusual here. We batch our random plaintext matrix
        into the polynomial. Note how the plaintext we create is of the exactly
        right size so unnecessary reallocations are avoided.
        */
      const plain = seal.PlainText({
        capacity: parms.polyModulusDegree,
        coeffCount: 0
      })
      plain.reserve(polyModulusDegree)
      timeStart = performance.now()
      batchEncoder.encode(array, plain)
      timeEnd = performance.now()

      timeDiff = timeEnd - timeStart
      timeBatchSum += timeDiff

      /*
        [Unbatching]
        We unbatch what we just batched.
        */
      timeStart = performance.now()
      const unbatched = batchEncoder.decode(plain, false)
      timeEnd = performance.now()
      timeUnbatchSum += timeEnd - timeStart
      if (JSON.stringify(unbatched) !== JSON.stringify(array)) {
        throw new Error('Batch/unbatch failed. Something is wrong.')
      }

      /*
        [Encryption]
        We make sure our ciphertext is already allocated and large enough
        to hold the encryption with these encryption parameters. We encrypt
        our random batched matrix here.
        */
      const encrypted = seal.CipherText({ context })
      timeStart = performance.now()
      encryptor.encrypt(plain, encrypted)
      timeEnd = performance.now()
      timeEncryptSum += timeEnd - timeStart

      /*
         [Decryption]
         We decrypt what we just encrypted.
         */
      const plain2 = seal.PlainText({
        capacity: parms.polyModulusDegree,
        coeffCount: 0
      })
      plain2.reserve(polyModulusDegree)
      timeStart = performance.now()
      decryptor.decrypt(encrypted, plain2)
      timeEnd = performance.now()
      timeDecryptSum += timeEnd - timeStart
      if (plain2.toPolynomial() !== plain.toPolynomial()) {
        throw new Error('Encrypt/decrypt failed. Something is wrong.')
      }
      /*
        [Add]
        We create two ciphertexts and perform a few additions with them.
        */
      const encrypted1 = seal.CipherText({ context })
      const encrypted2 = seal.CipherText({ context })
      encryptor.encrypt(batchEncoder.encode(Int32Array.from([i])), encrypted1)
      encryptor.encrypt(
        batchEncoder.encode(Int32Array.from([i + 1])),
        encrypted2
      )
      timeStart = performance.now()
      evaluator.add(encrypted1, encrypted1, encrypted1)
      evaluator.add(encrypted2, encrypted2, encrypted2)
      evaluator.add(encrypted1, encrypted2, encrypted1)
      timeEnd = performance.now()
      timeAddSum += timeEnd - timeStart

      /*
        [Multiply]
        We multiply two ciphertexts. Since the size of the result will be 3,
        and will overwrite the first argument, we reserve first enough memory
        to avoid reallocating during multiplication.
        */
      encrypted1.reserve(context, 3)
      timeStart = performance.now()
      evaluator.multiply(encrypted1, encrypted2, encrypted1)
      timeEnd = performance.now()
      timeMultiplySum += timeEnd - timeStart

      /*
        [Multiply Plain]
        We multiply a ciphertext with a random plaintext. Recall that
        multiply_plain does not change the size of the ciphertext so we use
        encrypted2 here.
        */
      timeStart = performance.now()
      evaluator.multiplyPlain(encrypted2, plain, encrypted2)
      timeEnd = performance.now()
      timeMultiplyPlainSum += timeEnd - timeStart

      /*
        [Square]
        We continue to use encrypted2. Now we square it; this should be
        faster than generic homomorphic multiplication.
        */
      timeStart = performance.now()
      evaluator.square(encrypted2, encrypted2)
      timeEnd = performance.now()
      timeSquareSum += timeEnd - timeStart

      if (context.usingKeyswitching) {
        /*
        [Relinearize]
        Time to get back to encrypted1. We now relinearize it back
        to size 2. Since the allocation is currently big enough to
        contain a ciphertext of size 3, no costly reallocations are
        needed in the process.
        */
        timeStart = performance.now()
        evaluator.relinearize(encrypted1, relinKeys, encrypted1)
        timeEnd = performance.now()
        timeRelinearizeSum += timeEnd - timeStart

        /*
          [Rotate Rows One Step]
          We rotate matrix rows by one step left and measure the time.
          */
        timeStart = performance.now()
        evaluator.rotateRows(encrypted, 1, galoisKeys, encrypted)
        evaluator.rotateRows(encrypted, -1, galoisKeys, encrypted)
        timeEnd = performance.now()
        timeRotateRowsOneStepSum += timeEnd - timeStart

        /*
          [Rotate Rows Random]
          We rotate matrix rows by a random number of steps. This is much more
          expensive than rotating by just one step.
          */
        const rowSize = batchEncoder.slotCount / 2
        const randomRotation = randomIntInc(0, rowSize)
        timeStart = performance.now()
        evaluator.rotateRows(encrypted, randomRotation, galoisKeys, encrypted)
        timeEnd = performance.now()
        timeRotateRowsRandomSum += timeEnd - timeStart

        /*
          [Rotate Columns]
          Nothing surprising here.
          */
        timeStart = performance.now()
        evaluator.rotateColumns(encrypted, galoisKeys, encrypted)
        timeEnd = performance.now()
        timeRotateColumnsSum += timeEnd - timeStart
      }

      // Cleanup
      plain.delete()
      plain2.delete()
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
    const avgRotateRowsOneStep = Math.round(
      (timeRotateRowsOneStepSum * 1000) / (2 * count)
    )
    const avgRotateRowsRandom = Math.round(
      (timeRotateRowsRandomSum * 1000) / count
    )
    const avgRotateColumns = Math.round((timeRotateColumnsSum * 1000) / count)

    console.log(`Average batch: ${avgBatch} microseconds`)
    console.log(`Average unbatch: ${avgUnbatch} microseconds`)
    console.log(`Average encrypt: ${avgEncrypt} microseconds`)
    console.log(`Average decrypt: ${avgDecrypt} microseconds`)
    console.log(`Average add: ${avgAdd} microseconds`)
    console.log(`Average multiply: ${avgMultiply} microseconds`)
    console.log(`Average multiply plain: ${avgMultiplyPlain} microseconds`)
    console.log(`Average square: ${avgSquare} microseconds`)
    if (context.usingKeyswitching) {
      console.log(`Average relinearize: ${avgRelinearize} microseconds`)
      console.log(
        `Average rotate row one step: ${avgRotateRowsOneStep} microseconds`
      )
      console.log(
        `Average rotate row random: ${avgRotateRowsRandom} microseconds`
      )
      console.log(
        `Average rotate column random: ${avgRotateColumns} microseconds`
      )
    }
    console.log('')
  }

  function ckksPerformanceTest(context) {
    let timeStart = 0
    let timeEnd = 0
    let timeDiff = 0

    console.log(context.toHuman())
    process.stdout.write('\r\n')

    const parms = context.firstContextData.parms
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

      if (!context.keyContextData.qualifiers.usingBatching) {
        throw new Error('Given encryption parameters do not support batching.')
      }
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

    /*
      How many times to run the test?
      */
    const count = 25

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
      encryptor.encrypt(
        ckksEncoder.encode(Float64Array.from([i]), scale),
        encrypted1
      )
      encryptor.encrypt(
        ckksEncoder.encode(Float64Array.from([i + 1]), scale),
        encrypted2
      )
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
        const randomRotation = randomIntInc(0, ckksEncoder.slotCount)
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
      }

      // Cleanup
      plain.delete()
      plain2.delete()
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
    }
    console.log('')
  }

  return {
    init,
    exampleBfvPerformanceDefault,
    exampleCkksPerformanceDefault
  }
}
