import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_APPVM } from '@utils/pathIndex';
import { url_getAllApp, url_abandon, url_getAppType, url_getOssTempUrl } from '@services/deviceOm/appVM/appVM';
import { url_getPartnerProductList } from '@services/enterprise/partnerOp/pms';
const { SUCCESS } = RESMSG
const DeviceModal = extend(PageModel, {
  namespace: 'appVM',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_DEVICE_APPVM) {
          dispatch({ type: 'queryBaseData' })
          dispatch({ type: 'getDeviceTypes' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.appVM.filter || {}))
      const res = yield call(url_getAllApp.fn, { ...payload, ...filter });
      if (res.success) {
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
        message.error(ERROR_MSG(res,url_getAllApp.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *abandon({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_abandon.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_abandon.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_abandon.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    // *getDeviceTypes({ payload }, { call, put }) {
    //   yield put({ type: 'setLoadingOp', payload: true });
    //   const res = yield call(url_getAppType.fn, { ...payload })
    //   if (res.success) {
    //     yield put({ type:'save', payload:{ deviceTypes:res.data } })
    //   } else {
    //     message.error(ERROR_MSG(res,url_getAppType.name))
    //   }
    //   yield put({ type: 'setLoadingOp', payload: false });
    // },
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
        yield put({ type:'save', payload:{ deviceTypes:res.data } })
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
    *getOssTempUrl({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getOssTempUrl.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ ossUrl:res.data} })
      } else {
        message.error(ERROR_MSG(res,url_getOssTempUrl.name))
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

