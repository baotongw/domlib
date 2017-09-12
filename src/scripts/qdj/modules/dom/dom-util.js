'use strict';

import Q, {Inner} from '../../core' 

let domUtil = {
    isDomNode: function(node) {
        let type = node && node.nodeType
    
        if(Q.isNumeric(type) === false || type === 2 || type === 3 || type === 8) {
            return false
        }
    
        return true
    },
    isElementNode: function(node) {
        let type = node && node.nodeType

        return type === 1
    },
    nodeName: function(node) {
        return node.nodeName.toLowerCase()
    }
}

Q.extend(domUtil)