import { getActionCors, getMock } from '@utils/request-presets';
const preHost = 'http://opf.pre.futurehotel.com'
const dailyHost = 'http://opf.daily.futurehotel.com'
const pubHost = 'http://opf.futurehotel.com'
// const pubHost = 'http://10.63.101.176:8130'

let hostUrl = dailyHost
//根据域名判断接口地址
if(location.host.includes('pre')) {
  hostUrl = preHost
} else if(location.host.includes('daily')) {
  hostUrl = dailyHost
} else {
  hostUrl = pubHost
}
export const url_getImplementList = getActionCors({ 
  name:'实施工单列表', 
  url: '/api/dapf/query/multiCondition',
  urlJson:'/src/mock/workorder/implementList.json',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})

export const url_getImplementDetail = getActionCors({ 
  name:'实施工单详情', 
  url: '/api/dapf/query',
  urlJson:'/src/mock/workorder/implementDetail.json',
  evn:'USE_PRE', 
  method:'get',
  body:'formData',
  cors:true,
  hostUrl
})

export const url_getEquproducerList = getActionCors({ 
  name:'获取设备商列表', 
  url: '/api/dapf/query/equproducer',
  urlJson:'/src/mock/workorder/equproducer.json',
  evn:'USE_PRE', 
  method:'get',
  body:'formData',
  cors:true,
  hostUrl
})

export const url_save = getActionCors({ 
  name:'保存', 
  url: '/api/dapf/save',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})

export const url_payout = getActionCors({ 
  name:'派发', 
  url: '/api/dapf/payout',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})
export const url_update = getActionCors({ 
  name:'修改工单', 
  url: '/api/dapf/updateStatus',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})
export const url_addRemark = getActionCors({ 
  name:'添加备注', 
  url: '/api/dapf/add/remark',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})

export const url_deleteFile = getActionCors({ 
  name:'删除', 
  url: '/api/dapf/file/deleteFile',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})

export const url_deleteFileOld = getActionCors({ 
  name:'删除', 
  url: '/api/dapf/temp/delete',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})

export const url_addContact = getActionCors({ 
  name:'上传联系人', 
  url: '/api/dapf/add/contact',
  evn:'USE_PRE', 
  cors:true,
  hostUrl
})

export const uploadPackage = {
  name:'上传资料',
  action: getMock({
    urlPub:'/api/dapf/file/uploadFile',
    urlPre:`${hostUrl}/api/dapf/file/uploadFile`,
  },'USE_PRE'),
}

export const uploadPackageOld = {
  name:'上传安装包',
  action: getMock({
    urlPub:'/api/dapf/temp/upload',
    urlPre:`${hostUrl}/api/dapf/temp/upload`,
  },'USE_PRE'),
}

export const url_downloadFile = {
  name:'下载',
  action: getMock({
    urlPub:'/api/dapf/file/downloadFile',
    urlPre:`${hostUrl}/api/dapf/file/downloadFile`,
  },'USE_PRE'),
  getMock,
}

export const url_downloadFileOld = {
  name:'下载',
  action: getMock({
    urlPub:'/api/dapf/temp/download',
    urlPre:`${hostUrl}/api/dapf/temp/download`,
  },'USE_PRE'),
  getMock,
}

export const url_done = getActionCors({ 
  name:'实施完成', 
  url: '/api/dapf/done',
  evn:'USE_PRE', 
  hostUrl
})

export const url_verify = getActionCors({ 
  name:'跳转', 
  url: '/api/dapf/verify.json',
  evn:'USE_PRE', 
  hostUrl
})

