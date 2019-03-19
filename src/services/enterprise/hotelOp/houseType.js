import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_getHotelRoomTypes = getAction({ 
  name:'获取所有房型列表', 
  url: '/hotel/page/getHotelRoomTypes',
  urlJson:'/src/mock/system/hotel/getRoomTypes.json', 
  evn:'USE_JSON', 
  preHost
})
export const url_getHotelRoomType = getAction({ 
  name:'根据id获取房型', 
  url: '/hotel/getHotelRoomType',
  urlJson:'/src/mock/system/hotel/getRelationById.json', 
  evn:'USE_PRE', 
  preHost
})
export const url_addHotelRoomType = getAction({ 
  name:'添加房型', 
  url: '/hotel/addHotelRoomType',
  evn:'USE_PRE', 
  preHost
})
export const url_deleteHotelRoomType = getAction({ 
  name:'删除房型', 
  url: '/hotel/deleteHotelRoomType',
  evn:'USE_PRE', 
  preHost
})
export const url_updateHotelRoomType = getAction({ 
  name:'更新房型', 
  url: '/hotel/updateHotelRoomType',
  evn:'USE_PRE', 
  preHost
})
export const url_isOpera = getAction({ 
  name:'是否是opear', 
  url: '/hotel/isOpera',
  urlJson:'/src/mock/system/hotel/isOpera.json',
  evn:'USE_PRE', 
  preHost
})
