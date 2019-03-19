import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.98.76:8081'
export const url_getMatchRules = getAction({ 
  name:'获取匹配规则列表', 
  url: '/errorinfo/page/getMatchRules',
  urlJson:'/src/mock/errorM/errorMatchRulesList.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_matchRulesAdd = getAction({ 
  name:'新增匹配规则', 
  url: '/errorinfo/matchrule/add',
  evn:'USE_PRE', 
  preHost
})
export const url_matchRulesUpdate = getAction({ 
  name:'新增匹配规则', 
  url: '/errorinfo/matchrule/update',
  evn:'USE_PRE', 
  preHost
})
export const url_matchRulesDelete = getAction({ 
  name:'删除匹配规则', 
  url: '/errorinfo/matchrule/delete',
  evn:'USE_PRE', 
  preHost
})
export const url_matchRulesInfo = getAction({ 
  name:'获取匹配规则信息', 
  url: '/errorinfo/matchrule/info',
  urlJson:'/src/mock/errorM/getDefineInfo.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_matchRulesForbind = getAction({ 
  name:'禁用匹配规则', 
  url: '/errorinfo/matchrule/update',
  evn:'USE_PRE', 
  preHost
})
