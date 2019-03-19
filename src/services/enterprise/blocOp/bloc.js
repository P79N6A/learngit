
import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.100.239:8080'
// const preHost = 'http://cikms.daily.jv.fliggy.com'
export const url_getGroups = getAction({
  name:'获取集团列表',
  url: '/hotel/page/getGroups',
  urlJson:'/src/mock/enterprise/blocOp/getList.json',
  evn:'USE_PRE',
  preHost
})
export const url_getGroupById = getAction({
  name:'获取集团信息',
  url: '/hotel/getGroupById',
  urlJson:'/src/mock/enterprise/blocOp/getGroupById.json',
  evn:'USE_PRE',
  preHost
})
export const url_addGroup = getAction({
  name:'新增集团',
  url: '/hotel/addGroup',
  evn:'USE_PRE',
  preHost
})
export const url_updateGroup = getAction({
  name:'更新集团',
  url: '/hotel/updateGroup',
  evn:'USE_PRE',
  preHost
})
export const url_getGroupNames = getAction({
  name:'获取集团名称列表',
  url: '/hotel/getGroupNames',
  evn:'USE_PRE',
  urlJson:'/src/mock/deviceOm/blocOp/getNames.json',
  preHost
})
