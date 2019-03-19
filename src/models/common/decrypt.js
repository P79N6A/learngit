import { url_decrypt } from '@services/common/common';
const Decrypt = {
    effects: {
        *decrypt({ payload }, { call, put }) {
            yield put({ type: 'setLoadingOp', payload: true });
            const res = yield call(url_decrypt.fn, { ...payload });
            if (res.success) {
              yield put({ type:'save', payload:{ decryptContent:res.data }})
            } else {
              yield put({ type:'save', payload:{ decryptContent:payload.ciphertext }})
            }
            yield put({ type: 'setLoadingOp', payload: false });
        },
    },
    reducers: {
      },
}
export default Decrypt
