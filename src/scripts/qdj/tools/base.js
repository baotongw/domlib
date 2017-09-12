'use strict';

import Q from '../core'
import {toString, hasOwn, getProto} from './meta'

Q.class2type = {};

// Populate the class2type map
['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol', 'WeakMap'].forEach(cls => {
	Q.class2type[ '[object ' + cls + ']' ] = cls.toLowerCase();
});

let base = {
    isWindow: function(obj) {
        return obj != null && obj === obj.window
    },
    isNumeric: function(obj) {
        let type = typeof obj

        return type === 'number' || (type === 'string' && !isNaN(obj - obj)) 
    },
    isString: function(obj) {
        return typeof obj === 'string'
    },
    isValidString: function(obj) {
        return typeof obj === 'string' && obj.length
    },
    isBoolean: function(obj) {
        return typeof obj === 'boolean'
    },
    isBaseType: function(obj) {
        return Q.isNumeric(obj) || Q.isString(obj) || Q.isBoolean(obj)
    },
    isArray: function(arr) {
        if(Array.isArray) {
            return Array.isArray(arr)
        }

        return arr && toString.call(arr) === '[object Array]'
    },    
    isFunction: function(func) {
        return typeof func === 'function'
    },
    isObject: function(obj) {
        return obj && toString.call(obj) === '[object Object]'
    },
    isUndefined: function(obj) {
        return typeof obj === 'undefined'
    },
    // 检查是否是空对象
    isEmptyObject: function(obj) {
        let ret = true

        if(!Q.isObject(obj)) {
            return false
        }

        for(let key in obj) {
            if(hasOwn.call(obj, key)) {
                ret = false
                break
            }
        }

        return ret
    },
    // 检查是否是纯对象
    isPlainObject: function(obj) {
        let ret = false
        let constructor

        try {
            let proto = getProto(obj)
            // Object with no prototype. Object.create(null) are plain.
            if(!proto) {
                return true
            }

            constructor = hasOwn.call(proto, 'constructor') && proto.constructor
            return typeof constructor === 'function' && constructor === Object.prototype.constructor 
        } catch(err) {}
        
        return ret
    },
    // 判断是否是一个类数组对象
    // 规则：有length属性，要么是0，如果不是0 length属性应该是数字
    // 且len - 1肯定应该存在
    // 不是function或者window对象
    // 不能直接判断isArray，说了是类array，肯定不能只是array
    // Q对象是类数组对象
    isArrayLike: function(obj) {
        if(obj instanceof Q) {
            return true
        }

        let len = !!obj && hasOwn.call(obj, 'length') && obj.length
        let type = Q.type(obj);

        if(Q.isFunction(obj) || Q.isWindow(obj)) {
            return false
        }

        return type === 'array' || len === 0 || typeof len === 'number' && len > 0 && obj[len - 1];
    },
    // 获取一个对象的类型名称(小写），比如regexp
    type: function(obj) {
        if(obj == null) {
            return obj + ''
        }

        let t = typeof obj;
        let ret = t === 'object' || t === 'function' ? Q.class2type[toString.call(obj)] || 'object' : t

        return ret
    }
}

let helper = {
    // merge两个数组或者类数组
    merge: function(base, extend) {
        let len = extend.length || 0
        let bi = base.length || 0
        let ei = 0

        for(; ei < len; ei++) {
            base[bi++] = extend[ei]
        }

        base.length = bi
        return base
    },
    makeArray: function(arr, results) {
        let rets = results || []

        if(arr != null) {
            // 使用object包装一下，否则类似一个字符串不能使用（ 'length' in obj ) 来判断
            if(Q.isArrayLike(arr)) {
                Q.merge(rets, typeof arr === 'string' ? [arr] : arr)
            } else {
                rets.push(arr)
            }
        }

        return rets;
    },
    each: function(obj, func) {
        let item, ret

        if(!Q.isFunction(func)) {
            return
        }

        if(Q.isObject(obj)) {
            for(let key in obj) {
                if(ret !== false) {
                    if(hasOwn(obj, key)) {
                        item = obj[key]
                        ret = func.call(item, key, obj)
                    }
                }                
            }
        } else if(Q.isArrayLike(func)) {
            for(let i = 0; i < obj.length; i++) {
                item = obj[i]

                ret = func.call(item, i, obj)
                
                if(ret === false) {
                    break
                }
            }
        }
    }
}

Q.extend(base)
Q.extend(helper)

export default base