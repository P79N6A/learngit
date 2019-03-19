import { extend } from '@utils/extend';
import { message } from 'antd'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
import { url_addGroup } from '@services/enterprise/blocOp/bloc';
import { INDEX_BLOC_OP } from '@utils/pathIndex'
const { SUCCESS } = RESMSG
const DeviceModal = extend(CommonModel, {
  namespace: 'addBloc',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_BLOC_OP}/addBloc`) {
        }
      })
    },
  },

  effects: {
    *action_addGroup({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_addGroup.fn, { ...payload })
      if (res.success) {
        message.success(SUCCESS(url_addGroup.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_BLOC_OP} })
      } else {
        message.error(ERROR_MSG(res,url_addGroup.name))
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

