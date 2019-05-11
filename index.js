const Crypt = require('./src/adapters/Crypt')

const schemeType = Crypt.schemeType({type: 'BFV'})
Crypt.initializeLow({schemeType})
Crypt.genKeys()
console.log(Crypt.secretKey())
