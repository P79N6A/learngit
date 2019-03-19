
import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.99.220:8080'
export const url_getOrders = getAction({ 
  name:'获取交易列表', 
  url: '/payorder/page/getOrders',
  urlJson:'/src/mock/dealOm/getList.json',
  evn:'USE_JSON', 
  preHost
})
export const url_settleAccount = getAction({ 
  name:'结账', 
  url: '/payorder/settleAccount',
  evn:'USE_JSON', 
  preHost
})
export const url_unfreeze = getAction({ 
  name:'解冻', 
  url: '/payorder/unfreeze',
  evn:'USE_JSON', 
  preHost
})
export const url_revokeSettleAccount = getAction({ 
  name:'撤销', 
  url: '/payorder/revokeSettleAccount',
  evn:'USE_JSON', 
  preHost
})
export const url_findOperatorLog = getAction({ 
  name:'查询详情', 
  url: '/payorder/findOperatorLog',
  evn:'USE_JSON', 
  preHost
})
export const url_payOrderExport = getAction({ 
  name:'导出', 
  url: '/payorder/export',
  evn:'USE_JSON', 
  preHost
})
