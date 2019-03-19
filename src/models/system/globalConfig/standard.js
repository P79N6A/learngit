import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getStandardList,  url_getStandard, url_addStandard, url_editStandard} from '@services/system/globalConfig/standard';
const { SUCCESS } = RESMSG
const Standard = {
    effects: {
        *action_getStandardList({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_getStandardList.fn, { ...payload });
            if (res.success && res.data) {
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
              message.error(ERROR_MSG(res,url_getStandardList.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        // *checkIsOpera({ payload }, { call, put, select }) {
        //     yield put({ type: 'setLoadingOp', payload: true });
        //     const res = yield call(checkIsOpera.fn, { ...payload });
        //     if (res.success) {
        //       yield put({ type:'save', payload:{ isOpera:res.data } })
        //     } else {
        //       yield put({ type:'save', payload:{ isOpera:false } })
        //       // message.error(ERROR_MSG(res,checkIsOpera.name))
        //     }
        //     yield put({ type: 'setLoadingOp', payload: false });
        // },
        *action_addStandard({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_addStandard.fn, { ...payload });
            if (res.success) {
                message.success(SUCCESS(url_addStandard.name))
                yield put({ type:'action_getStandardList'})
            } else {
              message.error(ERROR_MSG(res,url_addStandard.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getStandard({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_getStandard.fn, { ...payload });
            if (res.success && res.data) {
                yield put({ type:'save', payload:{ standardInfo:res.data, standardId: payload.id } })
            } else {
              message.error(ERROR_MSG(res,url_getStandard.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_editStandard({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { standardId } = yield select(state => state.globalConfig)
            const res = yield call(url_editStandard.fn, { ...payload, id:payload.id || standardId });
            if (res.success) {
                message.success((url_editStandard.name))
                yield put({ type:'action_getStandardList'})
            } else {
              message.error(ERROR_MSG(res,url_editStandard.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
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
}
export { Standard }
