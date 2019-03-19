import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG } from '@models/common/common';
import { INDEX_DEAL_QUERY } from '@utils/pathIndex';
import { _jsonParse } from '@utils/tools';
import qs from 'querystring';
import { url_findOperatorLog } from '@services/dealOm/dealQuery';
const DeviceModal = extend(PageModel, {
  namespace: 'dealDetail',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === `${INDEX_DEAL_QUERY}/dealDetail`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'queryBaseData', payload })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_findOperatorLog.fn, { ...payload });
      if (res.success && res.data) {
        const list = (res.data&&res.data.length>0)?res.data.map((v,n)=>{
          v.key = n
          return v
        }):res.data

        yield put({
          type: 'querySuccess',
          payload: {
            loading: false,
            teamList: list,
          },
        })
      } else {
        message.error(ERROR_MSG(res,url_findOperatorLog.name))
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

