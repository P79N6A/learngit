import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.99.148:8080'
export const url_getStandardList = getAction({ 
  name:'获取标准特征列表', 
  url: '/roomTypeFeature/getStandard/list',
  urlJson:'/src/mock/system/globalConfig/getStandardList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_getStandard = getAction({ 
  name:'获取标准特征信息', 
  url: '/roomTypeFeature/getStandard',
  urlJson:'/src/mock/system/globalConfig/getStandardInfo.json',
  evn:'USE_PRE', 
  preHost
})
export const url_addStandard = getAction({ 
  name:'添加标准特征', 
  url: '/roomTypeFeature/addStandard',
  evn:'USE_PRE', 
  preHost
})
export const url_editStandard = getAction({ 
  name:'更新标准特征', 
  url: '/roomTypeFeature/editStandard',
  evn:'USE_PRE', 
  preHost
})
export const url_getStandardAll = getAction({ 
  name:'全部标准特征', 
  url: '/roomTypeFeature/getStandard/all',
  urlJson:'/src/mock/system/globalConfig/getStandardInfo.json',
  evn:'USE_PRE', 
  preHost
})
