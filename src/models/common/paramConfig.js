import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_setProperties, url_getProperties } from '@services/common/common';
import { changeArrtoObj } from '@utils/tools'
const { SUCCESS } = RESMSG
const ParamConfig = {
    effects: {
      *setProperties({ payload }, { call, put, select }) {
        yield put({ type: 'setLoadingOp', payload: true });
        const { fhHid } = yield select(state => state.editHotel)
        const { hotelConfigId } = yield select(state => state.editHotel.data)
        const configList = []
        const { param } = payload
        for (let key in param) {
            let value = param[key];
            configList.push({ key, value })
        }
        const res = yield call(url_setProperties.fn, { id:hotelConfigId, configList, fhHid } )
        if (res.success) {
          yield put({ type:'getProperties', payload:{ ...payload } })
          message.success(SUCCESS(url_setProperties.name))
        } else {
          message.error(ERROR_MSG(res,url_setProperties.name))
        }
        yield put({ type: 'setLoadingOp', payload: false });
      },
      *getProperties({ payload }, { call, put, select }) {
        yield put({ type: 'setLoadingOp', payload: true });
        const { fhHid } = yield select(state => state.editHotel)
        const { hotelConfigId } = yield select(state => state.editHotel.data)
        const res = yield call(url_getProperties.fn, { ...payload, id:hotelConfigId,fhHid });
        if (res.success) {
          const globalCommonConfig = changeArrtoObj(res.data.configList)



          //离店判断是否显示 点击离店配置
          // if(payload.groupType && payload.groupType == 4) {//离店
          //   if(globalCommonConfig && globalCommonConfig['alipay_checkout_switch'] == 1) {
          //     yield put({ type: 'save', payload: { checkoutBoxFlag:true } });
          //   } else {
          //     yield put({ type: 'save', payload: { checkoutBoxFlag:false } });
          //   }
          // }
          yield put({ type: 'save', payload: { globalCommonConfig } });
          if(payload.callback) payload.callback()
        } else {
          message.error(ERROR_MSG(res,url_getProperties.name))
        }
        yield put({ type: 'setLoadingOp', payload: false });
      },
    },
}
export { ParamConfig }
