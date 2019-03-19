import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { url_getDeviceModelConfig,url_updateConf } from '@services/deviceOm/deviceOp/device';
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_OP } from '@utils/pathIndex'
const { SUCCESS } = RESMSG;
const DeviceModal = extend(CommonModel, {
  namespace: 'paramConfig',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_DEVICE_OP}/getParam/paramConfig`) {
          //获取信息
          const payload = qs.parse(location.search.slice(1));
          //把传参保存，比对查询数据，判断需要使用数据库数据 还是 使用模板数据
          dispatch({ type: 'save', payload:{ param:payload } })
          dispatch({ type: 'queryByConfig', payload})
        }
      })
    },
  },

  effects: {
    /**
     * 获取配置列表
     * @param id,deviceType,idReaderType,cardIssuerType,cardMakerType,psbType,deviceId
     */
    *queryByConfig({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getDeviceModelConfig.fn, { ...payload })
      if (res.success) {
        yield put({ type: 'save', payload:{ data: res.data }})
      } else {
        message.error(ERROR_MSG(res,url_getDeviceModelConfig.name))
        yield put({ type: 'save', payload: { data: null } })
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //更新
    *updateConfig({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { id, deviceId } = yield select(state=>state.paramConfig.param)
      const res = yield call(url_updateConf.fn, { ...payload, id, deviceId })
      if (res.success) {
        message.success(SUCCESS(`${url_updateConf.name},配置已推送到自助机`))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_DEVICE_OP} })
      } else {
        message.error(ERROR_MSG(res,url_updateConf.name))
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

