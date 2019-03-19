import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_getZeroCheckInTime = getAction({ 
  name:'获取凌晨入住配置', 
  url: '/system/getZeroCheckInTime',
  urlJson:'/src/mock/system/globalConfig/global.json', 
  evn:'USE_PRE', 
  preHost
})
export const url_setZeroCheckInTime = getAction({ 
  name:'设置凌晨入住配置', 
  url: '/system/setZeroCheckInTime',
  evn:'USE_PRE', 
  preHost
})
export const url_getMakeCardTimeout = getAction({ 
  name:'获取制卡时效配置', 
  url: '/system/getMakeCardTimeout',
  urlJson:'/src/mock/system/globalConfig/getMakeCardTimeout.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_setMakeCardTimeout = getAction({ 
  name:'设置制卡时效配置', 
  url: '/system/setMakeCardTimeout',
  evn:'USE_PRE', 
  preHost
})
export const url_getHandleTimeLimit = getAction({ 
  name:'获取办理时限配置', 
  url: '/system/getHandleTimeLimit',
  urlJson:'/src/mock/system/globalConfig/getHandleTimeLimit.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_setHandleTimeLimi = getAction({ 
  name:'设置办理时限配置', 
  url: '/system/setHandleTimeLimit',
  evn:'USE_PRE', 
  preHost
})
