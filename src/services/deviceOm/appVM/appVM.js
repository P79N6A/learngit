import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.101.238:8080'
export const url_getAppType = getAction({ 
  name:'获取设备类型', 
  url: '/common/getAppType',
  urlJson:'/src/mock/deviceOm/appVM/getAppList.json',
  evn:'USE_JSON', 
  
  preHost
})
export const url_getAllApp = getAction({ 
  name:'获取app版本管理列表', 
  url: '/appversionInfo/getAll',
  urlJson:'/src/mock/deviceOm/appVM/getAllList.json',
  evn:'USE_JSON', 
  
  preHost
})
export const url_getAppVersionInfo = getAction({ 
  name:'获取app版本信息', 
  url: '/appversionInfo/get',
  urlJson:'/src/mock/deviceOm/appVM/getInfo.json',
  evn:'USE_JSON', 
  
  preHost
})
export const url_add = getAction({ 
  name:'增加app版本信息', 
  url: '/appversionInfo/add',
  evn:'USE_JSON', 
  preHost
})
export const url_update = getAction({ 
  name:'更新app版本信息', 
  url: '/appversionInfo/update',
  evn:'USE_JSON', 
  preHost
})
export const url_abandon = getAction({ 
  name:'废弃app版本', 
  url: '/appversionInfo/abandon',
  evn:'USE_JSON', 
  preHost
})
export const url_getOssTempUrl = getAction({ 
  name:'获取oss地址', 
  url: '/appversionInfo/getOssTempUrl',
  urlJson:'/src/mock/deviceOm/appVM/getOss.json',
  evn:'USE_JSON', 
  preHost
})
