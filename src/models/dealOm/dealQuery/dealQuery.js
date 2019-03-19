import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEAL_QUERY } from '@utils/pathIndex';
import { _jsonParse } from '@utils/tools';
import moment from 'moment'
const { SUCCESS } = RESMSG;
import { url_getOrders, url_settleAccount, url_unfreeze, url_revokeSettleAccount, url_payOrderExport } from '@services/dealOm/dealQuery';
const DeviceModal = extend(PageModel, {
  namespace: 'dealQuery',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_DEAL_QUERY) {
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
      const filter = yield select(state => (state.dealQuery.filter || {}))
      //判断导出
      const start = payload.checkinDateStart || filter['checkinDateStart']
      const end = payload.checkinDateEnd || filter['checkinDateEnd']
      if(start && end && moment(end).diff(moment(start),'year') < 1) {
        yield put({ type:'save',payload:{ isShowExport:true } })
      } else {
        yield put({ type:'save',payload:{ isShowExport:false } })
      }
      const res = yield call(url_getOrders.fn, { ...payload, ...filter });
      if (res.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: res.data,
            pagination: {
              total: res.count,
              current: res.currentPage,
              pageSize: res.currentSize,
            },
          },
        })
      } else {
        message.error(ERROR_MSG(res,url_getOrders.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *settleAccount({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_settleAccount.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_settleAccount.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_settleAccount.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *unfreeze({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_unfreeze.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_unfreeze.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_unfreeze.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *revoke({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_revokeSettleAccount.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_revokeSettleAccount.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_revokeSettleAccount.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *exportDeal({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { filter } = yield select(state => state.dealQuery)
      const res = yield call(url_payOrderExport.fn, { ...payload, ...filter });
      if (res.success && res.data) {
        window.location.href = res.data;
      } else {
        message.error(ERROR_MSG(res,url_payOrderExport.name))
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

