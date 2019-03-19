import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG} from '@models/common/common';
import Decrypt from '@models/common/decrypt';
import { INDEX_REPORT_BEHAVIOR } from '@utils/pathIndex';
import { url_getBehaviorList, url_exportBehaviorList } from '@services/logOm/behavior/behavior';
const DeviceModal = extend(PageModel,Decrypt, {
  namespace: 'behavior',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_REPORT_BEHAVIOR) {
          dispatch({ type: 'queryBaseData' })
          dispatch({ type:'save',payload:{ isShowExport:false } })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.behavior.filter))
      const res = yield call(url_getBehaviorList.fn, { ...payload, ...filter });
      if (res.success) {
        //开始判断是否显示导出功能按钮
        if(res.count > 500) {
          yield put({ type: 'save', payload: { isShowExport:false } });
        } else {
          yield put({ type: 'save', payload: { isShowExport:true } });
        }

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
        message.error(ERROR_MSG(res,url_getBehaviorList.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *exportBehaviorList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { filter } = yield select(state => state.behavior)
      const res = yield call(url_exportBehaviorList.fn, { ...payload, ...filter });
      if (res.success && res.data) {
        window.location.href = res.data;
      } else {
        message.error(ERROR_MSG(res,url_exportBehaviorList.name))
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

