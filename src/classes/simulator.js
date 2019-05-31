class Simulator {
  constructor({maxValue, minValue}) {
    this._maxValue = maxValue
    this._minValue = minValue

    this._adder = this.createAdder()
  }

  and(a,b){
    return (a && b) + 0
  }
  or(a,b){
    return (a || b) + 0
  }
  xor(a,b){

    if (this.and(a,b)) {return false + 0}
    if (this.or(a,b)) {return true + 0}
    return false + 0
  }

  fullAdder(a,b,c){
    return {
      c:this.or(this.and(this.xor(a,b),c), this.and(a,b)),  // C is the carry
      s:this.xor(this.xor(a,b),c)         // S is the sum
    }
  }

  pad(s, size) {
    while (s.length < (size || 2)) {s = '0' + s}
    return s
  }
  onesComp(value) {
    return ~value & (Math.pow(2, Math.floor(Math.log2(value))) - 1)
  }

  getBits() {
    return Math.ceil(Math.log2(this._maxValue))
  }
  getMask(value = null){
    return this.onesComp(1 << this.getBits())
  }

  convertNumberToBinaryStringArray(value) {
    return this.pad(((value >>> 0) & this.getMask()).toString(2), this.getBits()).split('').map(x => parseInt(x, 10))
  }

  convertNumberToBinaryString(value) {
    return this.pad(((value >>> 0) & this.getMask()).toString(2), this.getBits())
  }

  createAdder() {
    let adder = Array.from({length: this.getBits()})

    /**
     * Add numbers A + B, get binary string
     *
     * @returns {string} binary string
     */
    return (numberA, numberB, c) => {
      const a = this.convertNumberToBinaryStringArray(numberA)
      const b = this.convertNumberToBinaryStringArray(numberB)
      for (let i = 0; i < this.getBits(); i++) {
        if (i === 0) {
          adder[i] = this.fullAdder(a[this.getBits() - 1], b[this.getBits() - 1], c)
        } else {
          adder[i] = this.fullAdder(a[this.getBits() - 1 - i], b[this.getBits() - 1 - i], adder[i-1].c)
        }
      }
      return {
        s: adder.slice().reverse().map((x) => x.s).join(''),
        c: adder[this.getBits() - 1].c
      }
    }
  }

  add(a, b) {
    return this._adder(a, b, 0)
  }
}

module.exports = Simulator
