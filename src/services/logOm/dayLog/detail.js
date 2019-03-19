import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_detaiQuery = getAction({ 
  name:'获取流水日志详情列表', 
  url: '/logManagement/ordered/detail',
  urlJson:'/src/mock/logOm/getDayDetailList.json',
  evn:'USE_PRE', 
  preHost
})
