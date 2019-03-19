import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { PageModel, ERROR_MSG } from '@models/common/common';
import { url_getHotels } from '@services/enterprise/hotelOp/hotel';
import { url_getGroupNames } from '@services/enterprise/blocOp/bloc';
import { HotelOption } from './common'
import { url_deviceInfoAdd } from '@services/enterprise/hotelOp/hotel';
import { INDEX_HOTEL_OP, INDEX_DEVICE_OP } from '@utils/pathIndex'
const DeviceModal = extend(PageModel,HotelOption, {
  namespace: 'hotel',
  
  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_HOTEL_OP) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'queryBaseData', payload })
          dispatch({ type: 'action_getHotelStatus' })
          dispatch({ type: 'action_getHotelSta' })
          dispatch({ type: 'action_getGroupNames' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => state.hotel.filter)
      const res = yield call(url_getHotels.fn, { ...payload, ...filter });
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
        message.error(ERROR_MSG(res,url_getHotels.name))
      }
      yield put({ type: 'setLoading', payload: false });
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
    *addBind({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_deviceInfoAdd.fn, { ...payload })
      if (res.success) {
        message.success('新增设备成功，前去激活')
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_DEVICE_OP} })
      } else {
        message.error(ERROR_MSG(res,url_deviceInfoAdd.name))
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

