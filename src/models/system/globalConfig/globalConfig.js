import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG, RESMSG } from '@models/common/common';
import { INDEX_GLOBAL_CONFIG } from '@utils/pathIndex';
import { _jsonParse } from '@utils/tools';
import { Standard } from './standard'
import moment from 'moment';
import { url_getZeroCheckInTime,  url_setZeroCheckInTime, url_getMakeCardTimeout, url_setMakeCardTimeout, url_getHandleTimeLimit, url_setHandleTimeLimi } from '@services/system/globalConfig/global';
const { SUCCESS } = RESMSG
const DeviceModal = extend(PageModel,Standard, {
  namespace: 'globalConfig',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_GLOBAL_CONFIG) {
          dispatch({ type:'action_getZeroCheckInTime' })
          dispatch({ type:'action_getMakeCardTimeout' })
          dispatch({ type:'action_getHandleTimeLimit' })
        }
      })
    },
  },

  effects: {
    *action_getZeroCheckInTime({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getZeroCheckInTime.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ zeroCheckInTime:res.data && res.data.hfValue } })
      } else {
        message.error(ERROR_MSG(res,url_getZeroCheckInTime.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_setZeroCheckInTime({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_setZeroCheckInTime.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_setZeroCheckInTime.name))
        yield put({ type:'action_getZeroCheckInTime' })
      } else {
        message.error(ERROR_MSG(res,url_setZeroCheckInTime.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_getMakeCardTimeout({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getMakeCardTimeout.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ makeCardTimeOut:res.data && res.data.hfValue } })
      } else {
        message.error(ERROR_MSG(res,url_getMakeCardTimeout.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_setMakeCardTimeout({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_setMakeCardTimeout.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_setMakeCardTimeout.name))
        yield put({ type:'action_getMakeCardTimeout' })
      } else {
        message.error(ERROR_MSG(res,url_setMakeCardTimeout.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_getHandleTimeLimit({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getHandleTimeLimit.fn, { ...payload })
      if (res.success) {
        const handleLimit = _jsonParse(res.data && res.data.hfValue);
        let initialValue = []
        if(handleLimit) {
          handleLimit.start = moment(handleLimit.start, 'HH:mm:ss')
          handleLimit.end = moment(handleLimit.end, 'HH:mm:ss')
          initialValue = [ handleLimit.start, handleLimit.end ]
        }
        yield put({ type:'save', payload:{ handleLimit:initialValue } })
      } else {
        message.error(ERROR_MSG(res,url_getHandleTimeLimit.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_setHandleTimeLimi({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_setHandleTimeLimi.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_setHandleTimeLimi.name))
        yield put({ type:'action_getHandleTimeLimit' })
      } else {
        message.error(ERROR_MSG(res,url_setHandleTimeLimi.name))
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

