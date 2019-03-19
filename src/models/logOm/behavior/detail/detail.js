import { extend } from '@utils/extend';
import { message } from 'antd'
import { PageModel, ERROR_MSG} from '@models/common/common';
import { INDEX_REPORT_BEHAVIOR_DETAIL } from '@utils/pathIndex';
import qs from 'querystring'
import { url_getTriceIdList, url_getTriceIdDetail } from '@services/logOm/behavior/behavior';
const DeviceModal = extend(PageModel, {
  namespace: 'detailBehavior',

  state: {
    triceIdList:[],//triceid列表
    triceIdDetail:[],//triceid详情列表
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === INDEX_REPORT_BEHAVIOR_DETAIL) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type: 'queryBaseData', payload:{ checkinOrderId:payload.id } })
        }
      })
    },
  },

  effects: {
    *queryBaseData({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getTriceIdList.fn, { ...payload });
      if (res.success) {
        const detailArr = res.data;
        //设置第一条详情列表
        if(detailArr.length>0) {
          const infoList = yield call(url_getTriceIdDetail.fn, { traceId: detailArr[0].traceId });
          if (infoList.success && infoList.data) {
            //遍历trice数组 设置第一条数据的show为打开状态，并且设置第一条数据的infoList
            detailArr[0].show = true;
            detailArr[0].infoList = {};
            detailArr[0].infoList.rows = infoList.data;
            detailArr[0].infoList.currentPage = 1;
            yield put({ type: 'save', payload: { nowId:detailArr[0].traceId } })
          } else {
            message.error(ERROR_MSG(infoList,url_getTriceIdDetail.name))
          }
        }

        yield put({ type: 'save', payload: { triceIdList:detailArr } })

      } else {
        message.error(ERROR_MSG(res,url_getTriceIdList.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getTriceIdDetail({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { triceIdList } = yield select(state => state.detailBehavior)
      //判断detailList中是否有info，如果已经存在则开启和打开，如果不存在则请求接口并且打开
      for (const obj of triceIdList) {
        if(obj.traceId == payload.traceId) {//操作本条list
          if( !obj.infoList ) {//本detailList中不存在本条list的info，请求接口设置新的
            const res = yield call(url_getTriceIdDetail.fn, { ...payload });
            if (res.success && res.data) {
              obj.infoList = {};
              obj.infoList.rows = res.data;
              obj.infoList.currentPage = 1;
            } else {
              message.error(ERROR_MSG(res,url_getTriceIdDetail.name))
            }
          }
          obj.show = payload.openFlag;
        } else {//其他list收起
          obj.show = false;
        }
      }
      yield put({ type: 'save', payload: { triceIdList, nowId:payload.traceId } })
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *getTriceIdDetailMore({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { triceIdList } = yield select(state => state.detailBehavior)
      const res = yield call(url_getTriceIdDetail.fn, { ...payload });
      if (res.success && res.data) {
        //给对应的triceid条目 设定show和infoList--当前查询的数据
        for (const obj of triceIdList) {
          if(obj.traceId == payload.traceId && res.data && res.data.length>0) {
            obj.infoList.rows = [ ...obj.infoList.rows, ...res.data ];
            obj.infoList.currentPage = payload.currentPage ;
          } else if(obj.traceId == payload.traceId && res.data && res.data.length==0) {
            message.warning('暂无更多数据');
          }
        }
        yield put({ type: 'save', payload: { triceIdList, nowId:payload.traceId } })
      } else {
        message.error(ERROR_MSG(res,url_getTriceIdDetail.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
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

