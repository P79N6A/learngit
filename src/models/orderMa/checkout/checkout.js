import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_ORDER_CHECKOUT } from '@utils/pathIndex';
import { url_getCheckoutList } from '@services/orderMa/checkout/checkout';
const DeviceModal = extend(PageModel, {
  namespace: 'checkout',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_ORDER_CHECKOUT) {
          dispatch({ type: 'getCheckoutList' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *getCheckoutList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.checkout.filter || {}))
      const res = yield call(url_getCheckoutList.fn, { ...payload, ...filter });
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
        message.error(ERROR_MSG(res,url_getCheckoutList.name))
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

