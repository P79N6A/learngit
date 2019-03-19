
import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.92.13:8080'
export const url_getPartners = getAction({ 
  name:'合作伙伴列表', 
  url: '/partner/page/getPartners',
  urlJson:'/src/mock/deviceOm/partnerOp/getPartnerList.json',
  evn:'USE_JSON', 
  
  preHost
})
export const url_partnerInfo = getAction({
  name:'获取合作伙伴信息', 
  url: '/partner/partnerInfo',
  urlJson:'/src/mock/deviceOm/partnerOp/getPartnerInfo.json',
  evn:'USE_JSON', 
  
  preHost
})
export const url_addPartner = getAction({
  name:'新增合作伙伴', 
  url: '/partner/addPartner',
  evn:'USE_JSON', 
  preHost
})
export const url_updatePartner = getAction({
  name:'更新合作伙伴', 
  url: '/partner/updatePartner',
  evn:'USE_JSON', 
  preHost
})
export const url_partnerListType = getAction({
  name:'合作伙伴类型列表', 
  url: '/partner/listType',
  urlJson:'/src/mock/deviceOm/partnerOp/getTypeList.json',
  evn:'USE_JSON', 
  
  preHost
})
