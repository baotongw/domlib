const patterns = {
    // 匹配非accii 空格，其他空格应该被记入value
    // https://infra.spec.whatwg.org/#ascii-whitespace
	// \x20表示空格；\t tab制表符； \r 回车CR \n 换行LF； \f 换页 FF
    rnotHtmlWhite: /[^\x20\t\r\n\f]+/g,
    rreturn: /\r/g
}

const utils = {
    stripAndCollapse: function(value) {
        let match = value.match(patterns.rnotHtmlWhite) || []
        return match.join(' ')
    },
    removeReturn: function(value) {
        return value.replace(patterns.rreturn, '')
    }
}

export default utils