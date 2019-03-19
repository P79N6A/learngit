//工具类
import { attempt, find } from 'lodash'
import moment from 'moment'

const _jsonParse = str => attempt(JSON.parse.bind(null, str));


//流水日志详情 解析数据结构
const filterData = (data) => {
    const dataList = {}
    let allList = []
    data.map((v,n) => {
		const objName = v.operateType || v.module || v.filter

        const listObj = dataList[objName]
        v.key = n
        if(listObj) {
            dataList[objName].push(v)
        } else {
            dataList[objName] = []
			dataList[objName].push(v)
        }
    })
    allList = Object.keys(dataList).map(v=>{
        return { title:v, list:dataList[v] }
    })
	return allList
}

//更改全局配置返回arr为obj
const changeArrtoObj = (data) => {
    if(Object.prototype.toString.call(data) !== '[object Array]') {
        return {}
    }
    const obj = {}
    data && data.map((v,n) => {
      obj[v.key || v.name] = v.value
    })
	return obj
}

//获取离店配置模板
const getCheckoutConfigTem = [
    {key:"walkOutOnOff",value:"",explain:"是否展示退房按钮"},
    {key:"cardTips",value:"",explain:"退卡页提示"},
    {key:"billQRCode",value:"",explain:"billQRCode"},
    {key:"creditCheckOut",value:"",explain:"信用住退房"},
    {key:"noCreditCheckOut",value:"",explain:"非信用住退房"}
]
//获取walkin配置模板
const getWalkinConfigTem =  [
    {
        "key": "walkinOnOff",
        "value": "",
        "explain": "walkin入住开关"
    },
    {
        "key": "walkinHomepageShowOnOff",
        "value": "",
        "explain": "首页walkin入住按钮"
    },
    {
        "key": "walkinMaxBookingDays",
        "value": "",
        "explain": "最大预定天数"
    },
    {
        "key": "walkinSourceCode",
        "value": "",
        "explain": "来源码"
    },
    {
        "key": "walkinMarketCode",
        "value": "",
        "explain": "市场码"
    },
    {
        "key": "walkinBookType",
        "value": "",
        "explain": "预定类型"
    },
    {
        "key": "walkinChannelCode",
        "value": "",
        "explain": "渠道码"
    },
    {
        "key": "walkinRoomPriceCode",
        "value": "",
        "explain": "房价码"
    },
    {
        "key": "walkinRoomType",
        "value": "",
        "explain": "房型分类"
    }
]
/**
 * 查看arr对象列表中是否有字段k对应v的对象,有则返回该k值，否则返回空
 */
const checkisSe = (arr,k,kv) => {
    if(arr && arr.length>0) {
        return find(arr,{ [k]:kv })?kv:''
    } else {
        return ''
    }
}

/**
* 将数值格式化成金额形式
* @param num 数值(Number或者String)
* @param precision 精度
* @param separator 分隔符，默认为逗号
* @return 金额格式的字符串,如'1,234,567'，默认返回NaN
* @type String
*/
const formatPrice = (num, precision, separator) => {
        var parts;
        // 判断是否为数字
        if (!isNaN(parseFloat(num)) && isFinite(num)) {
            num = Number(num);
            // 处理小数点位数
            num = (typeof precision !== 'undefined' ? (Math.round(num * Math.pow(10,precision)) / Math.pow(10,precision)).toFixed(precision) : num).toString();
            // 分离数字的小数部分和整数部分
            parts = num.split('.');
            // 整数部分加[separator]分隔, 正则表达式
            parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
     
            return parts.join('.');
        }
        return NaN;
    }

export { _jsonParse, filterData, changeArrtoObj, setFilterParam, getCheckoutConfigTem, getWalkinConfigTem, formatPrice, checkisSe }
