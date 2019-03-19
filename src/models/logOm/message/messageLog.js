import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_LOGOM_MESSAGE } from '@utils/pathIndex';
import { url_getMessageLogList } from '@services/logOm/message/message';
import Decrypt from '@models/common/decrypt';
const DeviceModal = extend(PageModel,Decrypt, {
  namespace: 'messageLog',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_LOGOM_MESSAGE) {
          dispatch({ type:'queryBaseData', payload:{ currentPage:1, currentSize:20 } })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.messageLog.filter || {}))
      const res = yield call(url_getMessageLogList.fn, { ...payload, ...filter });
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
              pageSize:res.currentSize,
            },
          },
        })
      } else {
        message.error(ERROR_MSG(res,url_getMessageLogList.name))
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

