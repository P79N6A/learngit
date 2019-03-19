import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
import { url_updatePartner, url_partnerInfo, url_partnerListType } from '@services/enterprise/partnerOp/partner';
import { INDEX_PARTNER_OP } from '@utils/pathIndex'
import { ProductConfig } from './productConfig'
import { PmsConfig } from './pms'
const { SUCCESS } = RESMSG
const DeviceModal = extend(CommonModel,ProductConfig,PmsConfig, {
  namespace: 'editPartner',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_PARTNER_OP}/editPartner`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'getPartnerInfo', payload })
        }
      })
    },
  },
  effects: {
    *getPartnerInfo({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_partnerInfo.fn, { ...payload })
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { data:res.data, id:payload.id } });
      } else {
        message.error(ERROR_MSG(res,url_partnerInfo.name))
      }

      const resList = yield call(url_partnerListType.fn, { ...payload })
      if (resList.success) {
        yield put({ type: 'save', payload: { typeStatusList:resList.data } });
      } else {
        message.error(ERROR_MSG(resList,url_partnerListType.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *updatePartner({ payload }, { call, put, select }) {
      const { id } = yield select(state => state.editPartner)
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_updatePartner.fn, { ...payload, id })
      if (res.success) {
        message.success(SUCCESS(url_updatePartner.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_PARTNER_OP} })
      } else {
        message.error(ERROR_MSG(res,url_updatePartner.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
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

