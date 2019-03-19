import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_PSB_UPLOAD } from '@utils/pathIndex';
import { _jsonParse } from '@utils/tools';
import Decrypt from '@models/common/decrypt';
const { SUCCESS } = RESMSG;
import { url_getPSB, url_uploadPSB, url_cancelUploadPSB } from '@services/deviceOm/psbUpload/upload';
const DeviceModal = extend(PageModel,Decrypt, {
  namespace: 'psbUpload',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_PSB_UPLOAD) {
          dispatch({ type: 'queryBaseData' })
          dispatch({ type: 'save', payload:{ visible:false } })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.psbUpload.filter || {}))
      const res = yield call(url_getPSB.fn, { ...payload, ...filter });
      if (res.success && res.data) {
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
        message.error(ERROR_MSG(res,url_getPSB.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *uploadPsb({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_uploadPSB.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_uploadPSB.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_uploadPSB.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *cancelUploadPSB({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_cancelUploadPSB.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_cancelUploadPSB.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_cancelUploadPSB.name))
      }
      yield put({ type: 'setLoading', payload: false });
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

