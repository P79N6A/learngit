import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG } from '@models/common/common';
import { INDEX_PARTNER_OP } from '@utils/pathIndex'
import { url_getPartners, url_partnerListType } from '@services/enterprise/partnerOp/partner';
const DeviceModal = extend(PageModel, {
  namespace: 'partnerOp',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_PARTNER_OP) {
          dispatch({ type: 'queryBaseData' })
          dispatch({ type: 'getTypeList' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { filter } = yield select(state => state.partnerOp)
      const res = yield call(url_getPartners.fn, { ...payload, ...filter });
      if (res.success && res.data) {
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
        message.error(ERROR_MSG(res,url_getPartners.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getTypeList({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partnerListType.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ typeStatusList:res.data} })
      } else {
        message.error(ERROR_MSG(res,url_partnerListType.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
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

