import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.3:8080'
export const url_getBehaviorList = getAction({ 
  name:'获取用户行为列表', 
  url: '/report/page/getUserActions',
  urlJson:'/src/mock/dataReport/getBehaviorList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_exportBehaviorList = getAction({ 
  name:'导出用户行为数据列表', 
  url: '/report/export/userActions',
  urlJson:'/src/mock/dataReport/exportDaily.json',
  evn:'USE_JSON', 
  preHost
})
export const url_getTriceIdList = getAction({ 
  name:'获取triceId列表', 
  url: '/report/trace/userActions',
  urlJson:'/src/mock/dataReport/getTriceIdList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_getTriceIdDetail = getAction({ 
  name:'获取triceId详情', 
  url: '/report/page/userActionsDetails',
  urlJson:'/src/mock/dataReport/getTriceIdDetail.json',
  evn:'USE_JSON', 
  preHost
})
