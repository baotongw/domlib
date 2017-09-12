import Q, {Inner} from '../../core' 
import access from './dom-access'

let _getAttr = function(key) {
    let i = 0, nodeLen = this.length
    let node

    for(i; i < nodeLen; i++) {
        node = this[i]

        if(!Q.isDomNode(node)) {
            continue
        }

        return node.getAttribute(key)
    }
}

let _setAttr = function(key, value) {
    let i, node, nodeLen = this.length

    for(i = 0; i < nodeLen; i++ ) {
        node = this[i]
        
        if(!Q.isDomNode(node)) {
            continue
        }
        
        node.setAttribute(key, value + '')
    } 
    
    return this
}

let _attr = function(key, value) {
    if(Q.isUndefined(value)) {
        return _getAttr.call(this, key)
    }

    return _setAttr.call(this, key, value)
}

// 支持的参数类型：
// 1： key-value
// 2： object: {key1: value1, key2: value2}
let attr = access(_attr)

// 删除一个或多个属性，多个属性空格隔开
let removeAttr = function(key) {
    if(Q.isValidString(key)) {
        let attrs = key.split(' ')
        let len = this.length
        let node
        
        for(let i = 0; i < len; i++) {
            node = this[i]

            if(!Q.isDomNode(node)) {
                continue
            }

            attrs.forEach(attr => {
                node.removeAttribute(attr)
            })
        }
    }

    return this
}

// 扩展到对象实例
Inner.prototype.extend({
    attr,
    removeAttr
})