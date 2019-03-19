import { getAction, getMock, resConfig } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8080'
export const url_updateHotelAD = getAction({
  name:'更新酒店广告配置',
  url: '/hotel/updateHotelAD',
  evn:'USE_PRE',
  preHost
})
export const url_getHotelAD = getAction({
  name:'查询酒店广告配置',
  url: '/hotel/getHotelAD',
  urlJson:'/src/mock/system/hotel/ADManage.json',
  evn:'USE_PRE',
  preHost
})

export const hotelUpload = {
  name:'上传图片',
  action: getMock({
    urlPub:'/upload/img.do',
    urlPre:`${preHost}/upload/img.do`,
  },resConfig.isMock?'USE_PRE':'USE_PUB'),
}
