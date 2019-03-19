import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_LOGOM_DAY } from '@utils/pathIndex';
import Decrypt from '@models/common/decrypt';
import { url_orderedQuery, url_getCheckInStep, url_getCheckInStepStatus } from '@services/logOm/dayLog/dayLog';
const DeviceModal = extend(PageModel,Decrypt, {
  namespace: 'dayLog',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_LOGOM_DAY) {
          dispatch({ type:'queryBaseData' })
          dispatch({ type:'getCheckInStep' })
          dispatch({ type:'getCheckInStepStatus' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.dayLog.filter || {}))
      const res = yield call(url_orderedQuery.fn, { ...payload, ...filter });
      if (res.success) {
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
        message.error(ERROR_MSG(res,url_orderedQuery.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getCheckInStep({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getCheckInStep.fn, { ...payload });
      if (res.success) {
        yield put({ type: 'save', payload: { checkinStep:res.data }})
      } else {
        message.error(ERROR_MSG(res,url_getCheckInStep.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getCheckInStepStatus({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getCheckInStepStatus.fn, { ...payload });
      if (res.success) {
        yield put({ type: 'save', payload: { checkinStatus:res.data }})
      } else {
        message.error(ERROR_MSG(res,url_getCheckInStepStatus.name))
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

