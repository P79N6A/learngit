
import { getAction } from '@utils/request-presets';

const preHost = 'http://30.11.141.65:8080'
export const url_getMonitorList = getAction({ 
  name:'获取设备监控列表', 
  url: '/deviceMonitor/list',
  urlJson:'/src/mock/deviceOm/monitor/monitor.json',
  evn:'USE_JSON', 
  preHost
})

export const url_getMonitorDetail = getAction({ 
  name:'获取设备监控详情', 
  url: '/logManagement/deviceInfo/query',
  urlJson:'/src/mock/deviceOm/monitor/detail.json',
  evn:'USE_JSON', 
  preHost
})
