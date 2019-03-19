import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_MATCH_RULE_PARTNER } from '@utils/pathIndex';
import { url_partnerMatchRulesAdd } from '@services/system/errorM/matchRulePartner';
import { url_partTypeList, url_standardAll, url_partnerList, url_getMatchRules } from '@services/system/errorM/common';
import { url_getPartnerProductList } from '@services/enterprise/partnerOp/pms';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'addMatchPartner',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_MATCH_RULE_PARTNER}/addMatchPartner`) {
          dispatch({ type:'getAllList' })
        }
      })
    },
  },

  effects: {
    *addMatchRulePartner({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partnerMatchRulesAdd.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_partnerMatchRulesAdd.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_MATCH_RULE_PARTNER} })
      } else {
        message.error(ERROR_MSG(res,url_partnerMatchRulesAdd.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getAllList({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const [res1, res2]  = yield [
        call(url_partTypeList.fn, { ...payload }),
        call(url_getMatchRules.fn, { ...payload }),
      ]
      
      //根据配置列表参数 获取 1合作伙伴列表 2 标准错误码列表
      if(res1.success && res2.success) {
        const partsTypeDefault = res1.data.typeList[0].code
        const [res3, res4]  = yield [
          call(url_partnerList.fn, { partsType:partsTypeDefault }),
          call(url_standardAll.fn, { partsType:partsTypeDefault }),
        ]
        if (res3.success) {
          //根据partnerType获取合作伙伴产品
          yield put({ type:'getPartnerProductList', payload:{ partnerId:res3.data[0].partnerId } })
          yield put({ type:'save', payload:{ partnerList:res3.data } })
        } else {
          message.error(ERROR_MSG(res3,url_partnerList.name))
        }

        if (res4.success) {
          yield put({ type:'save', payload:{ standardErrorCodeList:res4.data } })
        } else {
          message.error(ERROR_MSG(res4,url_standardAll.name))
        }
      }

      if (res1.success) {
        yield put({ type:'save', payload:{ typeLists:res1.data } })
      } else {
        message.error(ERROR_MSG(res1,url_partTypeList.name))
      }

      if (res2.success) {
        yield put({ type:'save', payload:{ matchrule:res2.data } })
      } else {
        message.error(ERROR_MSG(res2,url_getMatchRules.name))
      }

      yield put({ type: 'setLoading', payload: false });
    },
    *getStandErrorList({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_standardAll.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ standardErrorCodeList:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_standardAll.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getPartnerList({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partnerList.fn, { ...payload })
      if (res.success) {
        //根据partnerType获取合作伙伴产品
        yield put({ type:'getPartnerProductList', payload:{ partnerId:res.data[0].partnerId } })
        yield put({ type:'save', payload:{ partnerList:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_partnerList.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    //获取合作伙伴产品列表
    *getPartnerProductList({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getPartnerProductList.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ productList:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_getPartnerProductList.name))
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

