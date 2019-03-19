import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8088'
export const url_getOrderDetails = getAction({ 
  name:'获取入住人数据列表', 
  url: '/report/page/getGuestDetails',
  urlJson:'/src/mock/dataReport/getPeopleList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_exportGuestDetails = getAction({ 
  name:'导出入住人数据列表', 
  url: '/report/export/getGuestDetails',
  urlJson:'/src/mock/dataReport/exportDaily.json',
  evn:'USE_PRE', 
  preHost
})
