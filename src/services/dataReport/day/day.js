import { getAction } from '@utils/request-presets';

const preHost = 'http://10.63.97.160:8080'
export const url_getDailySheets = getAction({ 
  name:'获取每日数据列表', 
  url: '/report/page/getDailySheets',
  urlJson:'/src/mock/dataReport/getDayList.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_exportDayList = getAction({ 
  name:'导出每日数据列表', 
  url: '/report/export/getDailySheets',
  urlJson:'/src/mock/dataReport/exportDaily.json',
  evn:'USE_PRE', 
  
  preHost
})
export const url_getDailySummary = getAction({ 
  name:'每日汇总概况', 
  url: '/report/getDailySummary',
  urlJson:'/src/mock/dataReport/getDailySummary.json',
  evn:'USE_PRE', 
  
  preHost
})
