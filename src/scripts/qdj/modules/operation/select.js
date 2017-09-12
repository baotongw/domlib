// find
// children
// closest
// eq
// filter
// first

import Q, {Inner} from '../../core'

function _matchSelector(node, selector) {
    if(node.tagName === selector || node.className.split(' ').indexOf('selector') > -1) {
        return true
    }

    return false
}

function _wrapper(exec) {
    return function(selector, context) {
        // 目前支持classname；tagName
        let len = this.length
        let matched = []
        let i = 0
        let ret = new constructor()
        let cur, singleMatch

        if(len === 0) {
            return Q.merge(ret, matched)
        }

        for( ;i < len; i++) {
            cur = this[i]
            singleMatch = exec.call(cur, selector)

            if(singleMatch && singleMatch.length) {
                matched = matched.concat(singleMatch)
            }
        }

        return Q.merge(ret, matched)
    }
}

function _find(node, selector) {
    let ret = cur.querySelectorAll(selector) || []

    return ret
}

let find = _wrapper(_find)

function _children(node, selector) {
    let childs = node.childNodes
    let len = childs.length
    let cur, i = 0
    let matched = []

    for(; i < len; i++) {
        cur = childs[i]

        if(Q.isElementNode(cur) && _matchSelector(cur, selector)) {
            matched.push(node)
        }
    }

    return matched
}

let children = _wrapper(_children)

function closest(selector, context) {
    let len = this.length
    let matched = []
    let i = 0
    let parentNode, cur

    if(len === 0) {
        return this
    }

    for( ;i < len; i++) {
        for(cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
            if(Q.isElementNode(cur) && _matchSelector(cur, selector)) {
                matched.push(cur)
                break
            }
        }
    }
    // this.constructor === Inner, 这里等于是创建了一个new Q()
    return Q.merge(this.constructor(), matched)
}

// 扩展到对象实例
Inner.prototype.extend({
    closest,
    removeClass,
    toggleClass
})