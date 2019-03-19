import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_CODE_MAP } from '@utils/pathIndex';
import qs from 'querystring';
import { url_partnerErrorUpdate, url_partnerErrorInfo } from '@services/system/errorM/codeMap';
import { url_partnerList, url_partTypeList, url_standardAll, url_getMatchRules } from '@services/system/errorM/common';
import { url_getPartnerProductList } from '@services/enterprise/partnerOp/pms';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'editMap',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_CODE_MAP}/editMap`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'getAllList', payload })
        }
      })
    },
  },

  effects: {
    *upData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { id } = yield select(state => state.editMap)
      const res = yield call(url_partnerErrorUpdate.fn, { ...payload, id })
      if (res.success) {
        message.success(SUCCESS(url_partnerErrorUpdate.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_CODE_MAP} })
      } else {
        message.error(ERROR_MSG(res,url_partnerErrorUpdate.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getAllList({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      //获取info接口信息，拿取partType查询后续接口
      const resInfo = yield call(url_partnerErrorInfo.fn, { ...payload })
      if (resInfo.success) {
        yield put({ type:'save', payload:{ data:resInfo.data, id:payload.id } })
      } else {
        message.error(ERROR_MSG(resInfo,url_partnerErrorInfo.name))
      }

      const [res1, res2]  = yield [
        call(url_partTypeList.fn, { ...payload }),
        call(url_getMatchRules.fn, { ...payload }),
      ]
      
      //根据配置列表参数 获取 1合作伙伴列表 2 标准错误码列表
      if(res1.success && res2.success) {
        const partsTypeDefault = resInfo.data.partsType
        const partnerIdDefault = resInfo.data.partnerId
        const [res3, res4, resProduct]  = yield [
          call(url_partnerList.fn, { partsType:partsTypeDefault }),
          call(url_standardAll.fn, { partsType:partsTypeDefault }),
          call(url_getPartnerProductList.fn, { partnerId:partnerIdDefault }),
        ]
        if (res3.success) {
          yield put({ type:'save', payload:{ partnerList:res3.data } })
        } else {
          message.error(ERROR_MSG(res3,url_partnerList.name))
        }

        if (res4.success) {
          yield put({ type:'save', payload:{ standardErrorCodeList:res4.data } })
        } else {
          message.error(ERROR_MSG(res4,url_standardAll.name))
        }

        if (resProduct.success) {
          yield put({ type:'save', payload:{ productList:resProduct.data } })
        } else {
          message.error(ERROR_MSG(resProduct,url_getPartnerProductList.name))
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
    *getMapInfo({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_partnerErrorInfo.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ data:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_partnerErrorInfo.name))
      }
      yield put({ type: 'setLoading', payload: false });
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

