//设备状态
export const ENUM_DEVICE_STATUS = {
    '0':'未激活',
    '1':'已激活',
    '2':'锁定设备',
}

//预授权订单状态
export const ENUM_PRE_PAY_STATUS = {
    '-1':'已撤销',
    '0':'待冻结',
    '1':'未入住待结账',
    '10':'已入住待结账',
    '2': '结账中',
    '3':'取消结账',
    '4':'结账成功',
    '5':'结账失败',
    // '6':'关单',
}

//操作日志状态
export const ENUM_OPERATE_LOGS_STATUS = {
    '3': '操作日志',
    '4': '设备日志',
    '5': '酒店日志'
}

//工单状态
export const ENUM_ORDER_STATUS = {
    1:'已创建',
    2:'已取消',
    3:'已派单',
    4:'实施完成',
    5:'验收通过',
    6:'验收不通过' ,
    7:'已培训' ,
    8:'已撤单' ,
}

//监控
export const ENUM_MONITOR_STATUS = {
    "freeMem1min": "1min空闲内存",
    "maxAppMem1min": "最大内存",
    "pidMemory1min": "1min使用内存",
    "cpu1min": "1min CPU使用率",
    "totalMem1min": "总内存"
}

//错误描述枚举
export const ENUM_ERROR_FAIL = {
    1:"开始办理",
    2:"读取身份证",
    3:"扫脸核身",
    4:"PSB上传检查&&预约入住/制卡查询",
    5:"查询订单",
    6:"确认信息",
    7:"添加同住人",
    8:"缴纳押金",
    9:"在线选房",
    10:"预约入住/制卡",
    11:"办理入住",
    12:"取卡",
    13:"网络异常"
}

//错误描述枚举
export const ENUM_ERROR_ABANDON = {
    1:"PMS无订单",
    2:"预约入住未取卡",
    3:"已有在住信息",
    4:"主动退出",
    5:"超时退出",
}

export const ENUM_LIST = (enumObj,showAll = false, description = '全部') => {
    const enumList = Object.keys(enumObj).map(v=>{
        return {
            code:v,
            description:enumObj[v]
        }
    })

    if(showAll) {
        return [ ...enumList, { code:'', description } ]
    }

    return enumList
}

export const ENUM_OBJ = (enumArr, key='code', value='description') => {
    const enumObj = {}
    enumArr.map(v => {
        enumObj[v[key]] = v[value]
    })
    return enumObj
}