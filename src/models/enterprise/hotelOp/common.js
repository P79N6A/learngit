import { ERROR_MSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getCounty, url_getProvince, url_getCity, url_getHotelStatus, url_getHotelSta  } from '@services/enterprise/hotelOp/hotel';
  
const HotelOption = {
    effects: {
        *action_getProvince({ payload }, { call, put }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_getProvince.fn, { ...payload })
            if (res.success) {
                let province = res.data
                province = province && province.map(v=>{
                    return { value:v.code, label:v.descript, isLeaf: false }
                })
                yield put({ type: 'save', payload: { casOptions:province } });
            } else {
                message.error(ERROR_MSG(res,url_getProvince.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getCity({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            let { casOptions } = yield select(state => {
                const { routing:{ location:{ pathname } } } = state
                const nowNamespace = pathname.slice(pathname.lastIndexOf('/')+1)
                return state[nowNamespace]
            })
            const res = yield call(url_getCity.fn, { ...payload })
            if (res.success) {
                let city = res.data
                city = city.map(v=>{
                    return { value:v.code, label:v.descript, isLeaf: false, cityCode:v.cityCode }
                })
                casOptions.map(v=>{
                if(v.value === payload.prv) {
                    v.children = city
                }
                })
                yield put({ type: 'save', payload: { casOptions } });
            } else {
                message.error(ERROR_MSG(res,url_getCity.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getCounty({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            let { casOptions } = yield select(state => {
                const { routing:{ location:{ pathname } } } = state
                const nowNamespace = pathname.slice(pathname.lastIndexOf('/')+1)
                return state[nowNamespace]
            })
            const res = yield call(url_getCounty.fn, { cityCode:payload.cityCode })
            if (res.success) {
                let county = res.data
                county = county.map(v=>{
                    return { value:v.code, label:v.descript }
                })
                for (let i = 0; i < casOptions.length; i++) {
                const provide = casOptions[i];
                if(provide.value === payload.prv) {
                    for (let c = 0; c < provide.children.length; c++) {
                    const city = provide.children[c];
                    if(city.cityCode === payload.cityCode) {
                        city.children = county
                        break
                    }
                    }
                }
                }
                yield put({ type: 'save', payload: { casOptions } });
            } else {
                message.error(ERROR_MSG(res,url_getCounty.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getHotelStatus({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_getHotelStatus.fn, { ...payload });
            if (res.success && res.data) {
                yield put({ type: 'save', payload: { hotelStatus: res.data } });
            } else {
                message.error(ERROR_MSG(res,url_getHotelStatus.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getHotelSta({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_getHotelSta.fn, { ...payload });
            if (res.success && res.data) {
                yield put({ type: 'save', payload: { hotelStars: res.data} });
            } else {
                message.error(ERROR_MSG(res,url_getHotelSta.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        }
}
export { HotelOption }
