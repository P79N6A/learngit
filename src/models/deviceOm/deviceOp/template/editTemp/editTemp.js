import { extend } from '@utils/extend';
import qs from 'querystring'
import { url_getConfig, url_saveConfig } from '@services/deviceOm/deviceOp/template';
import { message } from 'antd'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'
import { url_getPartnerProductList } from '@services/enterprise/partnerOp/pms';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(CommonModel, {
  namespace: 'editTemp',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_DEVICE_TEM_OP}/editTemp`) {
          //获取信息
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'getTemp', payload })
        }
      })
    },
  },

  effects: {
    *getTemp({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getConfig.fn, { ...payload })
      if (res.success && res.data) {
        const { partnerType } = res.data
        yield put({ type:'getPartnerProductList', payload:{ partnerType } })
        yield put({ type: 'save', payload: { data: res.data } })
      } else {
        message.error(ERROR_MSG(res,url_getConfig.name))
        yield put({ type: 'save', payload: null })
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *saveTemp({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_saveConfig.fn, { ...payload })
      if (res.success) {
        message.success('模板更新成功')
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_DEVICE_TEM_OP} })
      } else {
        message.error(ERROR_MSG(res,url_saveConfig.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
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

