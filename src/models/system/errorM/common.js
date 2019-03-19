import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG } from '@models/common/common';
import { INDEX_CODE_DEFINE, INDEX_CODE_MAP } from '@utils/pathIndex'
import { url_partTypeList } from '@services/system/errorM/common';

const pathArr = [ INDEX_CODE_DEFINE, INDEX_CODE_MAP, `${INDEX_CODE_DEFINE}/addDefine`, `${INDEX_CODE_DEFINE}/editDefine` ]
const DeviceModal = extend(PageModel, {
  namespace: 'common',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(pathArr.includes(location.pathname)) {
          dispatch({ type: 'getPartsType' })
        }
      })
    },
  },

  effects: {
    //获取配置类型
    *getPartsType({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_partTypeList.fn);
      if (res.success && res.data) {
        yield put({ type:'save', payload:{ typeLists:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_partTypeList.name))
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

