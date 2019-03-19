import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { changeArrtoObj, getCheckoutConfigTem } from '@utils/tools'
import { url_updateCheckOut, url_getCheckOut } from '@services/enterprise/hotelOp/checkout';
const { SUCCESS } = RESMSG
const Checkout = {
    effects: {
        *getCheckOut({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getCheckOut.fn, { ...payload, fhHid });
            if (res.success) {
              const configObj = changeArrtoObj(res.data)
              yield put({ type: 'save', payload: { checkoutConfig:configObj } })
            } else {
              message.error(ERROR_MSG(res,url_getCheckOut.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *updateCheckOut({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            //转换obj=>map
            getCheckoutConfigTem.map(v=>{
              v.value = payload[v.key]
            })
            const res = yield call(url_updateCheckOut.fn, { configList:getCheckoutConfigTem, fhHid });
            if (res.success) {
              message.success(SUCCESS(url_updateCheckOut.name))
              yield put({ type:'getCheckOut'})
            } else {
              message.error(ERROR_MSG(res,url_updateCheckOut.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
    },
}
export { Checkout }
