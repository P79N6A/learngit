import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG } from '@models/common/common';
import { INDEX_REPORT_DAY } from '@utils/pathIndex';
import { url_getDailySheets, url_exportDayList, url_getDailySummary } from '@services/dataAnaly/day/day';
import moment from 'moment'
const DeviceModal = extend(PageModel, {
  namespace: 'day',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_REPORT_DAY) {
          dispatch({ type: 'queryBaseData', payload:{ queryType:1 } })
        }
      })
    },
  },

  effects: {
    //获取列表queryType 1入住 2冻结 3GMV
    *queryBaseData({ payload={} }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.day.filter || {}))
      //判断导出
      const startTime = filter['startTime'] || moment().subtract(1,'days').format('YYYY-MM-DD')
      const endTime = filter['endTime'] || moment().subtract(1,'days').format('YYYY-MM-DD')
      payload.startTime = startTime
      payload.endTime = endTime
      if(startTime && endTime && moment(endTime).diff(moment(startTime),'year') < 1) {
        yield put({ type:'save',payload:{ isShowExport:true } })
      } else {
        yield put({ type:'save',payload:{ isShowExport:false } })
      }
      const res = yield call(url_getDailySheets.fn, { ...payload, ...filter });
      if (res.success) {
        const list = (res.data.dailyDataSheetVOS && res.data.dailyDataSheetVOS.length>0)?res.data.dailyDataSheetVOS.map((v,n)=>{
          v.key = n
          return v
        }):res.data.dailyDataSheetVOS
        
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: list,
            pagination: {
              total: res.count,
              current: res.currentPage,
              pageSize: res.currentSize,
            },
          },
        })
        yield put({ type:'save', payload:{ dailySummaryVO:res.data.dailySummaryVO, queryType:payload.queryType, startTime, endTime } })
      } else {
        message.error(ERROR_MSG(res,url_getDailySheets.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *exportDayList({ payload={} }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { filter, queryType, startTime, endTime } = yield select(state => state.day)
      payload.queryType = queryType
      startTime && (filter.startTime = startTime)
      endTime && (filter.endTime = endTime)
      const res = yield call(url_exportDayList.fn, { ...payload, ...filter });
      if (res.success && res.data) {
        window.location.href = res.data;
      } else {
        message.error(ERROR_MSG(res,url_exportDayList.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getDailySummary({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getDailySummary.fn, { ...payload });
      if (res.success) {
        yield put({ type:'save', payload:{ allLine:res.data.dailySummary } })
      } else {
        message.error(ERROR_MSG(res,url_getDailySummary.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  },
})

export default DeviceModal;

