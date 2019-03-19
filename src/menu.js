export const menuData = [
  {
    name: '企业管理',
    icon: 'laptop',
    path: 'enterprise',
    children: [
      {
        name: '酒店管理',
        path: 'hotelOp',
      },
      {
        name: '集团管理',
        path: 'blocOp'
      },
      {
        name: '合作伙伴',
        path: 'partnerOp'
      },
    ],
  },
  {
    name: '设备运维',
    icon: 'appstore',
    path: 'deviceOm',
    children: [
      {
        name: '设备管理',
        path: 'deviceOp'
      },
      {
        name: '版本管理',
        path: 'appVM',
      },
      {
        name: 'PSB上传',
        path: 'psbUpload',
      },
      {
        name: '设备监控',
        path: 'deviceMonitor',
      },
    ],
  },
  {
    name: '历史数据',
    icon: 'bar-chart',
    path: 'dataOld',
    children: [
      {
        name: '每日汇总',
        path: 'dayOld',
      },
      {
        name: '订单明细',
        path: 'orderOld',
      },
      {
        name: '入住人明细',
        path: 'peopleOld',
      },
    ],
  },
  {
    name: '数据分析',
    icon: 'area-chart',
    path: 'dataAnaly',
    children: [
      {
        name: '数据报表',
        path: 'day',
      },
    ],
  },
  {
    name: '订单管理',
    icon: 'ordered-list',
    path: 'orderMa',
    children: [
      {
        name: '入住单查询',
        path: 'order',
      },
      {
        name: '退房明细',
        path: 'checkout',
      },
      {
        name: 'walkin明细',
        path: 'walkin',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'user',
    path: 'userMa',
    children: [
      {
        name: '入住用户查询',
        path: 'people',
      },
    ],
  },
  {
    name: '日志管理',
    icon: 'code',
    path: 'logOm',
    children: [
      {
        name: '用户行为',
        path: 'behavior',
      },
      {
        name: '流水日志',
        path: 'dayLog',
      },
      {
        name: '短信日志',
        path: 'message',
      }
    ],
  },
  {
    name: '交易管理',
    icon: 'red-envelope',
    path: 'dealOm',
    children: [
      {
        name: '交易明细',
        path: 'dealQuery',
      },
    ],
  },
  {
    name: '工单管理',
    icon: 'layout',
    path: 'workorder',
    children: [
      {
        name: '实施工单',
        path: 'implement',
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'desktop',
    path: 'system',
    children: [
      {
        name: '全局配置',
        path: 'globalConfig',
      },
      {
        name: '操作日志',
        path: 'operate',
      },
      {
        name: '错误配置',
        path: 'errorM',
        children: [
          {
            name: '标准错误',
            path: 'codeDefine',
          },
          {
            name: '错误映射',
            path: 'codeMap',
          },
          {
            name: '系统规则',
            path: 'matchRule',
          },
          {
            name: '伙伴规则',
            path: 'matchRulePartner',
          }
        ],
      },
    ],
  },
]

// eslint-disable-next-line
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g

export function isUrl(path) {
  return reg.test(path)
}

function formatter(data, parentPath = '/') {
  return data.map((item) => {
    let { path } = item
    if (!isUrl(path)) {
      path = parentPath + item.path
    }
    const result = {
      ...item,
      path,
    }
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`)
    }
    return result
  })
}

export default formatter(menuData)
