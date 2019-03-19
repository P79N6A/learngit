import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_MATCH_RULE } from '@utils/pathIndex';
const { SUCCESS } = RESMSG;
import { url_getMatchRules, url_matchRulesDelete, url_matchRulesForbind } from '@services/system/errorM/matchRule';
const DeviceModal = extend(PageModel, {
  namespace: 'matchRule',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_MATCH_RULE) {
          dispatch({ type: 'queryBaseData' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.matchRule.filter || {}))
      const res = yield call(url_getMatchRules.fn, { ...payload, ...filter });
      if (res.success && res.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: res.data,
            pagination: {
              total: res.count,
              current: res.currentPage,
              pageSize: res.currentSize,
            },
          },
        })
      } else {
        message.error(ERROR_MSG(res,url_getMatchRules.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *deleteMatchRule({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_matchRulesDelete.fn, { ...payload });
      if (res.success) {
        message.success(SUCCESS(url_matchRulesDelete.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_matchRulesDelete.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *forbindMatchRule({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_matchRulesForbind.fn, { ...payload });
      if (res.success) {
        message.success(SUCCESS(url_matchRulesForbind.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_matchRulesForbind.name))
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

