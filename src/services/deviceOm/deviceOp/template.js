import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8080'
export const url_getConfigs = getAction({ 
  name:'获取模板列表', 
  url: '/deviceModel/page/getConfigs',
  urlJson: '/src/mock/getModulesList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_disable = getAction({ 
  name:'禁用', 
  url: '/deviceModel/config/disable',
  evn:'USE_JSON', 
  preHost
})
export const url_available = getAction({ 
  name:'启用', 
  url: '/deviceModel/config/available',
  evn:'USE_JSON', 
  preHost
})
export const url_saveConfig = getAction({ 
  name:'新增模板类型', 
  url: '/deviceModel/saveConfig',
  evn:'USE_JSON', 
  preHost
})
export const url_getConfig = getAction({ 
  name:'根据id获取模板信息', 
  url: '/deviceModel/getConfig',
  evn:'USE_JSON', 
  urlJson: '/src/mock/getModules.json',
  preHost
})
export const url_getConfigType = getAction({ 
  name:'获取模板类型', 
  url: '/common/getConfigType',
  evn:'USE_JSON', 
  urlJson: '/src/mock/getTemConfList.json',
  preHost
})
