import { getAction } from '@utils/request-presets';

const preHost = 'http://30.11.141.65:8080'
export const url_getWalkinList = getAction({ 
  name:'walkin明细', 
  url: '/report/page/getWalkinDetails',
  urlJson:'/src/mock/dataReport/getWalkinList.json',
  evn:'USE_JSON', 
  preHost
})
