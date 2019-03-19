import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.98.76:8081'
export const url_getPartnerMatchRules = getAction({ 
  name:'获取合作伙伴匹配规则列表', 
  url: '/errorinfo/page/getPartnerMatchRule',
  urlJson:'/src/mock/errorM/partnerMatchRulesList.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_partnerMatchRulesAdd = getAction({ 
  name:'新增合作伙伴匹配规则', 
  url: '/errorinfo/partnerMatchRule/add',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerMatchRulesUpdate = getAction({ 
  name:'更新合作伙伴匹配规则', 
  url: '/errorinfo/partnerMatchRule/update',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerMatchRulesDelete = getAction({ 
  name:'删除合作伙伴匹配规则', 
  url: '/errorinfo/partnerMatchRule/delete',
  evn:'USE_PRE', 
  preHost
})
export const url_partnerMatchRulesInfo = getAction({ 
  name:'获取合作伙伴匹配规则信息', 
  url: '/errorinfo/partnerMatchRule/info',
  urlJson:'/src/mock/errorM/getMatchRulePartnerInfo.json',
  evn:'USE_PRE', 
  
  preHost
})
