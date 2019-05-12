const Crypt = require('./src/adapters/Crypt')

const schemeType = Crypt.schemeType({type: 'BFV'})
Crypt.initializeLow({schemeType})
Crypt.genKeys()
let encrypted = Crypt.encrypt({value: 2147483647})
let decrypted = Crypt.decrypt({cipherText: encrypted})

console.log('decrypted:', decrypted)
