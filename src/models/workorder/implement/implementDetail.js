import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG,RESMSG } from '@models/common/common';
import { INDEX_WORKORDER_IMPLEMENT } from '@utils/pathIndex';
import qs from 'querystring'
import { url_getImplementDetail, url_getEquproducerList, url_save, url_payout, url_update, url_addRemark, url_downloadFile, url_downloadFileOld, url_deleteFileOld, url_done, url_addContact } from '@services/workorder/implement';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'implementDetail',

  state: {
    textOrderDis:false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === `${INDEX_WORKORDER_IMPLEMENT}/detail`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'getimplementDetail', payload })
          dispatch({ type: 'getEquproducerList' })
        }
      })
    },
  },

  effects: {
    *getimplementDetail({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const orderId_ = (payload && payload.orderId) || orderId
      const res = yield call(url_getImplementDetail.fn, { orderId:orderId_ });
      if (res.success) {
        //设置自助入住测试单号和预授权测试单号的输入与否
        //实施完成状态 已验收状态 已培训状态 已撤单状态---不可输入
        if([4,5,7,8].includes(res.data.orderStatus)) {
          yield put({ type: 'save',payload: { textOrderDis:true } })
        } else {
          yield put({ type: 'save',payload: { textOrderDis:false } })
        }
        yield put({ type: 'save',payload: { data:res.data, orderId:orderId_ } })
      } else {
        message.error(ERROR_MSG(res,url_getImplementDetail.name))
        yield put({ type: 'pushRouter',payload:{ pathname:INDEX_WORKORDER_IMPLEMENT }})

      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getEquproducerList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getEquproducerList.fn, { ...payload });
      if (res.success) {
        yield put({ type: 'save', payload: { equproducerList:res.data.module } })
      } else {
        message.error(ERROR_MSG(res,url_getEquproducerList.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *saveOrder({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const res = yield call(url_save.fn, { ...payload, orderId });
      if (res.success) {
        message.success(SUCCESS(url_save.name))
        yield put({ type:'getimplementDetail', payload:{ orderId } })
      } else {
        message.error(ERROR_MSG(res,url_save.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *payout({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const res = yield call(url_payout.fn, { ...payload, orderId });
      if (res.success) {
        message.success(SUCCESS(url_payout.name))
        yield put({ type:'getimplementDetail', payload:{ orderId } })
      } else {
        message.error(ERROR_MSG(res,url_payout.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *update({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const res = yield call(url_update.fn, { ...payload, orderId });
      if (res.success) {
        message.success(SUCCESS(url_update.name))
        yield put({ type:'getimplementDetail', payload:{ orderId } })
      } else {
        message.error(ERROR_MSG(res,url_update.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *addRemark({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const res = yield call(url_addRemark.fn, { ...payload, orderId });
      if (res.success) {
        message.success(SUCCESS(url_addRemark.name))
        yield put({ type:'getimplementDetail', payload:{ orderId } })
      } else {
        message.error(ERROR_MSG(res,url_addRemark.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *addContact({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const res = yield call(url_addContact.fn, { ...payload, orderId });
      if (res.success) {
        message.success(SUCCESS(url_addContact.name))
        yield put({ type:'getimplementDetail', payload:{ orderId } })
      } else {
        message.error(ERROR_MSG(res,url_addContact.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *downloadFile({ payload }, { call, put, select }) {
      const { orderId } = yield select(state => state.implementDetail)
      window.location.href = `${url_downloadFile.action}?orderId=${orderId}&fileType=${payload.fileType}&fileName=${payload.fileName}`
    },
    *downloadFileOld({ payload }, { call, put, select }) {
      const { orderId } = yield select(state => state.implementDetail)
      window.location.href = `${url_downloadFileOld.action}?orderId=${orderId}&fileType=${payload.fileType}&fileName=${payload.fileName}`
    },
    *deleteFile({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const res = yield call(url_deleteFileOld.fn, { ...payload, orderId });
      if (res.success) {
        message.success(SUCCESS(url_deleteFileOld.name))
        yield put({ type:'getimplementDetail', payload:{ orderId } })
      } else {
        message.error(ERROR_MSG(res,url_deleteFileOld.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *done({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { orderId } = yield select(state => state.implementDetail)
      const res = yield call(url_done.fn, { ...payload, orderId });
      if (res.success) {
        message.success(SUCCESS(url_done.name))
        yield put({ type: 'pushRouter',payload:{ pathname:INDEX_WORKORDER_IMPLEMENT }})
      } else {
        message.error(ERROR_MSG(res,url_done.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *effectSave({ payload, resolve, reject }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      try {
        yield put({ type: 'save', payload });
        const { implementDetail } = yield select(state => state)
        resolve(implementDetail);
      }
      catch (error) {
        reject('error');
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