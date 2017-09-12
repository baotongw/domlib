(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * @Author: baotong.wang 
 * @Date: 2017-08-22 21:55:51 
 * @Last Modified by: baotong.wang
 * @Last Modified time: 2017-09-04 21:47:05
 * @Description: 度假前端库核心文件
 * @Dependence: None 
 */

var qRoot = void 0;

var Q = function Q(selector, context, root) {
    var instance = new Inner(selector, context, root);
    return instance;
};

Q.version = '0.0.1';
Q.guid = 1;
Q.hookKey = 'qdj' + (Q.version + math.random()).replace(/\D/g, '');

var Inner = function Inner(selector, ctx, root) {
    if (!selector) {
        return this;
    }

    var context = ctx || document;
    var domNodes = void 0;

    if (typeof selector === 'string' && selector.length) {
        domNodes = context.querySelectorAll(selector);
        this.selector = selector;
        this.length = domNodes.length;
        this.context = context;

        for (var i = 0; i < this.length; i++) {
            this[i] = domNodes[i];
        }
    } else if (selector.nodeType) {
        // 传入的是一个dom节点
        this[0] = selector;
        this.length = 1;
    }
};

qRoot = Q(document);

Inner.prototype = Q.prototype;

window.Q = Q;

exports.default = Q;
exports.Inner = Inner;

},{}],2:[function(require,module,exports){
'use strict';

require('./dom/dom-util');
require('./dom/dom-class');
require('./dom/dom-attr');
require('./dom/dom-prop');
require('./dom/dom-val');

},{"./dom/dom-attr":4,"./dom/dom-class":5,"./dom/dom-prop":6,"./dom/dom-util":7,"./dom/dom-val":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require('../../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 增加一个判断设置对象属性的公共函数，避免函数冗余
function access(exec) {

    return function (key, value) {
        var len = arguments.length;
        var args = void 0;
        var isGet = false;
        var isKeyPairs = false;

        if (len === 0) {
            return this;
        }

        if (len === 1) {
            // 支持通过object批量修改多个属性
            if (_core2.default.isObject(key)) {
                // 空对象忽略
                if (_core2.default.isEmptyObject(key)) {
                    return this;
                }

                args = key;
                isGet = false;
                isKeyPairs = true;
            } else if (!_core2.default.isValidString(key)) {
                return this;
            } else {
                isGet = true;
            }
        }

        // 如果是两个字符串那必须都得是string
        if (len === 2 && (!_core2.default.isBaseType(key) || !_core2.default.isBaseType(value))) {
            return this;
        }

        var nodeLen = this.length;
        var i = void 0,
            node = void 0;

        if (isGet) {
            return exec.call(this, key);
        } else {
            if (isKeyPairs) {
                for (var attr in args) {
                    exec.call(this, attr, args[attr]);
                }
            } else {
                exec.call(this, key, value);
            }
        }

        return this;
    };
}

exports.default = access;

},{"../../core":1}],4:[function(require,module,exports){
'use strict';

var _core = require('../../core');

var _core2 = _interopRequireDefault(_core);

var _domAccess = require('./dom-access');

var _domAccess2 = _interopRequireDefault(_domAccess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _getAttr = function _getAttr(key) {
    var i = 0,
        nodeLen = this.length;
    var node = void 0;

    for (i; i < nodeLen; i++) {
        node = this[i];

        if (!_core2.default.isDomNode(node)) {
            continue;
        }

        return node.getAttribute(key);
    }
};

var _setAttr = function _setAttr(key, value) {
    var i = void 0,
        node = void 0,
        nodeLen = this.length;

    for (i = 0; i < nodeLen; i++) {
        node = this[i];

        if (!_core2.default.isDomNode(node)) {
            continue;
        }

        node.setAttribute(key, value + '');
    }

    return this;
};

var _attr = function _attr(key, value) {
    if (_core2.default.isUndefined(value)) {
        return _getAttr.call(this, key);
    }

    return _setAttr.call(this, key, value);
};

// 支持的参数类型：
// 1： key-value
// 2： object: {key1: value1, key2: value2}
var attr = (0, _domAccess2.default)(_attr);

// 删除一个或多个属性，多个属性空格隔开
var removeAttr = function removeAttr(key) {
    var _this = this;

    if (_core2.default.isValidString(key)) {
        (function () {
            var attrs = key.split(' ');
            var len = _this.length;
            var node = void 0;

            for (var i = 0; i < len; i++) {
                node = _this[i];

                if (!_core2.default.isDomNode(node)) {
                    continue;
                }

                attrs.forEach(function (attr) {
                    node.removeAttribute(attr);
                });
            }
        })();
    }

    return this;
};

// 扩展到对象实例
_core.Inner.prototype.extend({
    attr: attr,
    removeAttr: removeAttr
});

},{"../../core":1,"./dom-access":3}],5:[function(require,module,exports){
'use strict';

var _core = require('../../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _wrapper(exec) {
    return function (className) {
        // 这里的this指向Q对象
        if (!className) {
            return this;
        }

        var nodeLen = this.length;

        for (var i = 0; i < nodeLen; i++) {
            var node = this[i];
            var existClass = node.className;
            var classArr = exec(existClass, className);

            classArr !== null && (node.className = classArr.join(' '));
        }

        return this;
    };
}

// className: 待添加的class，可以是多个，以空格区分
var _addClass = function _addClass(existClass, className) {
    var classArr = [];
    var isValid = false;

    if (!existClass) {
        isValid = true;
        classArr.push(className);
    } else {
        classArr = existClass.split(' ');

        className.split(' ').forEach(function (cls) {
            if (classArr.indexOf(cls) === -1) {
                isValid = true;
                classArr.push(cls);
            }
        });
    }

    return isValid ? classArr : null;
};

var _removeClass = function _removeClass(existClass, className) {
    var classArr = [];
    var isValid = false;

    if (existClass) {
        classArr = existClass.split(' ');

        className.split(' ').forEach(function (cls, i) {
            if (classArr.indexOf(cls) > -1) {
                isValid = true;
                classArr.splice(i, 1);
            }
        });
    }

    return isValid ? classArr : null;
};

var _toggleClass = function _toggleClass(existClass, className) {
    var classArr = existClass ? existClass.split(' ') : [];

    className.split(' ').forEach(function (cls, i) {
        classArr.indexOf(cls) === -1 ? classArr.push(cls) : classArr.splice(i, 1);
    });

    return classArr;
};

var _toggle = _wrapper(_toggleClass);

var addClass = _wrapper(_addClass);
var removeClass = _wrapper(_removeClass);
var toggleClass = function toggleClass(className, flag) {
    if (_core2.default.isBoolean(flag)) {
        return flag ? addClass(className) : removeClass(className);
    }

    _toggle.call(this, className);
};

var hasClass = function hasClass(className) {
    // 这里的this指向Q对象
    if (!className || this.length === 0) {
        return false;
    }

    var baseClassName = this[0].baseClassName;
    return baseClassName.indexOf(className) > -1;
};

// 扩展到对象实例
_core.Inner.prototype.extend({
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass
});

},{"../../core":1}],6:[function(require,module,exports){
'use strict';

var _core = require('../../core');

var _core2 = _interopRequireDefault(_core);

var _domAccess = require('./dom-access');

var _domAccess2 = _interopRequireDefault(_domAccess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 预置部分习惯使用的属性名映射
_core2.default.propFix = {
    'for': 'htmlFor',
    'class': 'className'
};
// 这里预处理可能传入的全小写属性
["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"].forEach(function (prop) {
    _core2.default.propFix[prop.toLowerCase()] = undefined;
});

var _getProp = function _getProp(key) {
    var i = 0,
        nodeLen = this.length;
    var node = void 0;

    for (i; i < nodeLen; i++) {
        node = this[i];

        if (!_core2.default.isDomNode(node)) {
            continue;
        }

        return node[key];
    }
};

var _setProp = function _setProp(key, value) {
    var i = void 0,
        node = void 0,
        nodeLen = this.length;
    // 这里预处理可能传入的全小写属性
    key = _core2.default.propFix[key] || key;

    for (i = 0; i < nodeLen; i++) {
        node = this[i];

        if (!_core2.default.isDomNode(node)) {
            continue;
        }

        node[key] = value;
    }
};

var _prop = function _prop(key, value) {
    if (_core2.default.isUndefined(value)) {
        return _getProp.call(this, key);
    }

    return _setProp.call(this, key, value);
};

// prop负责处理源生属性
// var elem = document.getElementId('id); var name = elem.name; var className = elem.className
// 以上都属于源生属性，都可以这么设置
// 返回第一个匹配元素的属性
// 支持的参数类型：
// 1： key-value
// 2： object: {key1: value1, key2: value2}
var prop = (0, _domAccess2.default)(_prop);

// 扩展到对象实例
_core.Inner.prototype.extend({
    prop: prop
});

},{"../../core":1,"./dom-access":3}],7:[function(require,module,exports){
'use strict';

var _core = require('../../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var domUtil = {
    isDomNode: function isDomNode(node) {
        var type = node && node.nodeType;

        if (_core2.default.isNumeric(type) === false || type === 2 || type === 3 || type === 8) {
            return false;
        }

        return true;
    },
    isElementNode: function isElementNode(node) {
        var type = node && node.nodeType;

        return type === 1;
    },
    nodeName: function nodeName(node) {
        return node.nodeName.toLowerCase();
    }
};

_core2.default.extend(domUtil);

},{"../../core":1}],8:[function(require,module,exports){
'use strict';

var _core = require('../../core');

var _core2 = _interopRequireDefault(_core);

var _domAccess = require('./dom-access');

var _domAccess2 = _interopRequireDefault(_domAccess);

var _support = require('../../tools/support');

var _support2 = _interopRequireDefault(_support);

var _utils = require('../../tools/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.valPresets = {
    option: {
        get: function get(node) {
            var val = (0, _core2.default)(node).attr('value');

            return val != null ? val : _utils2.default.stripAndCollapse(val);
        }
    },
    select: {
        get: function get(node) {
            // select-one / select-multiple
            var options = node.options;
            var selected = node.selectedIndex;
            var isSingleSelect = node.type === 'select-one';
            var ret = isSingleSelect ? null : [];
            var max = isSingleSelect ? selected + 1 : options.length;
            var i = void 0,
                option = void 0,
                value = void 0,
                isDisabled = void 0,
                parent = void 0;

            // 根据所选项缩小循环次数
            // 如果是多选则从第一个选中的index开始直到结尾
            if (selected < 0) {
                i = max;
            } else {
                i = isSingleSelect ? selected : 0;
            }

            for (; i < max; i++) {
                option = options[i];

                // 找到match
                if (options.selected || i === selected) {
                    parent = option.parentNode;
                    isDisabled = option.disabled || _core2.default.nodeName(parent) === 'optgroup' && parent.disabled;

                    // 如果option是disabled或者他的父元素是optgroup且disabled的，不返回
                    if (isDisabled === false) {
                        value = (0, _core2.default)(option).val();

                        if (isSingleSelect) {
                            return vlaue;
                        }

                        ret.push(value);
                    }
                }
            }

            return ret;
        },
        set: function set(node, value) {
            // select可以单选、多选
            // value可以是字符串，也可以是数组
            // 原理：挨个设置option.selected，如果没有匹配值，设置select.selectedIndex = -1

            var hasMatch = false;
            var options = node.options;
            var values = _core2.default.makeArray(value);
            var len = options.length;
            var i = 0,
                option = void 0;

            for (; i < len; i++) {
                option = options[i];

                if (option.selected = values.indexOf(_core2.default.valPresets.option.get(option)) > -1) {
                    hasMatch = true;
                }
            }

            if (hasMatch === false) {
                node.selectedIndex = -1;
            }

            return values;
        }
    }
};

['radio', 'checkbox'].forEach(function (tag) {
    _core2.default.valPresets[undefined] = {
        set: function set(node, value) {
            if (_core2.default.isArray(value)) {
                return node.checked = value.indexOf((0, _core2.default)(node).val()) > -1;
            }
        }

        // 不支持标准check的时候
    };if (!_support2.default.checkOn) {
        _core2.default.valPresets[undefined].get = function (node) {
            return node.getAttribute('value') === null ? 'on' : node.value;
        };
    }
});

var _getPreset = function _getPreset(node) {
    return _core2.default.valPresets[node.type] || _core2.default.valPresets[node.nodeName.toLowerCase()];
};

// 支持传入原始类型（string，number, boolean)
// 或者function(index, oldValue)
var _setVal = function _setVal(value) {
    var i = 0;
    var len = this.length;
    var isFunction = _core2.default.isFunction(value);
    var node = void 0,
        preset = void 0,
        val = void 0;

    if (!isFunction && !_core2.default.isBaseType(value)) {
        return;
    }

    for (i; i < len; i++) {
        node = this[i];

        // 能被赋值的dom只能是elementNode
        if (node.nodeType !== 1) {
            continue;
        }

        val = isFunction ? value.call(node, i, (0, _core2.default)(node).val()) : value;

        if (val == null) {
            val = '';
        } else if (_core2.default.isNumeric(value)) {
            // 转为字符串
            val += '';
        } else if (_core2.default.isArray(value)) {
            // 可以直接对input、textarea设置数组
            // 这里处理了下数组中存在的null值问题，同时将数组值转为string
            val = value.map(function (v) {
                return v == null ? '' : v + '';
            });
        }

        preset = _getPreset(node);

        if (!preset || !preset.set || preset.set(node, val) === undefined) {
            node.value = val;
        }
    }
};

var _getVal = function _getVal() {
    var node = this[0];
    var preset = void 0;
    var ret = void 0;

    if (node) {
        preset = _getPreset(node);

        if (preset && preset.get) {
            ret = preset.get(node, 'value');

            if (ret !== undefined) {
                return ret;
            }
        }

        ret = node.value;

        if (typeof ret === 'string') {
            return _utils2.default.removeReturn(ret);
        }

        return ret == null ? '' : ret;
    }

    return;
};

// 给input、textarea、select元素取值、赋值
// 该方法不支持chainable
var val = function val(value) {
    if (_core2.default.isUndefined(value)) {
        return _getVal.call(this);
    }

    return _setVal.call(this, value);
};

// 扩展到对象实例
_core.Inner.prototype.extend({
    val: val
});

},{"../../core":1,"../../tools/support":14,"../../tools/utils":15,"./dom-access":3}],9:[function(require,module,exports){
'use strict';

require('./core');
require('./tools/index');
require('./modules/dom-index');

},{"./core":1,"./modules/dom-index":2,"./tools/index":12}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

var _meta = require('./meta');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.class2type = {};

// Populate the class2type map
['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol', 'WeakMap'].forEach(function (cls) {
    _core2.default.class2type['[object ' + cls + ']'] = cls.toLowerCase();
});

var base = {
    isWindow: function isWindow(obj) {
        return obj != null && obj === obj.window;
    },
    isNumeric: function isNumeric(obj) {
        var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);

        return type === 'number' || type === 'string' && !isNaN(obj - obj);
    },
    isString: function isString(obj) {
        return typeof obj === 'string';
    },
    isValidString: function isValidString(obj) {
        return typeof obj === 'string' && obj.length;
    },
    isBoolean: function isBoolean(obj) {
        return typeof obj === 'boolean';
    },
    isBaseType: function isBaseType(obj) {
        return _core2.default.isNumeric(obj) || _core2.default.isString(obj) || _core2.default.isBoolean(obj);
    },
    isArray: function isArray(arr) {
        if (Array.isArray) {
            return Array.isArray(arr);
        }

        return arr && _meta.toString.call(arr) === '[object Array]';
    },
    isFunction: function isFunction(func) {
        return typeof func === 'function';
    },
    isObject: function isObject(obj) {
        return obj && _meta.toString.call(obj) === '[object Object]';
    },
    isUndefined: function isUndefined(obj) {
        return typeof obj === 'undefined';
    },
    // 检查是否是空对象
    isEmptyObject: function isEmptyObject(obj) {
        var ret = true;

        if (!_core2.default.isObject(obj)) {
            return false;
        }

        for (var key in obj) {
            if (_meta.hasOwn.call(obj, key)) {
                ret = false;
                break;
            }
        }

        return ret;
    },
    // 检查是否是纯对象
    isPlainObject: function isPlainObject(obj) {
        var ret = false;
        var constructor = void 0;

        try {
            var proto = (0, _meta.getProto)(obj);
            // Object with no prototype. Object.create(null) are plain.
            if (!proto) {
                return true;
            }

            constructor = _meta.hasOwn.call(proto, 'constructor') && proto.constructor;
            return typeof constructor === 'function' && constructor === Object.prototype.constructor;
        } catch (err) {}

        return ret;
    },
    // 判断是否是一个类数组对象
    // 规则：有length属性，要么是0，如果不是0 length属性应该是数字
    // 且len - 1肯定应该存在
    // 不是function或者window对象
    // 不能直接判断isArray，说了是类array，肯定不能只是array
    // Q对象是类数组对象
    isArrayLike: function isArrayLike(obj) {
        if (obj instanceof _core2.default) {
            return true;
        }

        var len = !!obj && _meta.hasOwn.call(obj, 'length') && obj.length;
        var type = _core2.default.type(obj);

        if (_core2.default.isFunction(obj) || _core2.default.isWindow(obj)) {
            return false;
        }

        return type === 'array' || len === 0 || typeof len === 'number' && len > 0 && obj[len - 1];
    },
    // 获取一个对象的类型名称(小写），比如regexp
    type: function type(obj) {
        if (obj == null) {
            return obj + '';
        }

        var t = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        var ret = t === 'object' || t === 'function' ? _core2.default.class2type[_meta.toString.call(obj)] || 'object' : t;

        return ret;
    }
};

var helper = {
    // merge两个数组或者类数组
    merge: function merge(base, extend) {
        var len = extend.length || 0;
        var bi = base.length || 0;
        var ei = 0;

        for (; ei < len; ei++) {
            base[bi++] = extend[ei];
        }

        base.length = bi;
        return base;
    },
    makeArray: function makeArray(arr, results) {
        var rets = results || [];

        if (arr != null) {
            // 使用object包装一下，否则类似一个字符串不能使用（ 'length' in obj ) 来判断
            if (_core2.default.isArrayLike(arr)) {
                _core2.default.merge(rets, typeof arr === 'string' ? [arr] : arr);
            } else {
                rets.push(arr);
            }
        }

        return rets;
    },
    each: function each(obj, func) {
        var item = void 0,
            ret = void 0;

        if (!_core2.default.isFunction(func)) {
            return;
        }

        if (_core2.default.isObject(obj)) {
            for (var key in obj) {
                if (ret !== false) {
                    if ((0, _meta.hasOwn)(obj, key)) {
                        item = obj[key];
                        ret = func.call(item, key, obj);
                    }
                }
            }
        } else if (_core2.default.isArrayLike(func)) {
            for (var i = 0; i < obj.length; i++) {
                item = obj[i];

                ret = func.call(item, i, obj);

                if (ret === false) {
                    break;
                }
            }
        }
    }
};

_core2.default.extend(base);
_core2.default.extend(helper);

exports.default = base;

},{"../core":1,"./meta":13}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                               * @Author: baotong.wang 
                                                                                                                                                                                                                                                                               * @Date: 2017-08-21 15:26:49 
                                                                                                                                                                                                                                                                               * @Last Modified by: baotong.wang
                                                                                                                                                                                                                                                                               * @Last Modified time: 2017-08-23 15:01:56
                                                                                                                                                                                                                                                                               * @Description: 实现对象的深浅拷贝
                                                                                                                                                                                                                                                                               * @Dependence: qdj.js 
                                                                                                                                                                                                                                                                               */

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// isDeep: 是否深拷贝
var extend = function extend(isDeep) {
    var args,
        base = arguments[0],
        index = 1,
        length = arguments.length;

    if (typeof isDeep === 'boolean') {
        index++;
        base = arguments[1];
    }

    // 处理base不等于对象的场景，处理异常
    if (toString.call(base) !== '[object Object]' && typeof base !== 'function') {
        base = {};
    }

    // 如果传入的参数比预期的少一个，那么表示扩展当前对象
    if (index === length) {
        base = this;
        index--;
    }

    for (; index < length; index++) {
        _extend(base, arguments[index]);
    }

    return base;
};

var _extend = function _extend(base, obj, isDeep) {
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

            basePropertyType = typeof baseProperty === 'undefined' ? 'undefined' : _typeof(baseProperty);

            switch (typeof property === 'undefined' ? 'undefined' : _typeof(property)) {
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
};

_core2.default.extend = _core.Inner.prototype.extend = extend;

},{"../core":1}],12:[function(require,module,exports){
'use strict';

// extend需要先调用
require('./extend');
require('./base');

},{"./base":10,"./extend":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var obj = {};
var arr = [];
var string = 'baotong.wang';
var toString = Object.prototype.toString;
var hasOwn = obj.hasOwnProperty;
var getProto = Object.getPrototypeOf;
var objProto = getProto(obj);
var objectFunctionString = objProto.constructor.toString();

exports.toString = toString;
exports.hasOwn = hasOwn;
exports.getProto = getProto;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var support = {};

support.createHTMLDocument = function () {
    var body = document.implementation.createHTMLDocument('').body;

    body.innerHTML = '<form></form><form></form>';
    return body.childNodes.length === 2;
}(function () {
    var input = document.createElement("input"),
        select = document.createElement("select"),
        opt = select.appendChild(document.createElement("option"));

    input.type = "checkbox";

    // Support: Android <=4.3 only
    // Default value for a checkbox should be "on"
    support.checkOn = input.value !== "";

    // Support: IE <=11 only
    // Must access selectedIndex to make default options select
    support.optSelected = opt.selected;

    // Support: IE <=11 only
    // An input loses its value after becoming a radio
    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";

    support.weakMap = Q.class2type[Q.type(window.WeakMap)] === 'weakmap';
});

exports.default = support;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var patterns = {
    // 匹配非accii 空格，其他空格应该被记入value
    // https://infra.spec.whatwg.org/#ascii-whitespace
    // \x20表示空格；\t tab制表符； \r 回车CR \n 换行LF； \f 换页 FF
    rnotHtmlWhite: /[^\x20\t\r\n\f]+/g,
    rreturn: /\r/g
};

var utils = {
    stripAndCollapse: function stripAndCollapse(value) {
        var match = value.match(patterns.rnotHtmlWhite) || [];
        return match.join(' ');
    },
    removeReturn: function removeReturn(value) {
        return value.replace(patterns.rreturn, '');
    }
};

exports.default = utils;

},{}]},{},[9]);
