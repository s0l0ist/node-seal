const { Seal } = require('../dist/node/wasm')
const { performance } = require('perf_hooks')

;(async function () {
  const benchmark = create()
  await benchmark.init()
  benchmark.exampleBfvPerformanceDefault()
})()

function create() {
  let seal = null

  function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }

  async function init() {
    seal = await Seal()
  }

  function exampleBfvPerformanceDefault() {
    const parms = seal.EncryptionParameters(seal.SchemeType.BFV)
    let polyModulusDegree = 4096
    let modulus = seal.Modulus('786433')
    let coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(coeffModulus)
    parms.setPlainModulus(modulus)
    let context = seal.Context(parms)
    bfvPerformanceTest(context, seal)

    // Clear data to prevent memory buildup
    context.delete()
    modulus.delete()
    coeffModulus.delete()

    polyModulusDegree = 8192
    modulus = seal.Modulus('786433')
    coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(coeffModulus)
    parms.setPlainModulus(modulus)
    context = seal.Context(parms)
    bfvPerformanceTest(context, seal)

    // Clear data to prevent memory buildup
    context.delete()
    modulus.delete()
    coeffModulus.delete()

    polyModulusDegree = 16384
    modulus = seal.Modulus('786433')
    coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
    parms.setPolyModulusDegree(polyModulusDegree)
    parms.setCoeffModulus(coeffModulus)
    parms.setPlainModulus(modulus)
    context = seal.Context(parms)
    bfvPerformanceTest(context, seal)

    // Clear data to prevent memory buildup
    context.delete()
    modulus.delete()
    coeffModulus.delete()
  }

  function bfvPerformanceTest(context, seal) {
    let timeStart = 0
    let timeEnd = 0
    let timeDiff = 0

    console.log(context.toHuman())

    const firstContextData = context.firstContextData
    const parms = firstContextData.parms
    const plainModulus = parms.plainModulus
    const polyModulusDegree = parms.polyModulusDegree

    process.stdout.write('Generating secret/public keys: ')
    timeStart = performance.now()
    const keyGenerator = seal.KeyGenerator(context)
    timeEnd = performance.now()
    process.stdout.write(
      `Done [${Math.round((timeEnd - timeStart) * 1000)} microseconds]\r\n`
    )
    const secretKey = keyGenerator.secretKey()
    const publicKey = keyGenerator.publicKey()

    const relinKeys = seal.RelinKeys()
    const galoisKeys = seal.GaloisKeys()

    if (context.usingKeyswitching) {
      process.stdout.write('Generating relinearization keys: ')
      timeStart = performance.now()
      relinKeys.move(keyGenerator.relinKeysLocal())
      timeEnd = performance.now()
      process.stdout.write(
        `Done [${Math.round((timeEnd - timeStart) * 1000)} microseconds]\r\n`
      )
      process.stdout.write('Generating Galois keys: ')
      timeStart = performance.now()
      galoisKeys.move(keyGenerator.galoisKeysLocal())
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
    let timeSumElements = 0
    let timeDotProduct = 0
    let timeDotProductPlain = 0

    /*
     How many times to run the test?
     */
    const count = 10

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
      const plain3 = batchEncoder.encode(Int32Array.from([i]))
      const plain4 = batchEncoder.encode(Int32Array.from([i + 1]))
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
        const rowSize = batchEncoder.slotCount / 2 - 1
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

        /*
         [Sum Elements]
         All items in the cipher are summed and the summation is found in
         each of the underlying plaintext slots.
         */
        timeStart = performance.now()
        evaluator.sumElements(encrypted, galoisKeys, parms.scheme, encrypted)
        timeEnd = performance.now()
        timeSumElements += timeEnd - timeStart

        /*
         [Dot Product]
         The internal product is calculated (cipher.cipher) and the result is found in
         each of the underlying plaintext slots.
         */
        encryptor.encrypt(plain, encrypted2)
        encrypted2.reserve(context, 3)
        timeStart = performance.now()
        evaluator.dotProduct(
          encrypted2,
          encrypted2,
          relinKeys,
          galoisKeys,
          parms.scheme,
          encrypted
        )
        timeEnd = performance.now()
        timeDotProduct += timeEnd - timeStart

        /*
         [Dot Product Plain]
         The internal product is calculated (cipher.plain) and the result is found in
         each of the underlying plaintext slots.
         */
        encryptor.encrypt(plain, encrypted2)
        encrypted2.reserve(context, 3)
        timeStart = performance.now()
        evaluator.dotProductPlain(
          encrypted2,
          plain,
          galoisKeys,
          parms.scheme,
          encrypted
        )
        timeEnd = performance.now()
        timeDotProductPlain += timeEnd - timeStart
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
    const avgRotateRowsOneStep = Math.round(
      (timeRotateRowsOneStepSum * 1000) / (2 * count)
    )
    const avgRotateRowsRandom = Math.round(
      (timeRotateRowsRandomSum * 1000) / count
    )
    const avgRotateColumns = Math.round((timeRotateColumnsSum * 1000) / count)
    const avgSumElements = Math.round((timeSumElements * 1000) / count)
    const avgDotProduct = Math.round((timeDotProduct * 1000) / count)
    const avgDotProductPlain = Math.round((timeDotProductPlain * 1000) / count)

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
      console.log(`Average rotate column: ${avgRotateColumns} microseconds`)
      console.log(`Average sum elements: ${avgSumElements} microseconds`)
      console.log(`Average dot product: ${avgDotProduct} microseconds`)
      console.log(
        `Average dot product plain: ${avgDotProductPlain} microseconds`
      )
    }
    console.log('')

    // Cleanup
    parms.delete()
    firstContextData.delete()
    plainModulus.delete()
    context.delete()
    keyGenerator.delete()
    secretKey.delete()
    publicKey.delete()
    relinKeys.delete()
    galoisKeys.delete()
    evaluator.delete()
    batchEncoder.delete()
    encryptor.delete()
    decryptor.delete()
  }

  return {
    init,
    exampleBfvPerformanceDefault
  }
}
