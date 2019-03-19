import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Tabs, Select } from 'antd'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_HOTEL_OP } from '@utils/pathIndex'
import styles from './editHotel.less'
import { pick } from 'lodash'
import Default from './components/default'
import Param from './components/param'
import Relation from './components/relation'
import HouseType from './components/houseType'
import Adv from './components/adv'
import ChaConfig from './components/chaConfig'
import Minibar from './components/minibar'
import Function from './components/function'
import MakeCard from './components/makeCard'
import { TYPE_HOTEL, GROUP_TYPE_PARAM, GROUP_TYPE_MAKECARD, GROUP_TYPE_CHECKOUT } from '@utils/types'
const TabPane = Tabs.TabPane
const { Option } = Select;
function mapStateToProps(state) {
    return { editHotel:state.editHotel }
}
@connect(mapStateToProps)
@Form.create()
@beforeInit({ name:'editHotel' })
export default class Edit extends Component {
    getOptionStar = () => {
        const { hotelStars } = this.props.editHotel;
        if(hotelStars) {
            const hotelStar_ =  [].concat([{ code:'', description:'请选择' }],hotelStars)
            return hotelStar_.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    getOptionStatus = () => {
        const { hotelStatus } = this.props.editHotel;
        if(hotelStatus) {
            const hotelStatus_ =  [].concat([{ code:'', description:'请选择' }],hotelStatus)
            return hotelStatus_.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    getOptionGroup = () => {
        const { blocNames } = this.props.editHotel;
        if(blocNames) {
            const blocNames_ =  [].concat([ {groupId:'', groupName:'请选择'} ],blocNames)
            return blocNames_.map((v,n)=> <Option key={n} value={ v.groupId }>{ v.groupName }</Option>)
          } else {
            return []
          }
    }

    visibleChange = (flag) => {
        const { dispatch } = this.props;
        const { casOptions } = this.props.editHotel;
        if(flag && casOptions.length == 1) {
            dispatch({ type:'editHotel/action_getProvince' })
        }
    }

    onChangePcc = (v,s) => {
        s = s.map(v=>{
            return { code:v.value, descript:v.label }
        })
        const { dispatch } = this.props
        dispatch({ type:'editHotel/save', payload:{ initValuePcc:s } })
    }

    loadData = (selectedOptions) => {
        const { dispatch } = this.props
        const { loadingOp } = this.props.editHotel
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = loadingOp;
        if (selectedOptions.length == 1) {//点击省获取市
            dispatch({ type:'editHotel/action_getCity', payload:{ prv:targetOption.value, city:'T' } })
        } else if(selectedOptions.length == 2) {//点击市获取县
            const prv = selectedOptions[0].value
            const cityCode = selectedOptions[1].cityCode
            dispatch({ type:'editHotel/action_getCounty', payload:{ prv, cityCode } })
        }
    }

    update = (payload) => {
        const { dispatch } = this.props;
        dispatch({type:'editHotel/update',payload })
    }

    onTabClick = (key) => {
        const { dispatch } = this.props
        const { fhHid } = this.props.editHotel
        if(key == 1) {
            this.defaultRef && this.defaultRef.reset()
        } else if(key == 2) {
            dispatch({ type:'editHotel/getProperties', payload:{ type:TYPE_HOTEL, indexId:fhHid, groupType:GROUP_TYPE_PARAM, callback:() => {this.paramRef && this.paramRef.reset()} } })
        } else if(key == 3) {
            dispatch({ type:'editHotel/queryRelationList' })
        } else if(key == 4) {
            dispatch({ type:'editHotel/getHouseTypeList' })
        } else if(key == 5) {
            dispatch({ type:'editHotel/action_getHotelFeatures' })
        } else if(key == 6) {
            dispatch({ type:'editHotel/getMakeCardProperties', payload:{ type:TYPE_HOTEL, indexId:fhHid, groupType:GROUP_TYPE_MAKECARD } })
        } else if(key == 7) {
            this.functionRef && this.functionRef.reset()
            dispatch({ type:'editHotel/getWalkin' })
        } else if(key == 8) {
            dispatch({ type:'editHotel/action_getHotelAD' })
        } else if(key == 9) {
            dispatch({ type:'editHotel/getMinibarConfigs' })
        }
    }

    onChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.editHotel
        dispatch({
        type: `editHotel/${type}`,
            payload: {
                ...filter,
                currentPage,
                currentSize,
            },
        })
    }

    onShowSizeChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.editHotel
        dispatch({
        type: `editHotel/${type}`,
            payload: {
                ...filter,
                currentPage,
                currentSize,
            },
        })
    }
    //房号关联tab条件搜索
    onFilterSubmit = (fields) => {
        const { dispatch } = this.props;
        let submitData = {};
        Object.keys(fields).map((key) => {
            if (key === 'date' && fields[key] && fields[key].length > 0) {
            submitData = {
                ...submitData,
                startTime: fields[key][0].format('YYYY-MM-DD HH:mm:ss'),
                endTime: fields[key][1].format('YYYY-MM-DD HH:mm:ss'),
            }
            } else if((fields[key] || fields[key] === 0) && key !== 'date') {
            submitData = { ...submitData, ...pick(fields, [key]) }
            }
        });
        dispatch({ type: 'editHotel/save', payload: { filter:submitData } });
        dispatch({ type: 'editHotel/queryRelationList', payload: submitData });
    }

    setProperties = (payload) => {
        const { dispatch } = this.props
        dispatch({ type:'editHotel/setProperties', payload:{ param:payload } });
    }
    setPropertiesMakeCard = (payload) => {
        const { dispatch } = this.props
        const { fhHid } = this.props.editHotel
        dispatch({ type:'editHotel/setMakeCardProperties', payload:{ param:payload, default:{ type:TYPE_HOTEL, indexId:fhHid, groupType:GROUP_TYPE_MAKECARD }} });
    }

    setPropertiesCheckout = (payload) => {
        const { dispatch } = this.props
        const { fhHid } = this.props.editHotel
        dispatch({ type:'editHotel/setProperties', payload:{ param:payload, default:{ type:TYPE_HOTEL, indexId:fhHid, groupType:GROUP_TYPE_CHECKOUT }} });
    }

    render() {
        const { dispatch, editHotel } = this.props
        // const { isOpera } = editHotel
        return (
            <div className={styles.root}>
                <h3>编辑酒店信息</h3>
                <Divider />
                <Tabs defaultActiveKey="1" onTabClick={ this.onTabClick } type="card">
                    <TabPane tab="基本信息" key="1">
                        <Default
                            getInstance={ ref => this.defaultRef = ref }
                            editHotel = { editHotel }
                            update={ this.update }
                            onChange = { this.onChangePcc }
                            visibleChange = { this.visibleChange }
                            getOptionStar = { this.getOptionStar() }
                            getOptionStatus = { this.getOptionStatus() }
                            getOptionGroup = { this.getOptionGroup() }
                            loadData = { this.loadData }
                            dispatchSave = { payload => dispatch({ type:'editHotel/save', payload}) }
                            getFeiInfo = { payload => dispatch({ type:'editHotel/action_getHotelInfoFromTop', payload}) }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                        />
                    </TabPane>
                    <TabPane tab="参数配置" key="2">
                        <Param
                            ref={ ref => this.paramRef = ref }
                            editHotel = { editHotel }
                            setProperties ={ this.setProperties }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                            save={ (payload) => dispatch({ type:'editHotel/save', payload }) }
                        />
                    </TabPane>
                    <TabPane tab="房号关联" key="3">
                        <Relation
                            getInstance={ ref => this.relationRef = ref }
                            editHotel = { editHotel }
                            action_delHotelRoomRel = { payload => dispatch({ type:'editHotel/action_delHotelRoomRel', payload }) }
                            action_getHotelRoomRel = { (id) => dispatch({ type:'editHotel/action_getHotelRoomRel', payload:{ id } }) }
                            action_addHotelRoomRel = { (payload) => dispatch({ type:'editHotel/action_addHotelRoomRel', payload }) }
                            action_updateHotelRoomRel = { (payload) => dispatch({ type:'editHotel/action_updateHotelRoomRel', payload }) }
                            importRelation = { (payload) => dispatch({ type:'editHotel/importRelation', payload }) }
                            onChange={ this.onChange('queryRelationList') }
                            onShowSizeChange={ this.onShowSizeChange('queryRelationList') }
                            onFilterSubmit={ this.onFilterSubmit }
                            getAllHotelRelation = { () => dispatch({ type:'editHotel/queryRelationList' }) }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                        />
                    </TabPane>
                    <TabPane tab="房型管理" key="4">
                        <HouseType
                            getInstance={ ref => this.houseTypeRef = ref }
                            editHotel = { editHotel }
                            deleteHouseType = { (id) => dispatch({ type:'editHotel/deleteHouseType', payload:{ id } }) }
                            getHouseById = { (id) => dispatch({ type:'editHotel/getHouseById', payload:{ id } }) }
                            addHouseType = { (payload) => dispatch({ type:'editHotel/addHouseType', payload }) }
                            updateHouseType = { (payload) => dispatch({ type:'editHotel/updateHouseType', payload }) }
                            onChange={ this.onChange('getHouseTypeList') }
                            onShowSizeChange={ this.onShowSizeChange('getHouseTypeList') }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                            />
                    </TabPane>
                    <TabPane tab="特征配置" key="5">
                        <ChaConfig
                            getInstance={ ref => this.configChaRef = ref }
                            editHotel = { editHotel }
                            del = { (id) => dispatch({ type:'editHotel/delHotelInfo', payload:{ id } }) }
                            info = { (id) => dispatch({ type:'editHotel/getHotelInfoInfo', payload:{ id } }) }
                            add = { (payload) => dispatch({ type:'editHotel/action_addHotelFeature', payload }) }
                            all = { (payload) => dispatch({ type:'editHotel/action_getStandardAll', payload }) }
                            update = { (payload) => dispatch({ type:'editHotel/editHotelInfo', payload }) }
                            onChange={ this.onChange('action_getHotelFeatures') }
                            onShowSizeChange={ this.onShowSizeChange('action_getHotelFeatures') }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                            />
                    </TabPane>
                    <TabPane tab="制卡规则" key="6">
                        <MakeCard
                            getInstance={ ref => this.configCardRef = ref }
                            editHotel = { editHotel }
                            del = { (id) => dispatch({ type:'editHotel/action_delHotelMakeCardRule', payload:{ id } }) }
                            info = { (id) => dispatch({ type:'editHotel/action_getHotelMakeCardRule', payload:{ id } }) }
                            add = { (payload) => dispatch({ type:'editHotel/action_AddHotelMakeCardRule', payload }) }
                            update = { (payload) => dispatch({ type:'editHotel/action_updateHotelMakeCardRule', payload }) }
                            onChange={ this.onChange('action_getHotelMakeCardRules') }
                            setPropertiesMakeCard={ this.setPropertiesMakeCard }
                            getList = { () => dispatch({ type:'editHotel/action_getHotelMakeCardRules' }) }
                            onShowSizeChange={ this.onShowSizeChange('action_getHotelMakeCardRules') }
                            save={ (payload) => dispatch({ type:'editHotel/save', payload }) }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                            />
                    </TabPane>
                    <TabPane tab="功能配置" key="7">
                        <Function
                            ref={ ref => this.functionRef = ref }
                            editHotel = { editHotel }
                            getCheckOut={ (payload) => dispatch({ type:'editHotel/getCheckOut', payload }) }
                            getWalkin={ (payload) => dispatch({ type:'editHotel/getWalkin', payload }) }
                            updateCheckOut={ (payload) => dispatch({ type:'editHotel/updateCheckOut', payload }) }
                            updateWalkin={ (payload) => dispatch({ type:'editHotel/updateWalkin', payload }) }
                            save={ (payload) => dispatch({ type:'editHotel/save', payload }) }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                            />
                    </TabPane>
                    <TabPane tab="广告设置" key="8">
                        <Adv
                            getInstance={ ref => this.advRef = ref }
                            editHotel = { editHotel }
                            update = { (payload) => dispatch({ type:'editHotel/action_updateHotelAD', payload }) }
                            save={ (payload) => dispatch({ type:'editHotel/save', payload }) }
                            getAdv={ (payload) => dispatch({ type:'editHotel/action_getHotelAD', payload }) }
                            />
                    </TabPane>
                    <TabPane tab="迷你吧管理" key="9">
                        <Minibar
                            getInstance={ ref => this.configChaRef = ref }
                            editHotel = { editHotel }
                            del = { (id) => dispatch({ type:'editHotel/delMinibarConfig', payload:{ id } }) }
                            info = { (id) => dispatch({ type:'editHotel/getMinibarConfigInfo', payload:{ id } }) }
                            add = { (payload) => dispatch({ type:'editHotel/addOrUpdateMinibarConfig', payload }) }
                            getFees = { (payload) => dispatch({ type:'editHotel/getMinibarFees', payload }) }
                            update = { (payload) => dispatch({ type:'editHotel/addOrUpdateMinibarConfig', payload }) }
                            onChange={ this.onChange('getMinibarConfigs') }
                            onShowSizeChange={ this.onShowSizeChange('getMinibarConfigs') }
                            doCancle = { () => dispatch({ type:'editHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                            />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
