import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { changeArrtoObj, getWalkinConfigTem, _jsonParse } from '@utils/tools'
import { url_updateWalkin, url_getWalkin } from '@services/enterprise/hotelOp/walkin';
import { url_getHotelRoomTypes } from '@services/enterprise/hotelOp/houseType';
const { SUCCESS } = RESMSG
const Walkin = {
    effects: {
        *getWalkin({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getWalkin.fn, { ...payload, fhHid });
            const resRooms = yield call(url_getHotelRoomTypes.fn, { currentPage:1, currentSize:500, fhHid });
            let configObj = {}
            if (res.success) {
              configObj = changeArrtoObj(res.data)
              if(configObj.walkinRoomType) {
                configObj.walkinRoomType = _jsonParse(configObj.walkinRoomType)
                configObj.walkinRoomType.length>0 && configObj.walkinRoomType.map(v=>{
                  v.value = v.value.split(',')
                })
              }
            } else {
              message.error(ERROR_MSG(res,url_getWalkin.name))
            }
            //获取房型列表
            if (resRooms.success) {
              configObj.roomTypeList = resRooms.data
            }
            yield put({ type: 'save', payload: { walkinConfig:configObj } })
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *updateWalkin({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            //转换obj=>map
            getWalkinConfigTem.map(v=>{
              v.value = payload[v.key]
            })
            const res = yield call(url_updateWalkin.fn, { configList:getWalkinConfigTem, fhHid });
            if (res.success) {
              message.success(SUCCESS(url_updateWalkin.name))
              yield put({ type:'getWalkin'})
            } else {
              message.error(ERROR_MSG(res,url_updateWalkin.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
    },
}
export { Walkin }
