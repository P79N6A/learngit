import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_WORKORDER_IMPLEMENT } from '@utils/pathIndex';
import { url_getImplementList } from '@services/workorder/implement';
const DeviceModal = extend(PageModel, {
  namespace: 'implement',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_WORKORDER_IMPLEMENT) {
          dispatch({ type: 'getimplementList' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *getimplementList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.implement.filter))
      let params = { ...payload, ...filter }
      if(!payload && !filter) {
        params = null
      }
      const res = yield call(url_getImplementList.fn, params);
      if (res.success && res.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: res.data.multiVOS,
            pagination: {
              total: res.data.total,
              current: res.data.currentPage,
              pageSize: res.data.currentSize || 20,
            },
          },
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: [],
          },
        })
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

