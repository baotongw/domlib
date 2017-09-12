const obj = {}
const arr = []
const string = 'baotong.wang'
const toString = Object.prototype.toString
const hasOwn = obj.hasOwnProperty
const getProto = Object.getPrototypeOf
const objProto = getProto(obj)
const objectFunctionString = objProto.constructor.toString()

export {
    toString,
    hasOwn,
    getProto
}
