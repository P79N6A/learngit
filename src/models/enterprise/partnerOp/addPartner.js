import { extend } from '@utils/extend';
import { message } from 'antd'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
import { url_addPartner, url_partnerListType } from '@services/enterprise/partnerOp/partner';
import { INDEX_PARTNER_OP } from '@utils/pathIndex'
const { SUCCESS } = RESMSG
const DeviceModal = extend(CommonModel, {
  namespace: 'addPartner',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_PARTNER_OP}/addPartner`) {
          dispatch({ type:'getTypeList' })
          dispatch({ type:'save', payload:{ showPmsCode:false } })
        }
      })
    },
  },

  effects: {
    *addPartner({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_addPartner.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_addPartner.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_PARTNER_OP} })
      } else {
        message.error(ERROR_MSG(res,url_addPartner.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getTypeList({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partnerListType.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ typeStatusList:res.data} })
      } else {
        message.error(ERROR_MSG(res,url_partnerListType.name))
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

