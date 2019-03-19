import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_CODE_DEFINE } from '@utils/pathIndex';
const { SUCCESS } = RESMSG;
import { url_updateStandard, url_getStandardInfo } from '@services/system/errorM/codeDefine';
const DeviceModal = extend(PageModel, {
  namespace: 'editDefine',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_CODE_DEFINE}/editDefine`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'getDefineInfo', payload })
        }
      })
    },
  },

  effects: {
    *updateCode({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { id } = yield select(state => state.editDefine)
      const res = yield call(url_updateStandard.fn, { ...payload, id })
      if (res.success) {
        message.success(SUCCESS(url_updateStandard.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_CODE_DEFINE} })
      } else {
        message.error(ERROR_MSG(res,url_updateStandard.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getDefineInfo({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getStandardInfo.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ data:res.data, id:payload.id } })
      } else {
        message.error(ERROR_MSG(res,url_getStandardInfo.name))
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

