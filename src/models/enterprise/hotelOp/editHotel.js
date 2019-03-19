import { extend } from '@utils/extend';
import { message } from 'antd'
import { _jsonParse } from '@utils/tools'
import qs from 'querystring'
import { CommonModel, RESMSG, ERROR_MSG } from '@models/common/common'
import { HotelOption } from './common'
import { Relation } from './relation'
import { HouseType } from './houseType'
import { ConfigCha } from './configCha'
import { Checkout } from './checkout'
import { Walkin } from './walkin'
import { MakeCard } from './makeCard'
import { Adv } from './adv'
import { Minibar } from './minibar'
import { ParamConfig } from '@models/common/paramConfig'
import { getDefaultPcc, getInitPcc } from '@utils/getDefaultPcc'
import { url_updateHotel, url_getHotelById, url_getProvince, url_getHotelInfoFromTop } from '@services/enterprise/hotelOp/hotel';
import { url_getGroupNames } from '@services/enterprise/blocOp/bloc';
import { INDEX_HOTEL_OP } from '@utils/pathIndex'
const { SUCCESS } = RESMSG
const EditHotelModal = extend(CommonModel,HotelOption,Relation,ParamConfig,HouseType,ConfigCha,MakeCard,Adv,Checkout,Minibar,Walkin, {
  namespace: 'editHotel',

  state: {
    isDisabled:false
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === `${INDEX_HOTEL_OP}/editHotel`) {
          const payload = qs.parse(location.search.slice(1));
          dispatch({ type:'save', payload:{ ...payload, bottomData:null,globalCommonConfig:null } })
          dispatch({ type:'action_getHotelById', payload })
          dispatch({ type:'action_getHotelStatus' })
          dispatch({ type:'action_getHotelSta'})
          dispatch({ type:'action_getGroupNames' })
          // dispatch({ type:'checkIsOpera', payload:{ fhHid:payload.fhHid } })//检测是否是opera酒店，展示房型管理
        }
      })
    },
  },

  effects: {
    *action_getHotelById({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getHotelById.fn, { ...payload })
      let pccTemp = null
      if (res.success && res.data) {
        yield put({ type:'save', payload:{ isDisabled:false } })
        res.data.pcc = (typeof res.data.pcc == 'object')?res.data.pcc:_jsonParse(res.data.pcc)
        pccTemp = res.data.pcc
        //把默认获取的pcc包括descript和code的数组存起来，直接点击编辑后当做入参
        res.data.pcc = getInitPcc(pccTemp)
        yield put({ type: 'save', payload: { data:res.data, initValuePcc:pccTemp } });
      } else {
        yield put({ type:'save', payload:{ isDisabled:true } })
        message.error(ERROR_MSG(res,url_getHotelById.name))
      }
      //获取info后根据info中的pcc拼接默认casOptions
      const resPro = yield call(url_getProvince.fn, {})
      if (resPro.success) {
        let province = resPro.data
        province = province && province.map(v=>{
            return { value:v.code, label:v.descript, isLeaf: false }
        })
        //如果info中pcc是正常默认值则更改级联框的默认数据
        const resultPcc = res.data && getDefaultPcc(pccTemp)
        if(res.success && pccTemp && resultPcc) {
          yield put({ type: 'save', payload: { casOptions:resultPcc } });
        } else {
          yield put({ type: 'save', payload: { casOptions:province } });
        }
        
      } else {
        message.error(ERROR_MSG(resPro,url_getProvince.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *update({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { fhHid } = yield select( state => state.editHotel);
      const res = yield call(url_updateHotel.fn, { fhHid, ...payload })
      if (res.success) {
        message.success(SUCCESS(url_updateHotel.name))
        yield put({ type:'pushRouter', payload:{ pathname:INDEX_HOTEL_OP} })
      } else {
        message.error(ERROR_MSG(res,url_updateHotel.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    *action_getHotelInfoFromTop({ payload }, { call, put, select }) {
      yield put({ type: 'setLoadingOp', payload: true });
      const { fhHid } = yield select( state => state.editHotel);
      const res = yield call(url_getHotelInfoFromTop.fn, { ...payload, fhHid })
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { bottomData:res.data } });
      } else {
        message.error(ERROR_MSG(res,url_getHotelInfoFromTop.name))
      }
      yield put({ type: 'setLoadingOp', payload: false });
    },
    //获取集团下拉框
    *action_getGroupNames({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(url_getGroupNames.fn, { ...payload });
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { blocNames:res.data } });
      } else {
        message.error(ERROR_MSG(res,url_getGroupNames.name))
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
  },
})

export default EditHotelModal;

