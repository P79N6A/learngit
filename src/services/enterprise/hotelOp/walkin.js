import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.99.220:8888'
export const url_updateWalkin = getAction({ 
  name:'更新walkin', 
  url: '/hotel/function/walkin/update',
  evn:'USE_PRE', 
  preHost
})
export const url_getWalkin = getAction({ 
  name:'获取walkin配置', 
  url: '/hotel/function/walkin/get',
  urlJson:'/src/mock/system/hotel/getWalkin.json',
  evn:'USE_PRE', 
  preHost
})
