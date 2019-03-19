import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_DEVICE_OP } from '@utils/pathIndex'
import { _jsonParse, changeArrtoObj } from '@utils/tools'
import { camelCase } from 'lodash'
import { url_updateApp, url_getDevices, url_disableDevice, url_rebindDevice, url_pushConf, url_driverType, url_versionInfo, url_updateDriver, url_getIsDebug, url_updateIsDebug, url_lockDevice, url_unlockDevice, url_FSDCSelectView, url_getSimpleDeviceModelConfig, url_addSimpleDeviceModelConfig } from '@services/deviceOm/deviceOp/device';
import { url_getAppType } from '@services/deviceOm/appVM/appVM';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'device',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_DEVICE_OP) {
          dispatch({ type: 'queryBaseData' })
          dispatch({ type: 'action_getAppType' })
          //TODO:驱动升级未确定是否在运维平台做
          // dispatch({ type: 'action_driverType' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.device.filter || {}))
      const res = yield call(url_getDevices.fn, { ...payload, ...filter });
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
        //记录每次查询参数，跳转到二级页面传参 返回使用
        yield put({ type:'save', payload:{ queryInfo:payload } })
      } else {
        message.error(ERROR_MSG(res,url_getDevices.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //禁用
    *forbid({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_disableDevice.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_disableDevice.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_disableDevice.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //再次绑定
    *action_rebindDevice({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_rebindDevice.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_rebindDevice.name))
        yield put({ type: 'queryBaseData'})
      } else {
        message.error(ERROR_MSG(res,url_rebindDevice.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //推送设置
    *action_pushConf({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_pushConf.fn, { ...payload })
      if (res.success) {
        message.success('deviceId:'+payload.deviceId+' '+SUCCESS(url_pushConf.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_pushConf.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //获取驱动类型
    *action_driverType({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_driverType.fn, { ...payload })
      if (res.success) {
        yield put({ type: 'save', payload:{ driveTypes:res.data } })
        //获取品牌版本
        yield put({ type:'action_versionInfo', payload:{ code:res.data[0] } })
      } else {
        message.error(ERROR_MSG(res,url_driverType.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //获取appyuapk
    *action_getAppType({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getAppType.fn, { ...payload })
      if (res.success) {
        yield put({ type: 'save', payload:{ deviceTypes:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_getAppType.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //获取品牌版本
    *action_versionInfo({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_versionInfo.fn, { ...payload })
      if (res.success && res.data.length > 0) {
        yield put({ type: 'save', payload:{ brandVersion:res.data, driveVersion:res.data[0].version } })
      } else {
        message.error(ERROR_MSG(res,url_versionInfo.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    //驱动升级
    *action_updateDriver({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_updateDriver.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_updateDriver.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_updateDriver.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    //app升级
    *action_updateApp({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_updateApp.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_updateApp.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_updateApp.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    //获取debug信息
    *action_getIsDebug({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getIsDebug.fn, { ...payload })
      if (res.success) {
        yield put({ type: 'save', payload:{ debugInfo:{ deviceId:payload.deviceId, debugStatus:res.data || '0' } } })
      } else {
        message.error(ERROR_MSG(res,url_getIsDebug.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    //设置debug信息
    *action_updateIsDebug({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_updateIsDebug.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_updateIsDebug.name))
      } else {
        message.error(ERROR_MSG(res,url_updateIsDebug.name))
      }
      yield put({ type: 'action_getIsDebug', payload:{ deviceId:payload.deviceId } })
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_lockDevice({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_lockDevice.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_lockDevice.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_lockDevice.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_unlockDevice({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_unlockDevice.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_unlockDevice.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_unlockDevice.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getSimpleDeviceModelConfig({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getSimpleDeviceModelConfig.fn, { ...payload })
      if (res.success) {
        const deviceRegisterInfo = changeArrtoObj(res.data)
        yield put({ type: 'save', payload:{ deviceRegisterInfo } })
      } else {
        message.error(ERROR_MSG(res,url_getSimpleDeviceModelConfig.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *addSimpleDeviceModelConfig({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_addSimpleDeviceModelConfig.fn, { ...payload })
      callback && callback()
      if (res.success) {
        message.success(SUCCESS(url_addSimpleDeviceModelConfig.name))
        yield put({ type: 'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_addSimpleDeviceModelConfig.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *paramConfig({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_FSDCSelectView.fn, { deviceId:payload.deviceId })
      if (res.data) {
        const { configTypes, deviceConfig } = res.data;
        const pathSearch = {}
        if(configTypes) {
          Object.keys(configTypes).map(v=>{
            if(res.data[v]) {
              if(v.includes('_')) {
                //转驼峰
                const camelCaseName = `${camelCase(v)}ModelId`
                pathSearch[camelCaseName] = deviceConfig[v] || res.data[v][0].code
              } else {
                pathSearch[`${v}ModelId`] = deviceConfig[v] || res.data[v][0].code
              }
            }
          })
          pathSearch.deviceId = payload.deviceId;
        }
        if(Object.keys(pathSearch).length == 0) {
          message.error('配置参数存在空值');
        } else {
          yield put({ type:'pushRouter',payload:{ pathname:'/deviceOm/deviceOp/getParam/paramConfig', search:{ ...payload,...pathSearch } }})
        }

      } else {
        message.error(ERROR_MSG(res,url_FSDCSelectView.name))
        yield put({ type: 'save', payload: null })
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

