import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { url_saveConfig } from '@services/deviceOm/deviceOp/template';
import { url_getPartnerProductList } from '@services/enterprise/partnerOp/pms';
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'
const { SUCCESS } = RESMSG;
const DeviceModal = extend(CommonModel, {
  namespace: 'typeConfig',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_DEVICE_TEM_OP}/addTemp/typeConfig`) {
          //获取信息
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'save',payload })
          dispatch({ type:'getPartnerProductList', payload })
        }
      })
    },
  },

  effects: {
    *saveTemp({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_saveConfig.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_saveConfig.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_DEVICE_TEM_OP} })
      } else {
        message.error(ERROR_MSG(res,url_saveConfig.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getPartnerProductList({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getPartnerProductList.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ productList:res.data} })
      } else {
        message.error(ERROR_MSG(res,url_getPartnerProductList.name))
      }
      yield put({ type: 'setLoading', payload: false });
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

