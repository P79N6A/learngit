import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_ORDER_WALKIN } from '@utils/pathIndex';
import { url_getWalkinList } from '@services/orderMa/walkin/walkin';
const DeviceModal = extend(PageModel, {
  namespace: 'walkin',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_ORDER_WALKIN) {
          dispatch({ type: 'getWalkinList' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *getWalkinList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.walkin.filter || {}))
      const res = yield call(url_getWalkinList.fn, { ...payload, ...filter });
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
        message.error(ERROR_MSG(res,url_getWalkinList.name))
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

