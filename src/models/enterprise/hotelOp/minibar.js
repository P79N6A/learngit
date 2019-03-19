import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getMinibarConfigs, url_getMinibarConfigInfo, url_getMinibarFees, url_addOrUpdateMinibarConfig, url_delMinibarConfig } from '@services/enterprise/hotelOp/minibar';
const { SUCCESS } = RESMSG
const Minibar = {
    effects: {
        *getMinibarConfigs({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getMinibarConfigs.fn, { ...payload, fhHid });
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
              message.error(ERROR_MSG(res,url_getMinibarConfigs.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *delMinibarConfig({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { configChaId, fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_delMinibarConfig.fn, { ...payload, id:payload.id || configChaId, fhHid });
            if (res.success) {
              message.success(SUCCESS(url_delMinibarConfig.name))
              yield put({ type:'getMinibarConfigs'})
            } else {
              message.error(ERROR_MSG(res,url_delMinibarConfig.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *getMinibarConfigInfo({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getMinibarConfigInfo.fn, { ...payload, fhHid });
            const resAll = yield call(url_getMinibarFees.fn, { fhHid });
            let feesList = []
            if (resAll.success && resAll.data) {
              feesList = resAll.data
            } else {
              message.error(ERROR_MSG(resAll,url_getMinibarFees.name))
            }

            if (res.success && res.data) {
                yield put({ type:'save', payload:{ feesList, minibarInfo:res.data, minibarId: payload.id } })
            } else {
              message.error(ERROR_MSG(res,url_getMinibarConfigInfo.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *getMinibarFees({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getMinibarFees.fn, { ...payload,fhHid });
            if (res.success) {
                yield put({ type:'save', payload:{ feesList:res.data } })
            } else {
              message.error(ERROR_MSG(res,url_getMinibarFees.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *addOrUpdateMinibarConfig({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { type } = payload
            const { minibarId, fhHid } = yield select(state => state.editHotel)
            const payload_ = type == 'add'?{ ...payload, fhHid }:{ ...payload, id:payload.id || minibarId, fhHid }
            const res = yield call(url_addOrUpdateMinibarConfig.fn, payload_ );
            if (res.success) {
                message.success((type=='add'?'新增迷你吧':'修改迷你吧'))
                yield put({ type:'getMinibarConfigs'})
            } else {
              message.error(ERROR_MSG(res,url_addOrUpdateMinibarConfig.name))
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
export { Minibar }
