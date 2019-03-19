import { getAction } from '@utils/request-presets';
const preHost = 'http://10.63.99.220:8080'
export const url_getBatchDevices = getAction({ 
  name:'获取设备列表', 
  url: '/deviceManage/page/getBatchDevices',
  urlJson: '/src/mock/deviceOm/batch/batchList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_batchLockOrUnlock = getAction({ 
  name:'批量锁定或解锁', 
  url: '/deviceManage/batchLockOrUnlock',
  evn:'USE_JSON', 
  preHost
})
export const url_batchSendOrCancel = getAction({ 
  name:'批量推送或取消', 
  url: '/deviceManage/batchSendOrCancel',
  evn:'USE_JSON', 
  preHost
})
