import { getAction } from '@utils/request-presets';
const preHost = 'http://10.63.98.76:8082'
export const url_getDevices = getAction({ 
  name:'获取设备列表', 
  url: '/deviceManage/page/getDevices',
  urlJson:'/src/mock/getDeviceList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_updateConf = getAction({ 
  name:'保存参数配置', 
  url: '/deviceManage/updateConf',
  evn:'USE_JSON', 
  preHost 
})
export const url_updateApp = getAction({ 
  name:'app推送升级', 
  url: '/deviceManage/updateApp',
  evn:'USE_JSON', 
  preHost
})
export const url_getIsDebug = getAction({ 
  name:'获取debug信息', 
  url: '/deviceManage/getIsDebug',
  urlJson: '/src/mock/deviceOm/deivce/getDebug.json',
  evn:'USE_JSON', 
  preHost
})
export const url_updateIsDebug = getAction({ 
  name:'设置debug信息', 
  url: '/deviceManage/updateIsDebug',
  evn:'USE_JSON', 
  preHost
})
export const url_pushConf = getAction({ 
  name:'推送配置', 
  url: '/deviceManage/pushConf',
  evn:'USE_JSON', 
  preHost
})
export const url_lockDevice = getAction({ 
  name:'锁定设备', 
  url: '/deviceManage/lockDevice',
  evn:'USE_JSON', 
  preHost
})
export const url_unlockDevice = getAction({ 
  name:'解锁设备', 
  url: '/deviceManage/unlockDevice',
  evn:'USE_JSON', 
  preHost
})
export const url_disableDevice = getAction({ 
  name:'设备禁用', 
  url: '/deviceManage/disableDevice',
  evn:'USE_JSON', 
  preHost
})
export const url_rebindDevice = getAction({ 
  name:'解除绑定', 
  url: '/deviceManage/rebindDevice',
  evn:'USE_JSON', 
  preHost
})
export const url_FSDCSelectView = getAction({ 
  name:'获取参数配置', 
  url: '/deviceModel/configSelectView',
  urlJson: '/src/mock/getParam1.json',
  evn:'USE_JSON', 
  preHost
})
export const url_getDeviceModelConfig = getAction({ 
  name:'编辑设备配置参数', 
  url: '/deviceManage/getDeviceModelConfig',
  urlJson: '/src/mock/editView.json',
  evn:'USE_JSON', 
  preHost
})
export const url_getAppType = getAction({ 
  name:'获取设备类型', 
  url: '/deviceManage/appversionInfo/getAppType',
  urlJson: '/src/mock/deviceOm/deivce/getDeviceType.json',
  evn:'USE_JSON', 
  preHost
})
export const url_driverType = getAction({ 
  name:'获取驱动类型', 
  url: '/levelUp/driverType',
  urlJson: '/src/mock/deviceOm/deivce/getDriveType.json',
  evn:'USE_JSON', 
  preHost
})
export const url_versionInfo = getAction({ 
  name:'获取品牌版本', 
  url: '/levelUp/versionInfo',
  urlJson: '/src/mock/deviceOm/deivce/getOther.json',
  evn:'USE_JSON', 
  preHost
})
export const url_updateDriver = getAction({ 
  name:'驱动升级', 
  url: '/faceScanDeviceManage/updateDriver',
  evn:'USE_JSON', 
  preHost
})
export const url_getSimpleDeviceModelConfig = getAction({ 
  name:'获取设备注册信息', 
  url: '/deviceManage/getSimpleDeviceModelConfig',
  evn:'USE_PRE', 
  preHost
})
export const url_addSimpleDeviceModelConfig = getAction({ 
  name:'设备注册', 
  url: '/deviceManage/addOrUpdateSimpleDeviceModelConfig',
  evn:'USE_PRE', 
  preHost
})
