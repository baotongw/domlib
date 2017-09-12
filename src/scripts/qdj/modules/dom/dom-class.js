import Q, {Inner} from '../../core'

function _wrapper(exec) {
    return function(className) {
        // 这里的this指向Q对象
        if(!className) {
            return this
        }
    
        let nodeLen = this.length
    
        for(let i = 0; i < nodeLen; i++) {
            let node = this[i]
            let existClass = node.className
            let classArr = exec(existClass, className)
    
            classArr !== null && (node.className = classArr.join(' '))
        }
    
        return this
    }
}

// className: 待添加的class，可以是多个，以空格区分
let _addClass = function(existClass, className) {
    let classArr = []
    let isValid = false

    if(!existClass) {
        isValid = true
        classArr.push(className)
    } else {
        classArr = existClass.split(' ')

        className.split(' ').forEach(cls => {
            if(classArr.indexOf(cls) === -1) {
                isValid = true
                classArr.push(cls)
            }
        })
    }

    return isValid ? classArr : null
}

let _removeClass = function(existClass, className) {
    let classArr = []
    let isValid = false

    if(existClass) {
        classArr = existClass.split(' ')

        className.split(' ').forEach((cls, i) => {
            if(classArr.indexOf(cls) > -1) {
                isValid = true
                classArr.splice(i, 1)
            }
        })
    }

    return isValid ? classArr : null
}

let _toggleClass = function(existClass, className) {
    let classArr = existClass ? existClass.split(' ') : []

    className.split(' ').forEach((cls, i) => {
        classArr.indexOf(cls) === -1 ? classArr.push(cls) : classArr.splice(i, 1)
    })

    return classArr
}

let _toggle = _wrapper(_toggleClass)

let addClass = _wrapper(_addClass)
let removeClass = _wrapper(_removeClass)
let toggleClass = function(className, flag) {
    if(Q.isBoolean(flag)) {
        return flag ? addClass(className) : removeClass(className)
    }

    _toggle.call(this, className)
}

let hasClass = function(className) {
    // 这里的this指向Q对象
    if(!className || this.length === 0) {
        return false
    }

    let baseClassName = this[0].baseClassName
    return baseClassName.indexOf(className) > -1
}

// 扩展到对象实例
Inner.prototype.extend({
    addClass,
    removeClass,
    toggleClass
})