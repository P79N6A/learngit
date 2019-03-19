import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
import { url_update, url_getAppVersionInfo, url_getAppType } from '@services/deviceOm/appVM/appVM';
import { INDEX_DEVICE_APPVM } from '@utils/pathIndex';
import { url_getPartnerProductList } from '@services/enterprise/partnerOp/pms';
const { SUCCESS } = RESMSG
const DeviceModal = extend(CommonModel, {
  namespace: 'editVersion',
  
  state: {
    isShowPro:false
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_DEVICE_APPVM}/editVersion`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'getAppVersionInfo', payload })
          dispatch({ type:'save', payload:{ id:payload.id } })
        }
      })
    },
  },

  effects: {
    *getAppVersionInfo({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getAppVersionInfo.fn, { ...payload })
      //获取设备通用类型枚举
      const resApp = yield call(url_getAppType.fn, { ...payload })
      if (res.success) {
        yield put({ type: 'save', payload: { data:res.data } });
      } else {
        message.error(ERROR_MSG(res,url_getAppVersionInfo.name))
      }
      //根据通用类型中的partnerType来判断是否调用合作伙伴产品
      if (resApp.success) {
        //查询info设备类型是否包含合作伙伴产品，判断是否显示合作伙伴产品下拉框
        let defalutPartnerType = resApp.data[0].partnerType;
        resApp.data.map(v=>{
          if(v.code == res.data.deviceType) {
            defalutPartnerType = v.partnerType
          }
        })
        if(defalutPartnerType || defalutPartnerType === 0) {
          yield put({ type:'getPartnerProductList', payload:{ partnerType:defalutPartnerType } })
        } else {
          yield put({ type:'save', payload:{ isShowPro:false} })
        }

        yield put({ type: 'save', payload: { appTypes:resApp.data } });
      } else {
        message.error(ERROR_MSG(resApp,url_getAppType.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *update({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { id } = yield select( state => state.editVersion);
      const res = yield call(url_update.fn, { id, ...payload })
      if (res.success) {
        message.success(SUCCESS(url_update.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_DEVICE_APPVM} })
      } else {
        message.error(ERROR_MSG(res,url_update.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
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

