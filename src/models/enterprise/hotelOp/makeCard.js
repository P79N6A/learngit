import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { changeArrtoObj } from '@utils/tools';
import { url_getHotelMakeCardRuleType, url_setHotelMakeCardRuleType } from '@services/enterprise/hotelOp/hotel';
import { url_getHotelMakeCardRules, url_getHotelMakeCardRule, url_AddHotelMakeCardRule, url_updateHotelMakeCardRule, url_delHotelMakeCardRule } from '@services/enterprise/hotelOp/makeCard';
const { SUCCESS } = RESMSG
const MakeCard = {
    effects: {
        *action_getHotelMakeCardRules({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelMakeCardRules.fn, { ...payload, fhHid });
            if (res.success) {
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
              message.error(ERROR_MSG(res,url_getHotelMakeCardRules.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_delHotelMakeCardRule({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { makeCardId, fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_delHotelMakeCardRule.fn, { ...payload, id:payload.id || makeCardId, fhHid });
            if (res.success) {
              message.success(SUCCESS(url_delHotelMakeCardRule.name))
              yield put({ type:'action_getHotelMakeCardRules'})
            } else {
              message.error(ERROR_MSG(res,url_delHotelMakeCardRule.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_AddHotelMakeCardRule({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_AddHotelMakeCardRule.fn, { ...payload, fhHid });
            if (res.success) {
                message.success(SUCCESS(url_AddHotelMakeCardRule.name))
                yield put({ type:'action_getHotelMakeCardRules'})
            } else {
              message.error(ERROR_MSG(res,url_AddHotelMakeCardRule.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_getHotelMakeCardRule({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_getHotelMakeCardRule.fn, { ...payload, fhHid });
            if (res.success) {
                yield put({ type:'save', payload:{ makeCardInfo:{ ...res.data }, makeCardId: payload.id } })
            } else {
              message.error(ERROR_MSG(res,url_getHotelMakeCardRule.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *action_updateHotelMakeCardRule({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { makeCardId, fhHid } = yield select(state => state.editHotel)
            const res = yield call(url_updateHotelMakeCardRule.fn, { ...payload, id:payload.id || makeCardId, fhHid });
            if (res.success) {
                message.success((url_updateHotelMakeCardRule.name))
                yield put({ type:'action_getHotelMakeCardRules'})
            } else {
              message.error(ERROR_MSG(res,url_updateHotelMakeCardRule.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *setMakeCardProperties({ payload }, { call, put, select }) {
          yield put({ type: 'setLoadingOp', payload: true });
          const paramObj = []
          const { param } = payload
          for (let name in param) {
              let value = param[name];
              paramObj.push({ name, value, ...payload.default })
          }
          const { fhHid } = yield select(state => state.editHotel)
          const res = yield call(url_setHotelMakeCardRuleType.fn, { properties:paramObj, fhHid } )
          if (res.success) {
            yield put({ type:'getMakeCardProperties', payload:{ ...payload.default } })
            message.success(SUCCESS(url_setHotelMakeCardRuleType.name))
          } else {
            message.error(ERROR_MSG(res,url_setHotelMakeCardRuleType.name))
          }
          yield put({ type: 'setLoadingOp', payload: false });
        },
        *getMakeCardProperties({ payload }, { call, put, select }) {
          yield put({ type: 'setLoadingOp', payload: true });
          const { fhHid } = yield select(state => state.editHotel)
          const res = yield call(url_getHotelMakeCardRuleType.fn, { ...payload, fhHid });
          if (res.success) {
            const globalCommonConfig = changeArrtoObj(res.data)
            if(globalCommonConfig && globalCommonConfig['makecard_rule'] == 2) {
              yield put({ type: 'save', payload: { isShowDefaultRule:false, makeCardInitialValue:'2' } });
              //查询酒店制卡规则列表
              yield put({ type:'action_getHotelMakeCardRules' })
            } else {
              yield put({ type: 'save', payload: { isShowDefaultRule:true, makeCardInitialValue:'1' } });
            }
            yield put({ type: 'save', payload: { globalCommonConfig } });
          } else {
            message.error(ERROR_MSG(res,url_getHotelMakeCardRuleType.name))
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
export { MakeCard }
