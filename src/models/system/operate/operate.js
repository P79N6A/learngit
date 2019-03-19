import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel,ERROR_MSG } from '@models/common/common';
import { INDEX_LOGOM_OPERATE } from '@utils/pathIndex';
import { url_getOperationLogList } from '@services/system/operate/operate';
const DeviceModal = extend(PageModel, {
  namespace: 'operate',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_LOGOM_OPERATE) {
          dispatch({ type:'queryBaseData' })
        }
      })
    },
  },

  effects: {
    //获取列表数据
    *queryBaseData({ payload = {} }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const { currentPage, total, currentSize, filter } = yield select(state=>state.operate)
      //后台没返回count，所以要查询两次判断是否有下一页
      const res = yield call(url_getOperationLogList.fn, { ...payload, ...filter });
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
          resNext = yield call(url_getOperationLogList.fn, { ...payloadNext, ...filter });

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
        message.error(ERROR_MSG(res,url_getOperationLogList.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  },
})

export default DeviceModal;

