import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_MONITOR } from '@utils/pathIndex';
import { url_getMonitorList } from '@services/deviceOm/monitor/monitor';
const DeviceModal = extend(PageModel, {
  namespace: 'deviceMonitor',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_DEVICE_MONITOR) {
          dispatch({ type: 'getMonitorList' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *getMonitorList({ payload ={} }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });

      yield put({ type: 'save', payload: { currentPage:payload.currentPage, currentSize:payload.currentSize } });

      const res = yield call(url_getMonitorList.fn, { ...payload });
      const list = (res.data && res.data.length>0)?res.data.map((v,n)=>{
        v.key = n
        return v
      }):res.data

      if (res.success && res.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: list,
            pagination: {
              total: res.count,
              current: res.currentPage,
              pageSize: res.currentSize,
            },
          },
        })
      } else {
        message.error(ERROR_MSG(res,url_getMonitorList.name))
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

