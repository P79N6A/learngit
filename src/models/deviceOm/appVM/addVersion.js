import { extend } from '@utils/extend';
import { message } from 'antd'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
import { url_add, url_getAppType } from '@services/deviceOm/appVM/appVM';
import { INDEX_DEVICE_APPVM } from '@utils/pathIndex';
import { url_getPartnerProductList } from '@services/enterprise/partnerOp/pms';
const { SUCCESS } = RESMSG
const DeviceModal = extend(CommonModel, {
  namespace: 'addVersion',

  state: {
    isDisabled:true,
    isShowPro:false//合作伙伴产品下拉框展示
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_DEVICE_APPVM}/addVersion`) {
          dispatch({ type:'getDeviceTypes' })
        }
      })
    },
  },

  effects: {
    *addVersion({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_add.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_add.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_DEVICE_APPVM} })
      } else {
        message.error(ERROR_MSG(res,url_add.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getDeviceTypes({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getAppType.fn, { ...payload })
      if (res.success && res.data) {
        //查询第一个设备类型是否包含合作伙伴产品，判断是否显示合作伙伴产品下拉框
        const defalutPartnerType = res.data[0].partnerType;
        if(defalutPartnerType || defalutPartnerType === 0) {
          yield put({ type:'getPartnerProductList', payload:{ partnerType:defalutPartnerType } })
        } else {
          yield put({ type:'save', payload:{ isShowPro:false} })
        }
        yield put({ type:'save', payload:{ data:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_getAppType.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getPartnerProductList({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getPartnerProductList.fn, { ...payload })
      if (res.success) {
        //有合作伙伴产品，需要放开下拉框
        yield put({ type:'save', payload:{ productList:res.data, isShowPro:true} })
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
        ...payload
      }
    },
  },
})

export default DeviceModal;

