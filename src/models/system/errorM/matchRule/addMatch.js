import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_MATCH_RULE } from '@utils/pathIndex';
import { url_matchRulesAdd } from '@services/system/errorM/matchRule';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'addMatch',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_MATCH_RULE}/addMatch`) {
        }
      })
    },
  },

  effects: {
    *addMatchRule({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_matchRulesAdd.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_matchRulesAdd.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_MATCH_RULE} })
      } else {
        message.error(ERROR_MSG(res,url_matchRulesAdd.name))
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

