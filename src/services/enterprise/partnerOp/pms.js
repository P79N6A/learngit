
import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.92.13:8080'
export const url_getPmsConfig = getAction({ 
  name:'获取pms配置', 
  url: '/partnerProduct/getByPmsCode',
  urlJson:'/src/mock/system/pms/getByPmsCode.json',
  evn:'USE_JSON', 
  preHost
})
export const url_saveOrUpdate = getAction({ 
  name:'设置pms配置', 
  url: '/partnerProduct/saveOrUpdate',
  evn:'USE_JSON', 
  preHost
})
export const url_getPartnerProductList = getAction({ 
  name:'获取合作伙伴产品列表', 
  url: '/partnerProduct/getPartnerProductList',
  urlJson:'/src/mock/system/pms/partnerProList.json',
  evn:'USE_JSON', 
  preHost
})
