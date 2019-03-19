
import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.92.13:8080'

export const url_getPartnerProducts = getAction({ 
  name:'获取产品列表', 
  url: '/partnerProduct/page/getPartnerProducts',
  urlJson:'/src/mock/deviceOm/partnerOp/getProductList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_addPartnerProduct = getAction({ 
  name:'添加产品', 
  url: '/partnerProduct/addPartnerProduct',
  evn:'USE_JSON', 
  preHost
})
export const url_updatePartnerProduct = getAction({ 
  name:'更新产品', 
  url: '/partnerProduct/updatePartnerProduct',
  evn:'USE_JSON', 
  preHost
})
export const url_partnerProductsInfo = getAction({ 
  name:'获取产品信息', 
  url: '/partnerProduct/partnerProductInfo',
  urlJson:'/src/mock/deviceOm/partnerOp/getProductInfo.json',
  evn:'USE_JSON', 
  preHost
})
