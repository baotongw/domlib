import Q, {Inner} from '../../core' 
import {hasOwn} from '../../tools/meta'
// --> on( events [, selector ] [, data ], handler )

// $node.on('click', '.name', function() {})

// node: 需要绑定事件的节点
// eventName: 绑定的事件名称
// selector: 绑定事件代理时的选择器，目前只支持className：.开头
// data: 传给事件处理函数的预置数据
// handler: 时间处理函数
// isOne: 是否一次性绑定，执行完一次回调就解除绑定

// on('click', foo) data = null
// on('click', 'selector', foo) handler = null
// on('click', 'selector', data, foo) isOne = null
// 这里处理各种可能出现的参数传递
function _on($nodes, eventName, selector, data, handler, isOne) {
    let isDelegate = false
    let argLen = arguments.length

    if(!Q.isString(eventName)) {
        return $nodes
    }

    if(argLen === 3 && Q.isUndefined(data)) {
        if(!Q.isFunction(selector)) {
            return $nodes
        }

        isOne = false
        handler = selector
        data = selector = undefined
    } else if(Q.isUndefined(hander)) {
        handler = data

        if(Q.isString(selector)) {
            // on('click', '.className', foo)
            isDelegate = true
            data = undefined
        } else {
            // on('click', data, foo)
            data = selector
            selector = undefined
        }
    }

    for(; i < len; i++) {
        _addEvent($nodes[i], eventName, selector, data, handler, isOne, isDelegate)
    }

    return $nodes
}

function _addEvent(node, eventName, selector, data, handler, isOne, isDelegate) {
    let hasAddEvent = !!node.addEventListener
    
    if(!hasAddEvent) {
        return this
    }

    let origFunc = handler
    let events = eventName.split(' ')
    let hasHookData = hasOwn.call(node, Q.hookKey)
    let hookData = node[Q.hookKey] || {}
    let hookItem

    if(isDelegate) {
        handler = function(event) {
            let target = event.target

            while(target !== node) {
                // 这里暂时只支持通过className来判断冒泡dom
                // sizzle本身太大了 后续再支持吧
                if(!Q.isElementNode(target) && target.classnName.indexOf(selector) === -1) {
                    target = target.parentNode
                    continue    
                }

                handler.call(origFunc, data)
            }
        }
    }

    let preOneFunc = handler
    // 执行一次移出绑定
    if(isOne) {
        handler = function(event) {
            // Q(node).off(event)
            return preOneFunc.apply(this, arguments)
        }
    }

    handler.guid = Q.guid++ 
    
    // hookData绑定模型
    // hookData = {
    //     click: {
    //         guid: {
    //             originHandler: origFunc,
    //             handler: handler
    //         }
    //     }
    // }

    // 绑定多个事件
    events.forEach(type => {
        let added = false
        let hook

        // 检查是否已经添加过同一个事件handler
        Q.each(hookData, (item, existType) => {
            if(hasHookData && existType === type && item[handler.guid] && item[handler.guid].originHandler === origFunc) {
                // 表示continue
                added = true
                return false
            }
        })

        // 如果没绑定过这个事件
        if(!added) {
            node.addEventListener(type, handler)

            hook = hookData[type] = hookData[type] || {}
            hook.guid = {
                originHandler: origFunc,
                hander: handler
            }
        }
    })

    // 如果没有给dom绑定过数据
    !hasHookData && (node.qHookData = hookData)
}

function _off($nodes, eventName, handler) {
    let len = this.length
    let i = 0, node

    for(; i < len; i++) {
        node = this[i]

        _removeEvent(node, eventName, handler)
    }
}

function _removeEvent(node, eventName, handler) {
    if(!eventName || !Q.isString(eventName)) {
        return
    }

    let events = eventName.split(' ')
    let hasHookData = hasOwn.call(node, Q.hookKey)
    let hookData = node[Q.hookKey] || {}
    let hookItem

    // 如果是空对象就没得删
    if(!Q.isEmptyObject(hookData)) {
        events.forEach(type => {
            hookItem = hookData[type]

            if(hookItem && hookItem) {
                Q.each(hookItem, (hookHandler, guid) => {
                    if(guid === handler.guid || hookHandler.originHandler === handler) {
                        node.removeEventListener && node.removeEventListener(type, eventName)
                        return false
                    }
                })
            }
        })
    }
}

// eventName: string
// selector: string
// data: anything
// handler: function
let on = function(eventName, selector, data, handler) {
    return _on(this, eventName, selector, data, handler)
}

let off = function(eventName, handler) {
    return _off(this, eventName, handler)
}

let one = function(eventName, selector, data, handler) {
    return _on(this, eventName, selector, data, handler, true)
}

let trigger = function(eventName, data) {
    let len = this.length
    let argsLeng = arguments.length
    let hasHookData, hookData, handler

    if(len === 0 || argsLeng === 0 || !Q.isString(eventName)) {
        return this
    }

    // dom集合
    Q.each(this, (node, i) => {
        if(Q.isFunction(node[eventName])) {
            node[eventName].call(node)   
        } else {
            if((hasHookData = hasOwn.call(node, Q.hookKey))) {
                hookData = node[Q.hookKey] || {}
                // dom节点下绑定的事件
                Q.each(hookData, (item, type) => {
                    if(type === eventName) {
                        // 一个事件下的多个hander
                        Q.each(item, handler => {
                            handler.call(node, {
                                type: eventName,
                                data: data
                            })
                        })
                    }
                })
            }
        }
    })
}

// 扩展到对象实例
Inner.prototype.extend({
    on,
    off,
    trigger
})