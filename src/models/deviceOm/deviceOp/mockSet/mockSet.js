import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG,RESMSG } from '@models/common/common';
import { INDEX_DEVICE_OP } from '@utils/pathIndex';
import { url_getMockDetail, url_setMockDetail } from '@services/deviceOm/deviceOp/mockSet';
import qs from 'querystring'
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'mockSet',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === `${INDEX_DEVICE_OP}/mockSet`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'getMockDetail', payload })
          dispatch({ type: 'save', payload })
        }
      })
    },
  },

  effects: {
    *getMockDetail({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getMockDetail.fn, { ...payload });
      if (res.success) {
        yield put({ type: 'save', payload: { data:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_getMockDetail.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },

    *setMockDetail({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { deviceId } = yield select(state => state.mockSet)
      const res = yield call(url_setMockDetail.fn, { ...payload,deviceId });
      if (res.success) {
        message.success(SUCCESS(url_setMockDetail.name))
        yield put({ type: 'getMockDetail', payload: { deviceId } })
      } else {
        message.error(ERROR_MSG(res,url_setMockDetail.name))
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

