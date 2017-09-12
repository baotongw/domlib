import Q, {Inner} from '../../core' 

// 增加一个判断设置对象属性的公共函数，避免函数冗余
function access(exec) {
    
    return function(key, value) {
        let len = arguments.length
        let args
        let isGet = false
        let isKeyPairs = false
    
        if(len === 0) {
            return this
        }
    
        if(len === 1) {
            // 支持通过object批量修改多个属性
            if(Q.isObject(key)) {
                // 空对象忽略
                if(Q.isEmptyObject(key)) {
                    return this
                }
    
                args = key
                isGet = false
                isKeyPairs = true
            } else if(!Q.isValidString(key)) {
                return this
            } else {
                isGet = true
            }
        }
    
        // 如果是两个字符串那必须都得是string
        if(len === 2 && (!Q.isBaseType(key) || !Q.isBaseType(value))) {
            return this
        }
    
        let nodeLen = this.length
        let i, node
        
        if(isGet) {
            return exec.call(this, key)
        } else {
            if(isKeyPairs) {
                for(let attr in args) {
                    exec.call(this, attr, args[attr])
                }
            } else {
                exec.call(this, key, value)
            }
        }

        return this
    }
}

export default access