/*
 * @Author: baotong.wang 
 * @Date: 2017-08-22 21:55:51 
 * @Last Modified by: baotong.wang
 * @Last Modified time: 2017-09-04 21:47:05
 * @Description: 度假前端库核心文件
 * @Dependence: None 
 */

let qRoot

let Q = function(selector, context, root) {
    let instance = new Inner(selector, context, root)
    return instance
}

Q.version= '0.0.1'
Q.guid = 1
Q.hookKey = 'qdj' + (Q.version + math.random()).replace(/\D/g, '')

let Inner = function(selector, ctx, root) {
    if(!selector) {
        return this
    }

    let context = ctx || document
    let domNodes

    if(typeof selector === 'string' && selector.length) {
        domNodes = context.querySelectorAll(selector)
        this.selector = selector
        this.length = domNodes.length
        this.context = context

        for(let i = 0; i < this.length; i++) {
            this[i] = domNodes[i]
        }
    } else if(selector.nodeType) {
        // 传入的是一个dom节点
        this[0] = selector
        this.length = 1
    }
}

qRoot = Q(document)

Inner.prototype = Q.prototype

window.Q = Q

export default Q

export {
    Inner
}