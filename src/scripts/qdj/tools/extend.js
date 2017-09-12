/*
 * @Author: baotong.wang 
 * @Date: 2017-08-21 15:26:49 
 * @Last Modified by: baotong.wang
 * @Last Modified time: 2017-08-23 15:01:56
 * @Description: 实现对象的深浅拷贝
 * @Dependence: qdj.js 
 */

import Q, {Inner} from '../core'

// isDeep: 是否深拷贝
var extend = function (isDeep) {
    var args, 
        base = arguments[0], 
        index = 1, 
        length = arguments.length

    if (typeof isDeep === 'boolean') {
        index++
        base = arguments[1]
    }

    // 处理base不等于对象的场景，处理异常
    if (toString.call(base) !== '[object Object]' && typeof base !== 'function') {
        base = {}
    }

    // 如果传入的参数比预期的少一个，那么表示扩展当前对象
    if (index === length) {
        base = this
        index--
    }

    for(; index < length; index++) {
        _extend(base, arguments[index])
    }

    return base;
}

var _extend = function (base, obj, isDeep) {
    var property;
    var baseProperty;
    var basePropertyType;

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            property = obj[key];
            baseProperty = base[key];

            if (baseProperty === property) {
                continue;
            }

            if (!isDeep) {
                base[key] = obj[key];
                continue;
            }

            basePropertyType = typeof baseProperty

            switch (typeof property) {
                case 'object':
                    baseProperty = basePropertyType === 'object' ? baseProperty : {};
                    _extend(baseProperty, property, isDeep);
                    break;
                case 'array':
                    baseProperty = basePropertyType === 'array' ? baseProperty : [];
                    _extend(baseProperty, property, isDeep);
                    break;
                default:
                    base[key] = obj[key];
                    break;
            }
        }
    }

    return base;
}

Q.extend = Inner.prototype.extend = extend