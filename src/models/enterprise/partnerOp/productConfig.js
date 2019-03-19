import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_getPartnerProducts, url_addPartnerProduct, url_updatePartnerProduct,url_partnerProductsInfo } from '@services/enterprise/partnerOp/product';
import { url_partTypeList } from '@services/system/errorM/common';
const { SUCCESS } = RESMSG
const ProductConfig = {
    effects: {
      *getPartnerProducts({ payload }, { call, put, select }) {
          yield put({ type: 'setLoadingOp', payload: true });
          const { id } = yield select(state => state.editPartner)
          const res = yield call(url_getPartnerProducts.fn, { ...payload, partnerId:id });
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
            message.error(ERROR_MSG(res,url_getPartnerProducts.name))
          }
          yield put({ type: 'setLoadingOp', payload: false });
        },
        *partnerProductsInfo({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_partnerProductsInfo.fn, { ...payload});
            if (res.success) {
              //判断是否显示pms设置，partnerType 0 隐藏 1显示
              yield put({ type:'save', payload:{ productInfo:res.data, productLineId:payload.id }})
            } else {
              message.error(ERROR_MSG(res,url_partnerProductsInfo.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *addPartnerProduct({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { id } = yield select(state => state.editPartner)
            const res = yield call(url_addPartnerProduct.fn, { ...payload,partnerId:id });
            if (res.success) {
                message.success(SUCCESS(url_addPartnerProduct.name))
                yield put({ type:'getPartnerProducts'})
            } else {
              message.error(ERROR_MSG(res,url_addPartnerProduct.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *updatePartnerProduct({ payload }, { call, put, select }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const { productLineId, id } = yield select(state => state.editPartner)
            const res = yield call(url_updatePartnerProduct.fn, { ...payload, id:productLineId ,partnerId:id });
            if (res.success) {
                message.success(SUCCESS(url_updatePartnerProduct.name))
                yield put({ type:'getPartnerProducts'})
            } else {
              message.error(ERROR_MSG(res,url_updatePartnerProduct.name))
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
        *getPartsType({ payload }, { call, put }) {
          yield put({ type: 'setLoadingOp', payload: true });
          const res = yield call(url_partTypeList.fn, { ...payload })
          if (res.success) {
            yield put({ type:'save', payload:{ typeLists:res.data } })
          } else {
            message.error(ERROR_MSG(res,url_partTypeList.name))
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
export { ProductConfig }
