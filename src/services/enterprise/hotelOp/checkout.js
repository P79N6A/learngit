import { getAction, getMock, resConfig } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8080'
export const url_updateCheckOut = getAction({ 
  name:'更新离店配置', 
  url: '/hotel/function/checkOut/update',
  evn:'USE_PRE', 
  preHost
})
export const url_getCheckOut = getAction({ 
  name:'获取离店配置', 
  url: '/hotel/function/checkOut/get',
  urlJson:'/src/mock/system/hotel/getCheckout.json',
  evn:'USE_PRE', 
  preHost
})
export const uploadQrcode = {
  name:'上传发票二维码',
  action: getMock({
    urlPub:'/upload/img.do',
    urlPre:`${preHost}/upload/img.do`,
  },resConfig.isMock?'USE_PRE':'USE_PUB'),
}
