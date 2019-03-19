import { ERROR_MSG, RESMSG } from '@utils/resCode'
import { message } from 'antd'
import { url_queryAppState } from '@services/deviceOm/deviceOp/logCollect';
import moment from 'moment'
import { pickBy } from 'lodash'
const DataDetail = {
    effects: {
        *queryAppState({ payload = {} }, { call, put, select }) {
          yield put({ type: 'setLoading', payload: true });
          const { currentPage, total, currentSize, deviceId } = yield select(state=>state.logCollect)
          //后台没返回count，所以要查询两次判断是否有下一页
          const res = yield call(url_queryAppState.fn, { ...payload, deviceId });
          if (res.success) {
            //当前页总条数
            let nowTotal = res.currentSize
            //是否是点击分页
            const isClickPageSize = currentSize && payload.currentSize && currentSize!=payload.currentSize
            //是否是点击查询
            const isSearch = !payload.currentSize && !payload.currentPage
    
            if(!payload.currentPage) {
              payload.currentPage = 1
            }
            if(isClickPageSize) {
              nowTotal = res.currentSize
            }
            const bigToNow = payload.currentPage > currentPage
    
            //查询下一页：1 输入页大于当前页 2 初始化（包括搜索框
            let resNext = null
            if(isSearch || isClickPageSize || bigToNow) {
              const payloadNext = Object.assign({},payload)
              payloadNext.currentPage++
              resNext = yield call(url_queryAppState.fn, { ...payloadNext, deviceId });
    
              //是否有下一页数据标识
              const isNext = resNext && resNext.data && resNext.data.length > 0
              //设置总条数
              if(isNext) {
                nowTotal = nowTotal*payloadNext.currentPage
              } else {
                nowTotal = nowTotal*payload.currentPage
              }
              yield put({ type:'save', payload:{ total:nowTotal, currentPage: payload['currentPage'] } })
            } else {
              nowTotal = total
            }
    
            const list = (res.data && res.data.length>0)?res.data.map((v,n)=>{
              v.key = n
              v.time = moment(v.time.toString().length<=10?v.time*1000:v.time).format('YYYY-MM-DD HH:mm:ss')
              v = pickBy(v,(v,key) => {
                if(!key.includes('_')) return true;
              })
              return v
            }):res.data
    
            yield put({
              type: 'querySuccess',
              payload: {
                loading: false,
                teamList: list,
                pagination: {
                  total: nowTotal,
                  current: res.currentPage,
                  pageSize:res.currentSize,
                },
              },
            })
            yield put({ type:'save', payload:{ currentSize: res.currentSize } })
            } else {
              message.error(ERROR_MSG(res,url_queryAppState.name))
            }
            yield put({ type: 'setLoading', payload: false });
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
export { DataDetail }
