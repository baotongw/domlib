import Q, {Inner} from '../../core' 
import access from './dom-access'

// 预置部分习惯使用的属性名映射
Q.propFix = {
    'for': 'htmlFor',
    'class': 'className'
};
// 这里预处理可能传入的全小写属性
[
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
].forEach(prop => {
    Q.propFix[prop.toLowerCase()] = this
})

let _getProp = function(key) {
    let i = 0, nodeLen = this.length
    let node

    for(i; i < nodeLen; i++) {
        node = this[i]

        if(!Q.isDomNode(node)) {
            continue
        }

        return node[key]
    }
}

let _setProp = function(key, value) {
    let i, node, nodeLen = this.length
    // 这里预处理可能传入的全小写属性
    key = Q.propFix[key] || key

    for(i = 0; i < nodeLen; i++) {
        node = this[i]
        
        if(!Q.isDomNode(node)) {
            continue
        }
        
        node[key] = value
    }
}

let _prop = function(key, value) {
    if(Q.isUndefined(value)) {
        return _getProp.call(this, key)
    }

    return _setProp.call(this, key, value)
}

// prop负责处理源生属性
// var elem = document.getElementId('id); var name = elem.name; var className = elem.className
// 以上都属于源生属性，都可以这么设置
// 返回第一个匹配元素的属性
// 支持的参数类型：
// 1： key-value
// 2： object: {key1: value1, key2: value2}
let prop = access(_prop);

// 扩展到对象实例
Inner.prototype.extend({
    prop
})