
import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_getPSB = getAction({
  name:'获取psb列表',
  url: '/hotel/page/getPSB',
  urlJson:'/src/mock/deviceOm/psbUpload/psbList.json',
  evn:'USE_JSON',
  preHost
})
export const url_uploadPSB = getAction({
  name:'调用psb',
  url: '/hotel/uploadPSB',
  evn:'USE_JSON',
  preHost
})
export const url_cancelUploadPSB = getAction({
  name:'取消psb轮询',
  url: '/hotel/cancelUploadPSB',
  evn:'USE_JSON',
  preHost
})
