import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_BATCH } from '@utils/pathIndex'
import { _jsonParse } from '@utils/tools'
import { url_getBatchDevices, url_batchLockOrUnlock, url_batchSendOrCancel } from '@services/deviceOm/batchOp/batch';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'batch',

  state: {
    selectedRowKeys:[],
    selectedRows:[],
    btnUse:true,
    originRows:{
      pageNo:1,
      rows:[]
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_DEVICE_BATCH) {
          dispatch({ type: 'queryBaseData' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { selectedRows, originRows } = yield select(state => state.batch)
      const res = yield call(url_getBatchDevices.fn, { ...payload });
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

        //每次翻页后把当前rows设置成原始不变rows供添加删除使用
        if(payload && payload.pageNo && payload.pageNo != originRows.pageNo) {
          console.log('存储origin');
          originRows.pageNo = payload.pageNo;
          originRows.rows = selectedRows;
          yield put({ type:'save', payload:{ originRows } })
        }
      } else {
        message.error(ERROR_MSG(res,url_getBatchDevices.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //推送设置
    *batchSendOrCancel({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_batchSendOrCancel.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(payload.status == 1?'推送':'取消推送'))
        yield put({ type: 'queryBaseData' })
        yield put({ type:'save', payload:{ btnUse:true, selectedRowKeys:[], selectedRows:[] } })
      } else {
        message.error(ERROR_MSG(res,payload.status == 1?'推送':'取消推送'))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *batchLockOrUnlock({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_batchLockOrUnlock.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(payload.status == 1?'锁定':'解锁'))
        yield put({ type: 'queryBaseData' })
        yield put({ type:'save', payload:{ btnUse:true, selectedRowKeys:[], selectedRows:[] } })
      } else {
        message.error(ERROR_MSG(res,payload.status == 1?'锁定':'解锁'))
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

