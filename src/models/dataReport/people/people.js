import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_REPORT_PEOPLEOLD } from '@utils/pathIndex';
import Decrypt from '@models/common/decrypt';
import moment from 'moment'
import { url_getOrderDetails, url_exportGuestDetails } from '@services/dataReport/people/people';
const DeviceModal = extend(PageModel,Decrypt, {
  namespace: 'peopleOld',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_REPORT_PEOPLEOLD) {
          dispatch({ type:'save',payload:{ isShowExport:false } })
          dispatch({ type: 'queryBaseData' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload={} }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.peopleOld.filter || {}))
      //判断导出
      const start = payload.startTime || filter['startTime']
      const end = payload.endTime || filter['endTime']
      if(start && end && moment(end).diff(moment(start),'year') < 1) {
        yield put({ type:'save',payload:{ isShowExport:true } })
      } else {
        yield put({ type:'save',payload:{ isShowExport:false } })
      }
      const res = yield call(url_getOrderDetails.fn, { ...payload, ...filter });
      if (res.success && res.data) {
        const list = (res.data && res.data.length>0)?res.data.map((v,n)=>{
          v.key = n
          return v
        }):res.data
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
      } else {
        message.error(ERROR_MSG(res,url_getOrderDetails.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *exportPeopleList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { filter } = yield select(state => state.peopleOld)
      const res = yield call(url_exportGuestDetails.fn, { ...payload, ...filter });
      if (res.success && res.data) {
        window.location.href = res.data;
      } else {
        message.error(ERROR_MSG(res,url_exportGuestDetails.name))
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

