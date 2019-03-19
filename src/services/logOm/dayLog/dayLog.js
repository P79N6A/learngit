import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_orderedQuery = getAction({ 
  name:'获取流水日志列表', 
  url: '/logManagement/ordered/query',
  urlJson:'/src/mock/logOm/getDayList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_getCheckInStep = getAction({ 
  name:'入住单步骤', 
  url: '/common/getCheckInStep',
  urlJson:'/src/mock/logOm/getCheckInStep.json',
  evn:'USE_PRE', 
  preHost
})
export const url_getCheckInStepStatus = getAction({ 
  name:'入住单状态', 
  url: '/common/getCheckInStepStatus',
  urlJson:'/src/mock/logOm/getCheckInStepStatus.json',
  evn:'USE_PRE', 
  preHost
})
