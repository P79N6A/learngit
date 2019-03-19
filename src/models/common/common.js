import { extend } from '../../utils/extend'
import { ERROR_FORM, RESMSG, ERROR_MSG } from '@utils/resCode'
import { routerRedux } from 'dva/router';
import qs from 'querystring'
const CommonModel = {
  namespace: 'common',
  state: {
    loading: false,
  },

  effects:{
    *pushRouter({ payload }, { put }) {
      const params = qs.stringify( payload.search )
      yield put(routerRedux.push({
        pathname: payload.pathname,
        search: `?${params}`,
      }))
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    setLoading(state, { payload: status }) {
      return {
        ...state,
        loading: status,
      }
    },
    setLoadingOp(state, { payload: status }) {
      return {
        ...state,
        loadingOp: status,
      }
    },
  },
};

const PageModel = extend(CommonModel, {
  state: {
    loading: false,
    list: [],
    filter: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      total: 0,
      showTotal: total => `共 ${total}条 数据`,
      current: 1,
      pageSize: 20,
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      const { pagination } = payload
      return {
        ...state,
        ...payload,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },

})
export { CommonModel, PageModel, RESMSG, ERROR_MSG }
