import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.98.76:8081'
export const url_partnerErrorInfos = getAction({ 
  name:'获取标准错误码列表', 
  url: '/errorinfo/page/partnerErrorInfos',
  urlJson:'/src/mock/errorM/getMapList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerErrorAdd = getAction({ 
  name:'添加商家错误码', 
  url: '/errorinfo/partner/add',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerErrorUpdate = getAction({ 
  name:'修改商家错误码', 
  url: '/errorinfo/partner/update',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerErrorDelete = getAction({ 
  name:'删除映射错误码', 
  url: '/errorinfo/partner/delete',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerErrorInfo = getAction({ 
  name:'获取映射错误码信息', 
  url: '/errorinfo/partner/info',
  urlJson:'/src/mock/errorM/getMapInfo.json',
  evn:'USE_PRE', 
  preHost
})
