import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getHotelRoomTypes, url_getHotelRoomType, url_addHotelRoomType, url_updateHotelRoomType, url_deleteHotelRoomType, url_isOpera  } from '@services/enterprise/hotelOp/houseType';
const { SUCCESS } = RESMSG
const HouseType = {
    effects: {
        *getHouseTypeList({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelRoomTypes.fn, { ...payload, fhHid });
            if (res.success) {
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
              message.error(ERROR_MSG(res,url_getHotelRoomTypes.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *deleteHouseType({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true })
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_deleteHotelRoomType.fn, { ...payload, fhHid })
            if (res.success) {
                message.success(SUCCESS(url_deleteHotelRoomType.name))
                yield put({ type:'getHouseTypeList', payload:{ fhHid } })
            } else {
              message.error(ERROR_MSG(res,url_deleteHotelRoomType.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *checkIsOpera({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_isOpera.fn, { ...payload });
            if (res.success) {
              yield put({ type:'save', payload:{ isOpera:res.data } })
            } else {
              yield put({ type:'save', payload:{ isOpera:false } })
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *addHouseType({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_addHotelRoomType.fn, { ...payload, fhHid });
            if (res.success) {
                message.success(SUCCESS(url_addHotelRoomType.name))
                yield put({ type:'getHouseTypeList', payload:{ fhHid } })
            } else {
              message.error(ERROR_MSG(res,url_addHotelRoomType.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *getHouseById({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelRoomType.fn, { ...payload, fhHid });
            if (res.success) {
                yield put({ type:'save', payload:{ houseTypeInfo:res.data, houseTypeId: payload.id } })
            } else {
              message.error(ERROR_MSG(res,url_getHotelRoomType.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *updateHouseType({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { houseTypeId, fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_updateHotelRoomType.fn, { ...payload, id:houseTypeId, fhHid });
            if (res.success) {
                message.success((url_updateHotelRoomType.name))
                yield put({ type:'getHouseTypeList', payload:{ fhHid } })
            } else {
              message.error(ERROR_MSG(res,url_updateHotelRoomType.name))
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
export { HouseType }
