import { extend } from '@utils/extend';
import { message } from 'antd'
import { CommonModel,ERROR_MSG } from '@models/common/common'
import { url_getConfigType } from '@services/deviceOm/deviceOp/template';
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'
const DeviceModal = extend(CommonModel, {
  namespace: 'addTemp',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_DEVICE_TEM_OP}/addTemp`) {
          //获取信息
          dispatch({ type: 'queryTempConfList'})
        }
      })
    },
  },

  effects: {
    *queryTempConfList({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getConfigType.fn)
      if (res.data) {
        yield put({ type: 'save', payload:{ data: res.data }})
      } else {
        message.error(ERROR_MSG(res,url_getConfigType.name))
        yield put({ type: 'save', payload: null })
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
  },
})

export default DeviceModal;

