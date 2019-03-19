import { extend } from '@utils/extend';
import qs from 'querystring';
import { message } from 'antd'
import { url_FSDCSelectView } from '@services/deviceOm/deviceOp/device';
import { CommonModel,ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_OP } from '@utils/pathIndex'
const DeviceModal = extend(CommonModel, {
  namespace: 'getParam',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_DEVICE_OP}/getParam`) {
          const params = qs.parse(location.search.slice(1));
          dispatch({ type: 'queryByDeviceId' , payload:params})
        }
      })
    },
  },

  effects: {
    *queryByDeviceId({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_FSDCSelectView.fn, { deviceId:payload.deviceId })
      if (res.data) {
        //保存id 给后续点击保存按钮接口调用
        yield put({ type: 'save', payload:{ data: res.data, ...payload }})
      } else {
        message.error(ERROR_MSG(res,url_FSDCSelectView.name))
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

