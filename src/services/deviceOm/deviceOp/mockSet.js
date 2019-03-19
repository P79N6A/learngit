
import { getAction } from '@utils/request-presets';

const preHost = 'http://30.11.141.65:8080'

export const url_getMockDetail = getAction({ 
  name:'获取设备监控详情', 
  url: '/deviceManage/queryMockInfo',
  urlJson:'/src/mock/deviceOm/monitor/detail.json',
  evn:'USE_JSON', 
  preHost
})

export const url_setMockDetail = getAction({ 
  name:'设置设备监控详情', 
  url: '/deviceManage/updateMockInfo',
  evn:'USE_JSON', 
  preHost
})
