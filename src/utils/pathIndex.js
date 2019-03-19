const INDEX_DEVICE_OP = '/deviceOm/deviceOp' //设备管理首页
const INDEX_DEVICE_TEM_OP = '/deviceOm/deviceOp/template' //设备管理-模板首页
const INDEX_DEVICE_TEM_PARAM = '/deviceOm/deviceOp/getParam' //设备管理-参数配置
const INDEX_DEVICE_LOGCOLLECT = '/deviceOm/deviceOp/logCollect' //设备管理-日志采集
const INDEX_DEVICE_DETECTION = '/deviceOm/deviceOp/detection' //设备管理-远程监测
const INDEX_DEVICE_ACTIVE = '/deviceOm/deviceOp/active' //设备管理-设备激活
const INDEX_DEVICE_MONITOR = '/deviceOm/deviceMonitor' //设备管理-设备监控
const INDEX_DEVICE_BATCH = '/deviceOm/deviceOp/batch' //设备管理-批量操作

const INDEX_WARNING_OP = '/deviceOm/warningOp' //告警管理首页

const INDEX_WARNING_RULES = '/deviceOm/warningOp/warningRules' //设备运维 告警管理-规则首页

const INDEX_CODE_DEFINE = '/system/errorM/codeDefine' //错误码-定义首页
const INDEX_CODE_MAP = '/system/errorM/codeMap' //错误码-映射首页
const INDEX_MATCH_RULE = '/system/errorM/matchRule' //错误码-匹配规则首页
const INDEX_MATCH_RULE_PARTNER = '/system/errorM/matchRulePartner' //错误码-合作伙伴匹配规则首页

const INDEX_PSB_UPLOAD = '/deviceOm/psbUpload' //设备运维-psb上传首页
const INDEX_REPORT_DAY = '/dataAnaly/day' //数据分析-数据报表
const INDEX_REPORT_ORDER = '/orderMa/order' //订单管理-订单首页
const INDEX_REPORT_PEOPLE = '/userMa/people' //用户管理-入住人首页
const INDEX_REPORT_BEHAVIOR = '/logOm/behavior' //数据报表-用户行为数据
const INDEX_REPORT_BEHAVIOR_DETAIL = '/logOm/behavior/detail' //数据报表-用户行为数据-详情

const INDEX_ORDER_CHECKOUT = '/orderMa/checkout' //数据报表-离店明细
const INDEX_ORDER_WALKIN = '/orderMa/checkout' //数据报表-离店明细

const INDEX_LOGOM_DAY = '/logOm/dayLog' //日志管理-日常首页
const INDEX_LOGOM_DEVICE = '/logOm/deviceLog' //日志管理-设备首页
const INDEX_LOGOM_OPERATE = '/system/operate' //日志管理-操作首页
const INDEX_LOGOM_MESSAGE = '/logOm/message' //日志管理-短信首页

const INDEX_REPORT_DAYOLD = '/dataOld/dayOld' //历史数据-每日汇总
const INDEX_REPORT_ORDEROLD = '/dataOld/orderOld' //历史数据-订单明细
const INDEX_REPORT_PEOPLEOLD = '/dataOld/peopleOld' //历史数据-入住人明细

const INDEX_MONITOR_DATASTA = '/monitor/dataSta' //监控大盘-数据分析首页
const INDEX_MONITOR_DATADEFINE = '/monitor/dataDefine' //监控大盘-数据定义首页
const INDEX_MONITOR_FAILANA = '/monitor/failAna' //监控大盘-失败分析首页

const INDEX_PEOPLE_OP = '/system/peopleOp' //设备运维 人员管理首页
const INDEX_PARTNER_OP = '/enterprise/partnerOp' //设备运维 合作伙伴首页
const INDEX_BLOC_OP = '/enterprise/blocOp' //设备运维 集团管理首页
const INDEX_HOTEL_OP = '/enterprise/hotelOp' //酒店管理首页
const INDEX_GLOBAL_CONFIG = '/system/globalConfig' //全局配置-首页

const INDEX_DEVICE_APPVM = '/deviceOm/appVM' //APP版本管理首页

const INDEX_DEAL_QUERY = '/dealOm/dealQuery' //交易查询首页

const INDEX_WORKORDER_IMPLEMENT = '/workorder/implement' //工单管理--实施工单


export {
  INDEX_DEVICE_OP,
  INDEX_DEVICE_TEM_OP,
  INDEX_HOTEL_OP,
  INDEX_WARNING_RULES,
  INDEX_WARNING_OP,
  INDEX_CODE_DEFINE,
  INDEX_CODE_MAP,
  INDEX_REPORT_DAY,
  INDEX_REPORT_ORDER,
  INDEX_REPORT_PEOPLE,
  INDEX_LOGOM_DAY,
  INDEX_LOGOM_DEVICE,
  INDEX_LOGOM_OPERATE,
  INDEX_MONITOR_DATASTA,
  INDEX_MONITOR_DATADEFINE,
  INDEX_MONITOR_FAILANA,
  INDEX_DEVICE_APPVM,
  INDEX_MATCH_RULE,
  INDEX_MATCH_RULE_PARTNER,
  INDEX_PEOPLE_OP,
  INDEX_PARTNER_OP,
  INDEX_BLOC_OP,
  INDEX_GLOBAL_CONFIG,
  INDEX_PSB_UPLOAD,
  INDEX_DEAL_QUERY,
  INDEX_LOGOM_MESSAGE,
  INDEX_ORDER_CHECKOUT,
  INDEX_DEVICE_LOGCOLLECT,
  INDEX_DEVICE_DETECTION,
  INDEX_DEVICE_BATCH,
  INDEX_REPORT_BEHAVIOR,
  INDEX_REPORT_BEHAVIOR_DETAIL,
  INDEX_DEVICE_ACTIVE,
  INDEX_DEVICE_MONITOR,
  INDEX_DEVICE_TEM_PARAM,
  INDEX_WORKORDER_IMPLEMENT,
  INDEX_ORDER_WALKIN,
  INDEX_REPORT_DAYOLD,
  INDEX_REPORT_ORDEROLD,
  INDEX_REPORT_PEOPLEOLD,
}
