import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG } from '@models/common/common';
import { INDEX_REPORT_DAYOLD } from '@utils/pathIndex';
import { url_getDailySheets, url_exportDayList, url_getDailySummary } from '@services/dataReport/day/day';
import moment from 'moment'
const DeviceModal = extend(PageModel, {
  namespace: 'dayOld',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_REPORT_DAYOLD) {
          const startTime = moment().subtract(1,'days').format('YYYY-MM-DD')
          const endTime = moment().subtract(1,'days').format('YYYY-MM-DD')
          dispatch({ type:'save',payload:{ isShowExport:true, filter:{ startTime, endTime } } })
          dispatch({ type: 'queryBaseData', payload:{ startTime, endTime, queryType:4} })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload={} }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.dayOld.filter || {}))
      //判断导出
      const start = payload.startTime || filter['startTime']
      const end = payload.endTime || filter['endTime']
      if(start && end && moment(end).diff(moment(start),'year') < 1) {
        yield put({ type:'save',payload:{ isShowExport:true } })
      } else {
        yield put({ type:'save',payload:{ isShowExport:false } })
      }
      const res = yield call(url_getDailySheets.fn, { ...payload, ...filter });
      if (res.success && res.data) {
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
        yield put({ type:'save', payload:{ allLine:res.data.dailySummaryVO, allLine2:res.data.dailySummaryVO2 } })
      } else {
        message.error(ERROR_MSG(res,url_getDailySheets.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *exportDayList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { filter } = yield select(state => state.dayOld)
      const res = yield call(url_exportDayList.fn, { ...payload, ...filter, queryType:4 });
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

