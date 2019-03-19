import { getAction } from '@utils/request-presets';

const preHost = 'http://cikms.daily.jv.fliggy.com'
export const url_getMessageLogList = getAction({
  name:'获取短信日志列表',
  url: '/logManagement/message/query',
  urlJson:'/src/mock/logOm/getMessageLog.json',
  evn:'USE_PRE',
  preHost
})
