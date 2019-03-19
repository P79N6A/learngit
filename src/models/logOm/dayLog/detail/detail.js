import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_LOGOM_DAY } from '@utils/pathIndex';
import { filterData } from '@utils/tools';
import { url_detaiQuery } from '@services/logOm/dayLog/detail';
const DeviceModal = extend(PageModel, {
  namespace: 'detail',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === `${INDEX_LOGOM_DAY}/detail`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'save', payload })
          dispatch({ type: 'queryBaseData', payload })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { id } = yield select(state => state.detail)
      payload.id || (payload.id = id)
      const res = yield call(url_detaiQuery.fn, { ...payload });
      if (res.success) {
        const list = (res.data && res.data.length>0)?res.data.map((v,n)=>{
          v.key = n
          return v
        }):res.data
        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: list,
            pagination: {
              total: res.count,
              current: res.currentPage,
              pageSize: res.currentSize,
            },
          },
        })
      } else {
        message.error(ERROR_MSG(res,url_detaiQuery.name))
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

