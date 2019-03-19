import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.101.113:8080'
export const url_getOperationLogList = getAction({ 
  name:'获取操作日志列表', 
  url: '/logManagement/operation/query',
  urlJson:'/src/mock/logOm/getOperateList.json',
  evn:'USE_PRE', 
  preHost
})
