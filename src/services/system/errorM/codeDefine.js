import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.98.76:8081'
export const url_standardErrorInfos = getAction({
  name:'获取标准错误码列表',
  url: '/errorinfo/page/standardErrorInfos',
  urlJson:'/src/mock/errorM/getDefineList.json',
  evn:'USE_PRE',
  preHost
})
export const url_addStandard = getAction({
  name:'新增标准错误码',
  url: '/errorinfo/standard/add',
  evn:'USE_PRE',
  preHost
})
export const url_updateStandard = getAction({
  name:'编辑标准错误码',
  url: '/errorinfo/standard/update',
  evn:'USE_PRE',
  preHost
})
export const url_getStandardInfo = getAction({
  name:'获取标准错误码信息',
  url: '/errorinfo/standard/info',
  urlJson:'/src/mock/errorM/getDefineInfo.json',
  evn:'USE_PRE',
  preHost
})
