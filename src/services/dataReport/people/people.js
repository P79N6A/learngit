import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8080'
export const url_getOrderDetails = getAction({ 
  name:'获取入住人数据列表', 
  url: '/report/page/getGuestDetailsOld',
  urlJson:'/src/mock/dataReport/getPeopleList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_exportGuestDetails = getAction({ 
  name:'导出入住人数据列表', 
  url: '/report/export/getGuestDetailsOld',
  urlJson:'/src/mock/dataReport/exportDaily.json',
  evn:'USE_JSON', 
  preHost
})
