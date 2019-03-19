import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.98.76:8081'
export const url_partTypeList = getAction({ 
  name:'获取配置类型', 
  url: '/partner/listType',
  urlJson:'/src/mock/errorM/getPartsList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_standardAll = getAction({ 
  name:'获取标准错误码列表', 
  url: '/errorinfo/standardErrorInfos',
  urlJson:'/src/mock/errorM/getStandErrorList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerList = getAction({ 
  name:'获取合作伙伴列表', 
  url: '/errorinfo/partnerErrorInfo/getPartners',
  urlJson:'/src/mock/errorM/getPartnerList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_getMatchRules = getAction({ 
  name:'获取商家规则列表', 
  url: '/errorinfo/getMatchRules',
  urlJson:'/src/mock/errorM/getRules.json',
  evn:'USE_PRE', 
  preHost
})
