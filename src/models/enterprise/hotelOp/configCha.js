import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getHotelFeatures, url_getHotelFeature, url_addHotelFeature, url_updateHotelFeature, url_delHotelFeature } from '@services/enterprise/hotelOp/configCha';
import { url_getStandardAll } from '@services/system/globalConfig/standard';
const { SUCCESS } = RESMSG
const ConfigCha = {
    effects: {
        *action_getHotelFeatures({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelFeatures.fn, { ...payload, fhHid });
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
              message.error(ERROR_MSG(res,url_getHotelFeatures.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *delHotelInfo({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { configChaId, fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_delHotelFeature.fn, { ...payload, id:payload.id || configChaId, fhHid });
            if (res.success) {
              message.success(SUCCESS(url_delHotelFeature.name))
              yield put({ type:'action_getHotelFeatures'})
            } else {
              message.error(ERROR_MSG(res,url_delHotelFeature.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_addHotelFeature({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_addHotelFeature.fn, { ...payload, fhHid });
            if (res.success) {
                message.success(SUCCESS(url_addHotelFeature.name))
                yield put({ type:'action_getHotelFeatures'})
            } else {
              message.error(ERROR_MSG(res,url_addHotelFeature.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *getHotelInfoInfo({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelFeature.fn, { ...payload, fhHid });
            const resAll = yield call(url_getStandardAll.fn, { status:1 });
            let standardAll = {}
            if (resAll.success && resAll.data) {
                standardAll = resAll.data
            } else {
              message.error(ERROR_MSG(resAll,url_getStandardAll.name))
            }

            if (res.success && res.data) {
                yield put({ type:'save', payload:{ configChaInfo:{ ...res.data, standardAll }, configChaId: payload.id } })
            } else {
              message.error(ERROR_MSG(res,url_getHotelFeature.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getStandardAll({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_getStandardAll.fn, { ...payload,status:1 });
            if (res.success) {
                yield put({ type:'save', payload:{ standardAll:res.data } })
            } else {
              message.error(ERROR_MSG(res,url_getStandardAll.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *editHotelInfo({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { configChaId, fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_updateHotelFeature.fn, { ...payload, id:payload.id || configChaId, fhHid });
            if (res.success) {
                message.success((url_updateHotelFeature.name))
                yield put({ type:'action_getHotelFeatures'})
            } else {
              message.error(ERROR_MSG(res,url_updateHotelFeature.name))
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
export { ConfigCha }
