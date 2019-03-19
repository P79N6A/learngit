import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_MATCH_RULE_PARTNER } from '@utils/pathIndex';
const { SUCCESS } = RESMSG;
import { url_getPartnerMatchRules, url_partnerMatchRulesDelete, url_partnerMatchRulesUpdate } from '@services/system/errorM/matchRulePartner';
const DeviceModal = extend(PageModel, {
  namespace: 'matchRulePartner',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_MATCH_RULE_PARTNER) {
          dispatch({ type: 'queryBaseData' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.matchRulePartner.filter || {}))
      const res = yield call(url_getPartnerMatchRules.fn, { ...payload, ...filter });
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
        message.error(ERROR_MSG(res,url_getPartnerMatchRules.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //删除标准错误码
    *deleteMatchRulePartner({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partnerMatchRulesDelete.fn, { ...payload });
      if (res.success) {
        message.success(SUCCESS(url_partnerMatchRulesDelete.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_partnerMatchRulesDelete.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *updateMatchRulePartner({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { filter } = yield select(state => state.matchRulePartner)
      const res = yield call(url_partnerMatchRulesUpdate.fn, { ...payload });
      if (res.success) {
        let retMsgSuccess = SUCCESS(url_partnerMatchRulesUpdate.name)
        if(payload && payload.status == 0) {//禁用
          retMsgSuccess = '禁用成功'
        } else if(payload && payload.status == 1) {//启用
          retMsgSuccess = '启用成功'
        }
        message.success(retMsgSuccess)
        yield put({ type:'queryBaseData',payload:filter })
      } else {
        let retMsgError = ERROR_MSG(res,url_partnerMatchRulesUpdate.name)
        if(payload && payload.status == 0) {//禁用
          retMsgError = '禁用失败'
        } else if(payload && payload.status == 1) {//启用
          retMsgError = '启用失败'
        }
        message.error(retMsgError)
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

