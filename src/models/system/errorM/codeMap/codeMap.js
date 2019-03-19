import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, RESMSG, ERROR_MSG } from '@models/common/common';
import { INDEX_CODE_MAP } from '@utils/pathIndex';
import { url_partnerErrorInfos, url_partnerErrorDelete } from '@services/system/errorM/codeMap';
import { url_partTypeList, url_partnerList } from '@services/system/errorM/common';
const { SUCCESS } = RESMSG;
const DeviceModal = extend(PageModel, {
  namespace: 'codeMap',

  state: {
    partnerDisable:true
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_CODE_MAP) {
          dispatch({ type: 'queryBaseData' })
          dispatch({ type: 'getPartsType' })
          dispatch({ type: 'save', payload:{ partnerDisable:true } })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const filter = yield select(state => (state.codeMap.filter || {}))
      const res = yield call(url_partnerErrorInfos.fn, { ...payload, ...filter });
      if(filter.partsType) {
        yield put({ type:'save', payload:{ partnerDisable:false } })
      } else {
        yield put({ type:'save', payload:{ partnerDisable:true } })
      }
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
        message.error(ERROR_MSG(res,url_partnerErrorInfos.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getPartsType({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_partTypeList.fn, { ...payload })
      if (res.success) {
        yield put({ type:'save', payload:{ typeLists:res.data } })
      } else {
        message.error(ERROR_MSG(res,url_partTypeList.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
     //获取合作伙伴等参数列表
    *getPartnerList({ payload }, { call, put }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partnerList.fn, { ...payload });
      if (res.success && res.data) {
        yield put({ type:'save', payload:{ partnerList:res.data, partnerDisable:false } })
      } else {
        yield put({ type:'save', payload:{ partnerDisable:true } })
        message.error(ERROR_MSG(res,url_partnerList.name))
      }
      
      yield put({ type: 'setLoadingOp', payload: false });
    },
    //删除映射错误码
    *deleteCode({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const res = yield call(url_partnerErrorDelete.fn, { ...payload });
      if (res.success) {
        message.success(SUCCESS(url_partnerErrorDelete.name))
        yield put({ type:'queryBaseData' })
      } else {
        message.error(ERROR_MSG(res,url_partnerErrorDelete.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
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

