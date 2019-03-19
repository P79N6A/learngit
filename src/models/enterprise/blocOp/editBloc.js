import { extend } from '@utils/extend';
import { message } from 'antd'
import qs from 'querystring'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
const { SUCCESS } = RESMSG
import { url_updateGroup, url_getGroupById } from '@services/enterprise/blocOp/bloc';
import { INDEX_BLOC_OP } from '@utils/pathIndex'
const DeviceModal = extend(CommonModel, {
  namespace: 'editBloc',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_BLOC_OP}/editBloc`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'action_getGroupById', payload })
        }
      })
    },
  },

  effects: {
    *action_getGroupById({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getGroupById.fn, { ...payload })
      if (res.success) {
        yield put({ type: 'save', payload: { data:res.data, id:payload.id } });
      } else {
        message.error(ERROR_MSG(res,url_getGroupById.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *action_updateGroup({ payload }, { call, put, select }) {
      const { id } = yield select(state => state.editBloc)
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_updateGroup.fn, { ...payload, id })
      if (res.success) {
        message.success(SUCCESS(url_updateGroup.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_BLOC_OP} })
      } else {
        message.error(ERROR_MSG(res,url_updateGroup.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
  },
})

export default DeviceModal;

