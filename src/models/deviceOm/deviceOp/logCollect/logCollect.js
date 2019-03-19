import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG, RESMSG } from '@models/common/common';
import { INDEX_DEVICE_LOGCOLLECT } from '@utils/pathIndex';
import { _jsonParse } from '@utils/tools';
import { DataDetail } from './dataDetail'
import qs from 'querystring'
import { url_setDataCollectionRate, url_getDataCollectionRate } from '@services/deviceOm/deviceOp/logCollect';
const { SUCCESS } = RESMSG
const DeviceModal = extend(PageModel,DataDetail, {
  namespace: 'logCollect',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_DEVICE_LOGCOLLECT) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'save', payload })
          dispatch({ type: 'getCollectRate', payload })
        }
      })
    },
  },

  effects: {
    *setCollectRate({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { deviceId } = yield select(state => state.logCollect)
      const res = yield call(url_setDataCollectionRate.fn, { ...payload, deviceId })
      if (res.success) {
        message.success(SUCCESS(url_setDataCollectionRate.name))
      } else {
        message.error(ERROR_MSG(res,url_setDataCollectionRate.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getCollectRate({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { deviceId } = yield select(state => state.logCollect)
      const res = yield call(url_getDataCollectionRate.fn, { deviceId:(payload && payload.deviceId) || deviceId })
      if (res.success) {
        let defaultValue = ( res.data && res.data !== 0 ) ? res.data : 5;
        yield put({ type:'save', payload:{ logCollectInfo:defaultValue } })
      } else {
        message.error(ERROR_MSG(res,url_getDataCollectionRate.name))
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

