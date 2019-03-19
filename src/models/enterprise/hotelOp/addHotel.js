import { extend } from '@utils/extend';
import { message } from 'antd'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
import { HotelOption } from './common'
import { url_addHotel, url_getHotelInfoFromTop } from '@services/enterprise/hotelOp/hotel';
import { INDEX_HOTEL_OP } from '@utils/pathIndex'
import { url_getGroupNames } from '@services/enterprise/blocOp/bloc';
const { SUCCESS } = RESMSG
const DeviceModal = extend(CommonModel,HotelOption, {
  namespace: 'addHotel',

  state: {
    isDisabled:true,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_HOTEL_OP}/addHotel`) {
          dispatch({ type:'action_getProvince' })
          dispatch({ type:'action_getHotelStatus' })
          dispatch({ type:'action_getHotelSta' })
          dispatch({ type:'action_getGroupNames' })
          dispatch({ type:'save', payload:{ isDisabled:true, bottomData:null } })
        }
      })
    },
  },

  effects: {
    *action_addHotel({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true })
      const res = yield call(url_addHotel.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_addHotel.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_HOTEL_OP} })
      } else {
        message.error(ERROR_MSG(res,url_addHotel.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_getHotelInfoFromTop({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_getHotelInfoFromTop.fn, { ...payload })
      if (res.success) {
        yield put({ type: 'save', payload: { bottomData:res.data } });
      } else {
        message.error(ERROR_MSG(res,url_getHotelInfoFromTop.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    //获取集团下拉框
    *action_getGroupNames({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getGroupNames.fn, { ...payload });
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { blocNames:res.data } });
      } else {
        message.error(ERROR_MSG(res,url_getGroupNames.name))
      }
      yield put({ type: 'setLoading', payload: false });
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

