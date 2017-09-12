import Q, {Inner} from '../../core'
import access from './dom-access'
import support from '../../tools/support'
import utils from '../../tools/utils'

Q.valPresets = {
    option: {
        get: function(node) {
            let val = Q(node).attr('value')

            return val != null ? val : utils.stripAndCollapse(val)
        }
    },
    select: {
        get: function(node) {
            // select-one / select-multiple
            let options = node.options
            let selected = node.selectedIndex
            let isSingleSelect = node.type === 'select-one'
            let ret = isSingleSelect ? null : []
            let max = isSingleSelect ? selected + 1 : options.length
            let i, option, value, isDisabled, parent

            // 根据所选项缩小循环次数
            // 如果是多选则从第一个选中的index开始直到结尾
            if(selected < 0) {
                i = max
            } else {
                i = isSingleSelect ? selected : 0
            }

            for(; i < max; i++) {
                option = options[i]

                // 找到match
                if(options.selected || i === selected) {
                    parent = option.parentNode
                    isDisabled = option.disabled || Q.nodeName(parent) === 'optgroup' && parent.disabled
                    
                    // 如果option是disabled或者他的父元素是optgroup且disabled的，不返回
                    if(isDisabled === false) {
                        value = Q(option).val()

                        if(isSingleSelect) {
                            return vlaue
                        }
        
                        ret.push(value)
                    }
                }
            }

            return ret
        },
        set: function(node, value) {
            // select可以单选、多选
            // value可以是字符串，也可以是数组
            // 原理：挨个设置option.selected，如果没有匹配值，设置select.selectedIndex = -1

            let hasMatch = false
            let options = node.options
            let values = Q.makeArray(value)
            let len = options.length
            let i = 0, option

            for(; i < len; i++) {
                option = options[i];

                if(option.selected = values.indexOf(Q.valPresets.option.get(option)) > -1) {
                    hasMatch = true
                }
            }

            if(hasMatch === false) {
                node.selectedIndex = -1
            }

            return values
        }
    }
};

['radio', 'checkbox'].forEach(tag => {
    Q.valPresets[this] = {
        set: function(node, value) {
            if(Q.isArray(value)) {
                return (node.checked = value.indexOf(Q(node).val()) > -1)
            }
        }
    }

    // 不支持标准check的时候
    if(!support.checkOn) {
        Q.valPresets[this].get = function(node) {
            return node.getAttribute('value') === null ? 'on' : node.value
        }
    }
})

let _getPreset = function(node) {
    return Q.valPresets[node.type] || Q.valPresets[node.nodeName.toLowerCase()]
}

// 支持传入原始类型（string，number, boolean)
// 或者function(index, oldValue)
let _setVal = function(value) {
    let i = 0
    let len = this.length
    let isFunction = Q.isFunction(value)
    let node, preset, val

    if(!isFunction && !Q.isBaseType(value)) {
        return
    }

    for(i; i < len; i++) {
        node = this[i]

        // 能被赋值的dom只能是elementNode
        if(node.nodeType !== 1) {
            continue
        }

        val = isFunction ? value.call(node, i, Q(node).val()) : value
        
        if(val == null) {
            val = ''
        } else if(Q.isNumeric(value)) {
            // 转为字符串
            val += ''
        } else if(Q.isArray(value)) {
            // 可以直接对input、textarea设置数组
            // 这里处理了下数组中存在的null值问题，同时将数组值转为string
            val = value.map(v => v == null ? '' : v + '')
        }

        preset = _getPreset(node)

        if(!preset || !preset.set || (preset.set(node, val) === undefined)) {
            node.value = val
        }
    }
}

let _getVal = function() {
    let node = this[0]
    let preset
    let ret

    if(node) {
        preset = _getPreset(node)
        
        if(preset && preset.get) {
            ret = preset.get(node, 'value')

            if(ret !== undefined) {
                return ret
            }
        }

        ret = node.value

        if(typeof ret === 'string') {
            return utils.removeReturn(ret)
        }

        return ret == null ? '' : ret
    }

    return
}

// 给input、textarea、select元素取值、赋值
// 该方法不支持chainable
let val = function(value) {
    if(Q.isUndefined(value)) {
        return _getVal.call(this)
    }

    return _setVal.call(this, value)
}

// 扩展到对象实例
Inner.prototype.extend({
    val
})