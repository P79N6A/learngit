import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
// const preHost = 'http://cikms.daily.jv.fliggy.com'
export const url_getHotels = getAction({
  name:'酒店列表',
  url: '/hotel/page/getHotels',
  urlJson:'/src/mock/deviceOm/hotelOp/getHotelList.json',
  evn:'USE_JSON',

  preHost
})
export const url_addHotel = getAction({
  name:'新增酒店信息',
  url: '/hotel/addHotel',
  urlJson:'/src/mock/addBind.json',
  evn:'USE_JSON',

  preHost
})
export const url_getHotelById = getAction({
  name:'获取酒店信息',
  url: '/hotel/getHotelById',
  urlJson:'/src/mock/deviceOm/hotelOp/getHotelById.json',
  evn:'USE_JSON',

  preHost
})
export const url_updateHotel = getAction({
  name:'更新酒店信息',
  url: '/hotel/updateHotel',
  evn:'USE_JSON',

  preHost
})
export const url_getHotelInfoFromTop = getAction({
  name:'获取飞猪信息',
  url: '/hotel/getHotelInfoFromTop',
  evn:'USE_JSON',
  urlJson:'/src/mock/deviceOm/hotelOp/getFeiInfo.json',
  preHost
})
export const url_getCounty = getAction({
  name:'获取县',
  url: '/common/getCounty',
  evn:'USE_JSON',

  urlJson:'/src/mock/deviceOm/hotelOp/getCounty.json',
  preHost
})
export const url_getProvince = getAction({
  name:'获取省',
  url: '/common/getProvince',
  evn:'USE_JSON',

  urlJson:'/src/mock/deviceOm/hotelOp/getprovince.json',
  preHost
})
export const url_getCity = getAction({
  name:'获取市',
  url: '/common/getCity',
  evn:'USE_JSON',

  urlJson:'/src/mock/deviceOm/hotelOp/getCity.json',
  preHost
})
export const url_getHotelStatus = getAction({
  name:'获取酒店状态',
  url: '/common/getHotelStatus',
  evn:'USE_JSON',

  urlJson:'/src/mock/deviceOm/hotelOp/getHotelStatus.json',
  preHost
})
export const url_getHotelSta = getAction({
  name:'获取酒店星级',
  url: '/common/getHotelStar',
  evn:'USE_JSON',

  urlJson:'/src/mock/deviceOm/hotelOp/getHotelStar.json',
  preHost
})
export const url_getHotelMakeCardRuleType = getAction({
  name:'获取酒店配置信息',
  url: '/hotel/getHotelMakeCardRuleType',
  evn:'USE_JSON',

  urlJson:'/src/mock/deviceOm/hotelOp/getHotelStar.json',
  preHost
})
export const url_setHotelMakeCardRuleType = getAction({
  name:'设置酒店配置信息',
  url: '/hotel/setHotelMakeCardRuleType',
  evn:'USE_JSON',

  urlJson:'/src/mock/deviceOm/hotelOp/getHotelStar.json',
  preHost
})
export const url_deviceInfoAdd = getAction({
  name:'新增绑定',
  url: '/hotel/addDevice',
  evn:'USE_JSON',
  preHost
})
