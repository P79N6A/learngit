import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getHotelRoomRels, url_getHotelRoomRel, url_addHotelRoomRel, url_updateHotelRoomRel, url_delHotelRoomRel  } from '@services/enterprise/hotelOp/relation';
const { SUCCESS } = RESMSG
const Relation = {
    effects: {
        *queryRelationList({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelRoomRels.fn, { ...payload, fhHid });
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
              message.error(ERROR_MSG(res,url_getHotelRoomRels.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_delHotelRoomRel({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            payload = payload.id == 'all'?{}:payload
            const res = yield call(url_delHotelRoomRel.fn, { ...payload,fhHid });
            if (res.success) {
                message.success(SUCCESS(url_delHotelRoomRel.name))
                yield put({ type:'queryRelationList', payload:{ fhHid } })
            } else {
              message.error(ERROR_MSG(res,url_delHotelRoomRel.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        // *deleteAllRe({ payload }, { call, put, select }) {
        //     yield put({ type: 'setLoadingOp', payload: true });
        //     const { fhHid } = yield select(state => state.editHotel)
        //     const res = yield call(deleteAllRe.fn, { fhHid });
        //     if (res.success && res.data) {
        //         message.success(SUCCESS(deleteAllRe.name))
        //         yield put({ type:'queryRelationList', payload:{ fhHid } })
        //     } else {
        //       message.error(ERROR_MSG(res,deleteAllRe.name))
        //     }
        //     yield put({ type: 'setLoadingOp', payload: false });
        // },
        *action_addHotelRoomRel({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_addHotelRoomRel.fn, { ...payload, fhHid });
            if (res.success) {
                message.success(SUCCESS(url_addHotelRoomRel.name))
                yield put({ type:'queryRelationList', payload:{ fhHid } })
            } else {
              message.error(ERROR_MSG(res,url_addHotelRoomRel.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getHotelRoomRel({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelRoomRel.fn, { ...payload, fhHid });
            if (res.success && res.data) {
                yield put({ type:'save', payload:{ relationInfo:res.data, relationId: payload.id } })
            } else {
              message.error(ERROR_MSG(res,url_getHotelRoomRel.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_updateHotelRoomRel({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { relationId, fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_updateHotelRoomRel.fn, { ...payload, id:relationId, fhHid });
            if (res.success) {
                message.success((url_updateHotelRoomRel.name))
                yield put({ type:'queryRelationList', payload:{ fhHid } })
            } else {
              message.error(ERROR_MSG(res,url_updateHotelRoomRel.name))
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
export { Relation }
