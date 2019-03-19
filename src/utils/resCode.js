const ERROR_FORM = '表单信息填写有误'
const RESMSG = {
    SUCCESS(name) {
     return `${name}成功`
    },
    FAIL(name,msg='') {
     return `${name}失败 ${msg}`
    },
    ERROR(name,e) {
     return `${name}异常:${e}`
    }
 }

 const ERROR_MSG = (res,fnName) => {
    return ( 
        (res.err &&  RESMSG.FAIL(fnName, res.err.msg || res.err)) || 
        (res.msg && RESMSG.FAIL(fnName,res.msg)) || 
        (res.errorMessage && RESMSG.FAIL(fnName,res.errorMessage)) || 
        RESMSG.FAIL(fnName)
    )
 }

 export { ERROR_FORM, RESMSG, ERROR_MSG }