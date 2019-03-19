import { extend } from '@utils/extend';
import { url_getDataReportSwitch } from '@services/initMenu/initMenu';
const DeviceModal = extend({
  namespace: 'initMenu',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
          console.log(11111111)
          dispatch({ type: 'getDataReportSwitch' })
      })
    },
  },

  effects: {
    *getDataReportSwitch({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getDataReportSwitch.fn, { ...payload });
      if (res.success && res.data) {
        yield put({ type:'save', payload:{ showOldDataMenu:true } })
      } else {
        yield put({ type:'save', payload:{ showOldDataMenu:false } })
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

