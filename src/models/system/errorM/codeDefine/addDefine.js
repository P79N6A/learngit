import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_CODE_DEFINE } from '@utils/pathIndex';
const { SUCCESS } = RESMSG;
import { url_addStandard } from '@services/system/errorM/codeDefine';
const DeviceModal = extend(PageModel, {
  namespace: 'addDefine',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_CODE_DEFINE}/addDefine`) {
        }
      })
    },
  },

  effects: {
    *addCode({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_addStandard.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_addStandard.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_CODE_DEFINE} })
      } else {
        message.error(ERROR_MSG(res,url_addStandard.name))
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

