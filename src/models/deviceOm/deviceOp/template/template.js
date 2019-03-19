import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'
import { url_partTypeList } from '@services/system/errorM/common';
import { url_getConfigs,url_disable,url_available } from '@services/deviceOm/deviceOp/template';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'template',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_DEVICE_TEM_OP) {
          dispatch({ type: 'queryBaseData' })
          dispatch({ type: 'getPartsType' })
        }
      })
    },
  },

  effects: {
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => state.template.filter)
      const res = yield call(url_getConfigs.fn, { ...payload, ...filter });
      if (res.success && res.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: res.data.result,
            configTypes: res.data.configTypes,
            pagination: {
              total: res.count,
              current: res.currentPage,
              pageSize: res.currentSize,
            },
          },
        })
      } else {
        yield put({ type: 'querySuccess', payload: {} })
        message.error(ERROR_MSG(res,url_getConfigs.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //禁用
    *forbid({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_disable.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_disable.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_disable.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //启用
    *available({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_available.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_available.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_available.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getPartsType({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partTypeList.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ typeLists:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_partTypeList.name))
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

