import { getAction } from '@utils/request-presets';

const preHost = 'http://30.11.141.65:8080'
export const url_getCheckoutList = getAction({ 
  name:'离店明细', 
  url: '/report/page/getWalkOutDetails',
  urlJson:'/src/mock/dataReport/getDayList.json',
  evn:'USE_PRE', 
  preHost
})
