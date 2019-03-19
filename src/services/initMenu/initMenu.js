import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.98:9090'
export const url_getDataReportSwitch = getAction({
  name:'获取旧版报表',
  url: '/report/page/getDataReportSwitch',
  evn:'USE_JSON',
  preHost
})
