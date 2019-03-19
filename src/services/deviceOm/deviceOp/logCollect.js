import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.99.220:8080'
export const url_setDataCollectionRate = getAction({ 
  name:'设置采集频率', 
  url: '/deviceManage/setDataCollectionRate',
  evn:'USE_PRE', 
  preHost
})
export const url_getDataCollectionRate = getAction({ 
  name:'获取采集频率', 
  url: '/deviceManage/getDataCollectionRate',
  urlJson:'/src/mock/errorM/getDefineList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_queryAppState = getAction({ 
  name:'采集结果', 
  url: '/deviceManage/queryAppState',
  urlJson:'/src/mock/deviceOm/deivce/logCollectList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_queryAppDetection = getAction({ 
  name:'监测结果', 
  url: '/deviceManage/queryAppDetection',
  urlJson:'/src/mock/errorM/getDefineList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_sendAppDetectionCommand = getAction({ 
  name:'开始监测', 
  url: '/deviceManage/sendAppDetectionCommand',
  urlJson:'/src/mock/errorM/getDefineList.json',
  evn:'USE_PRE', 
  preHost
})
