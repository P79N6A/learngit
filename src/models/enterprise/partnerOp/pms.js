import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getPmsConfig, url_saveOrUpdate } from '@services/enterprise/partnerOp/pms';
const { SUCCESS } = RESMSG
const PmsConfig = {
    effects: {
      *getByPmsCode({ payload }, { call, put, select }) {
        const { productLineId } = yield select(state => state.editPartner)
        yield put({ type: 'setLoadingOp', payload: true });
        const res = yield call(url_getPmsConfig.fn, { ...payload, partnerProductId:productLineId })
        if (res.success) {
          //把对象列表转换成对象
          const obj = {}
          res.data.map((v) => {
              obj[v.name] = v;
          })
          yield put({ type:'save', payload:{ configObj:obj } })
        } else {
          message.error(ERROR_MSG(res,url_getPmsConfig.name))
        }
        yield put({ type: 'setLoadingOp', payload: false });
      },
      *saveOrUpdate({ payload }, { call, put, select }) {
        const { productLineId, configObj } = yield select(state => state.editPartner)
        yield put({ type: 'setLoadingOp', payload: true });
        //获取key，和get中存储的对象key比对，如果有则拿取 id 拼接，如果没有则是第一次添加不需要id
        const keyName = Object.keys(payload)[0]
        if(configObj[keyName]) {
          payload.id = configObj[keyName].id
        }
        const res = yield call(url_saveOrUpdate.fn, { ...payload, partnerProductId:productLineId })
        if (res.success) {
          message.success(SUCCESS(url_saveOrUpdate.name))
          yield put({ type:'getByPmsCode' })
        } else {
          message.error(ERROR_MSG(res,url_saveOrUpdate.name))
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
export { PmsConfig }
