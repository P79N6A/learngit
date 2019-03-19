const isNumber = length => (rule, value, callback) => {
    const re = /^[0-9]+$/ ;
    if(!re.test(value)) {
        callback('必须为正整数')
    } else if(length && value.length > length) {
        callback(`须小于${length}个字`)
    } else {
        callback()
    }
}
const isMoney = (min, max) => (rule, value, callback) => {
    var money = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    value = parseFloat(value)
    min= parseFloat(min)
    max= parseFloat(max)
    if(!money.test(value)) {
        callback('须为数字且小数点后最多2位')
    } else if((min || min == 0) && value<min) {
        callback(`须大等于${min}`)
    } else if(max && value>max) {
        callback(`须小等于${max}`)
    } else {
        callback()
    }
}
const isPhone = notRequire => (rule, value, callback) => {
    const mobile = /^1\d{10}$/
    const phone = /^0\d{2,3}-?\d{7,8}$/
    if(notRequire && !value) {
        callback()
    } else if(!mobile.test(value) && !phone.test(value)){
        callback('请输入正确格式 （例如“13012345678”或者“0571-12345678”）')
    } else {
        callback()
    }
}
const isPhone11 = notRequire => (rule, value, callback) => {
    const mobile = /^1\d{10}$/
    if(notRequire && !value) {
        callback()
    } else if(!mobile.test(value)){
        callback('请输入正确格式 （例如“130xxxx5678”')
    } else {
        callback()
    }
}
const isHour = (rule, value, callback) => {
    if(isNaN(value) || value > 24 || value < 0) {
        callback('必须为24小时制')
    } else {
        callback()
    }
}
const max = num => (rule, value, callback) => {
    if(value && value.length > num) {
        callback(`须小于${num}个字`)
    } else {
        callback()
    }
}
export { isNumber, isPhone, isHour, max, isMoney, isPhone11 }