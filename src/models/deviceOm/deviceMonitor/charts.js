import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_MONITOR } from '@utils/pathIndex';
import { url_getMonitorDetail } from '@services/deviceOm/monitor/monitor';
import qs from 'querystring'
import { _jsonParse } from '@utils/tools'
import moment from 'moment'
const DeviceModal = extend(PageModel, {
  namespace: 'charts',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === `${INDEX_DEVICE_MONITOR}/charts`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'save', payload:{ ...payload, loadingOp:true } })
          const startTime = moment().subtract(20, 'minutes').format('YYYY-MM-DD HH:mm:ss');
          const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
          dispatch({ type: 'getMonitorInfo', payload:{ ...payload, currentSize:40, startTime, endTime } })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *getMonitorInfo({ payload ={} }, { call, put, select }) {
      yield put({ type: 'save', payload: { loadingOp:true } });
      const { deviceId } = yield select(state => state.charts)
      const startTime = moment().subtract(20, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
      if(!payload.deviceId) {
        payload.deviceId = deviceId
      }
      if(!payload.startTime) {
        payload.startTime = startTime
        payload.endTime = endTime
      }
      
      const res = yield call(url_getMonitorDetail.fn, { ...payload, currentSize:40 });
      if(res.success) {
        res.data.map(v=>{
          Object.keys(v).map(key=>{
            if(key == 'timestamp') {
              v[key] = moment(v[key]).valueOf()
            }
            v[key] = parseFloat(v[key])
          })
        })
        yield put({ type: 'save', payload:{ data:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_getMonitorDetail.name))
      }
      yield put({ type: 'save', payload: { loadingOp:false } });
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

