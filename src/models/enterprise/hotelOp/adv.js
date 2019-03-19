import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_updateHotelAD, url_getHotelAD } from '@services/enterprise/hotelOp/adv';
const { SUCCESS } = RESMSG
const Adv = {
    effects: {
        *action_updateHotelAD({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_updateHotelAD.fn, { ...payload, fhHid });
            if (res.success) {
              message.success(SUCCESS(url_updateHotelAD.name))
              yield put({ type:'action_getHotelAD'})
            } else {
              message.error(ERROR_MSG(res,url_updateHotelAD.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getHotelAD({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelAD.fn, { ...payload, fhHid });
            if (res.success) {
              if(res.data) {
                const type = res.data.type
                if(type == 3) {//二维码
                  yield put({ type:'save', payload:{ advConfig:{ type:3, qrCode:res.data.qrCode } } })
                } else if(type == 4) {//广告
                  yield put({ type:'save', payload:{ advConfig:{ type:4, adImg:res.data.adImg } } })
                } else if(type == 6) {//节日
                  yield put({ type:'save', payload:{ advConfig:{ type: 6 } } })
                } else if(type == -1) {//空
                  yield put({ type:'save', payload:{ advConfig:{ type: -1 } } })
                }
              } else {
                yield put({ type:'save', payload:{ advConfig:{ type: -1 } } })
              }
            } else {
              message.error(ERROR_MSG(res,url_getHotelAD.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
    },
    reducers: {
      },
}
export { Adv }
