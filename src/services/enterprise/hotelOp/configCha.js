import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_getHotelFeatures = getAction({ 
  name:'获取酒店特征列表', 
  url: '/hotel/page/getHotelFeatures',
  urlJson:'/src/mock/system/hotel/hotelFeatures.json', 
  evn:'USE_PRE', 
  preHost
})
export const url_getHotelFeature = getAction({ 
  name:'获取酒店特征信息', 
  url: '/hotel/getHotelFeature',
  urlJson:'/src/mock/system/hotel/hotelFeatureInfo.json', 
  evn:'USE_PRE', 
  preHost
})
export const url_addHotelFeature = getAction({ 
  name:'添加酒店特征', 
  url: '/hotel/addHotelFeature',
  evn:'USE_PRE', 
  preHost
})
export const url_updateHotelFeature = getAction({ 
  name:'更新酒店特征', 
  url: '/hotel/updateHotelFeature',
  evn:'USE_PRE', 
  preHost
})
export const url_delHotelFeature = getAction({ 
  name:'删除酒店特征', 
  url: '/hotel/delHotelFeature',
  evn:'USE_PRE', 
  preHost
})
