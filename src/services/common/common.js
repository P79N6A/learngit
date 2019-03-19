import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.98:9090'
export const url_setProperties = getAction({
  name:'设置属性',
  url: '/hotel/param/update',
  urlJson:'/src/mock/system/hotel/findByHid.json',
  evn:'USE_JSON',
  preHost
})
export const url_getProperties = getAction({
  name:'获取属性',
  url: '/hotel/param/get',
  urlJson:'/src/mock/commonConfig/commonConfig.json',
  evn:'USE_JSON',
  preHost
})
export const url_decrypt = getAction({
  name:'解密',
  url: '/common/decrypt',
  evn:'USE_PRE',
  preHost
})
