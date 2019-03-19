import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_getHotelMakeCardRules = getAction({ 
  name:'获取制卡规则列表', 
  url: '/hotel/page/getHotelMakeCardRules',
  urlJson:'/src/mock/system/hotel/makeCard.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_getHotelMakeCardRule = getAction({ 
  name:'获取制卡规则信息', 
  url: '/hotel/getHotelMakeCardRule',
  urlJson:'/src/mock/system/hotel/getMakeCardInfo.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_AddHotelMakeCardRule = getAction({ 
  name:'添加制卡规则', 
  url: '/hotel/addHotelMakeCardRule',
  evn:'USE_PRE', 
  preHost
})
export const url_updateHotelMakeCardRule = getAction({ 
  name:'更新制卡规则', 
  url: '/hotel/updateHotelMakeCardRule',
  evn:'USE_PRE', 
  preHost
})
export const url_delHotelMakeCardRule = getAction({ 
  name:'删除制卡规则', 
  url: '/hotel/delHotelMakeCardRule',
  evn:'USE_PRE', 
  preHost
})
