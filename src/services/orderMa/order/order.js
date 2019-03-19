import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8088'
export const url_getOrderDetails = getAction({ 
  name:'获取每日数据列表', 
  url: '/report/page/getOrderDetails',
  urlJson:'/src/mock/dataReport/getOrderList.json',
  evn:'USE_PRE', 
  preHost
})
export const url_exportOrderDetails = getAction({ 
  name:'导出订单数据列表', 
  url: '/report/export/getOrderDetails',
  urlJson:'/src/mock/dataReport/exportDaily.json',
  evn:'USE_PRE', 
  preHost
})
