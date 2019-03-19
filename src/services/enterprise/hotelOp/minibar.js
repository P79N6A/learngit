import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8080'
export const url_delMinibarConfig = getAction({ 
  name:'删除迷你吧', 
  url: '/hotel/delMinibarConfig',
  evn:'USE_PRE', 
  preHost
})
export const url_getMinibarFees = getAction({ 
  name:'获取费用代码列表', 
  url: '/hotel/getMinibarFees',
  urlJson:'/src/mock/system/hotel/getMinibarFees.json',
  evn:'USE_PRE', 
  preHost
})
export const url_getMinibarConfigInfo = getAction({ 
  name:'获取迷你吧信息', 
  url: '/hotel/getMinibarConfigInfo',
  evn:'USE_PRE', 
  preHost
})
export const url_getMinibarConfigs = getAction({ 
  name:'获取迷你吧列表', 
  url: '/hotel/page/getMinibarConfigs',
  urlJson:'/src/mock/system/hotel/getMinibarConfigs.json',
  evn:'USE_PRE', 
  preHost
})
export const url_addOrUpdateMinibarConfig = getAction({ 
  name:'添加迷你吧', 
  url: '/hotel/addOrUpdateMinibarConfig',
  evn:'USE_PRE', 
  preHost
})
