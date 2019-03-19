import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_MATCH_RULE } from '@utils/pathIndex';
const { SUCCESS } = RESMSG;
import { url_matchRulesUpdate, url_matchRulesInfo } from '@services/system/errorM/matchRule';
const DeviceModal = extend(PageModel, {
  namespace: 'editMatch',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_MATCH_RULE}/editMatch`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'getMatchRuleInfo', payload })
        }
      })
    },
  },

  effects: {
    *updateMatchRule({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { id } = yield select(state => state.editMatch)
      const res = yield call(url_matchRulesUpdate.fn, { ...payload, id })
      if (res.success) {
        message.success(SUCCESS(url_matchRulesUpdate.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_MATCH_RULE} })
      } else {
        message.error(ERROR_MSG(res,url_matchRulesUpdate.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getMatchRuleInfo({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_matchRulesInfo.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ data:res.data, id:payload.id } })
      } else {
        message.error(ERROR_MSG(res,url_matchRulesInfo.name))
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

