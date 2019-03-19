import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG } from '@models/common/common';
import { INDEX_BLOC_OP } from '@utils/pathIndex'
import { url_getGroups } from '@services/enterprise/blocOp/bloc';
const DeviceModal = extend(PageModel, {
  namespace: 'blocOp',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_BLOC_OP) {
          dispatch({ type: 'queryBaseData' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.blocOp.filter))
      const res = yield call(url_getGroups.fn, { ...payload, ...filter });
      if (res.success && res.data) {
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
        message.error(ERROR_MSG(res,url_getGroups.name))
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

