import { getAction, getMock, resConfig } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
export const url_getHotelRoomRels = getAction({
  name:'获取所有酒店房号关联',
  url: '/hotel/page/getHotelRoomRels',
  urlJson:'/src/mock/system/hotel/findByHid.json',
  evn:'USE_PRE',
  preHost
})
export const url_getHotelRoomRel = getAction({
  name:'根据id获取房号关联',
  url: '/hotel/getHotelRoomRel',
  urlJson:'/src/mock/system/hotel/getRelationById.json',
  evn:'USE_PRE',

  preHost
})
export const url_addHotelRoomRel = getAction({
  name:'添加房间号关联',
  url: '/hotel/addHotelRoomRel',
  urlJson:'/src/mock/system/hotel/add.json',
  evn:'USE_PRE',
  preHost
})
export const url_updateHotelRoomRel = getAction({
  name:'更新房间号关联',
  url: '/hotel/updateHotelRoomRel',
  evn:'USE_PRE',
  preHost
})
export const url_delHotelRoomRel = getAction({
  name:'删除房号关联',
  url: '/hotel/delHotelRoomRel',
  evn:'USE_PRE',
  preHost
})
export const importRelation = {
  name:'excel导入关联关系',
  action: getMock({
    urlPub:'/hotel/importHotelRoomRel.do',
    urlPre:`${preHost}/hotel/importHotelRoomRel.do`,
  },resConfig.isMock?'USE_PRE':'USE_PUB'),
}
