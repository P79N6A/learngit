import React,{ Component } from 'react'
import { connect } from 'dva'
import { Divider, Input, TimePicker, DatePicker, message, Tabs } from 'antd'
import ConfigForm from '@components/configForm/configForm'
import styles from './globalConfig.less'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import Standard from './components/standard'
import { isNumber } from '@utils/valid'
import { INDEX_GLOBAL_CONFIG } from '@utils/pathIndex'
import moment from 'moment'
const TabPane = Tabs.TabPane
const { RangePicker } = DatePicker;
function mapStateToProps(state) {
    return { globalConfig:state.globalConfig }
}

const nightParam = { 
    name:'凌晨入住时限', 
    key:'zeroCheckInTime', 
    rules:msg => [{ required:true, message:msg }],
    item:(pName) => {
        return <TimePicker placeholder={pName}/>
    }
}

const cardParam = { 
    name:'制卡时效（分钟）', 
    key:'makeCardTimeOut', 
    rules:msg => [{ required:true, message:msg }, { validator:isNumber(8) }],
    item:(pName) => {
        return <Input placeholder={pName}/>
    }
}

function disabledDate(current) {
    return (current && current > moment().endOf('day')) || (current && current < moment().startOf('day'));
  }

const dataParam = { 
    name:'预约入住每日办理时间限制', 
    key:'data', 
    rules:msg => [{ required:true, message:'请选择当天时间段' }],
    item:() => {
        return <RangePicker showTime={ true } disabledDate ={ disabledDate } format="HH:mm:ss"/>
    }
}

@connect(mapStateToProps)
@beforeInit({ name:'globalConfig', isInitData:false })
export default class GlobalConfig extends Component {
    reset = () => {
        this.hfValueRef.reset()
        this.handleLimitRef.reset()
        this.cardLimitRef.reset()
    }

    submitHfValue = (values) => {
        const { dispatch } = this.props
        values.zeroCheckInTime = values.zeroCheckInTime.format('HH:mm:ss')
        dispatch({type:'globalConfig/action_setZeroCheckInTime',payload:values})
    }

    submitCardLimit = (values) => {
        const { dispatch } = this.props
        dispatch({type:'globalConfig/action_setMakeCardTimeout',payload:values})
    }

    submitHandleLimit = (values) => {
        const { dispatch } = this.props
        const { data } = values
        const start = data[0].format('HH:mm:ss')
        const end = data[1].format('HH:mm:ss')
        if(data[0] >= data[1]) {
            message.error('开始时间不能小于结束时间')
            return
        }

        dispatch({type:'globalConfig/action_setHandleTimeLimi',payload:{ start, end } })
    }

    onTabClick = (key) => {
        const { dispatch } = this.props
        if(key == 1) {
            this.reset()
            dispatch({ type:'globalConfig/action_getZeroCheckInTime' })
            dispatch({ type:'globalConfig/action_getMakeCardTimeout' })
            dispatch({ type:'globalConfig/action_getHandleTimeLimit' })
        } else if(key == 2) {
            dispatch({ type:'globalConfig/action_getStandardList' })
        }
    }

    onChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.globalConfig
        dispatch({
        type: `globalConfig/${type}`,
            payload: {
                ...filter,
                currentPage,
                currentSize,
            },
        })
    }

    onShowSizeChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.globalConfig
        dispatch({
        type: `globalConfig/${type}`,
            payload: {
                ...filter,
                currentPage,
                currentSize,
            },
        })
    }

    render() {
        const { globalConfig, dispatch } = this.props;
        const { zeroCheckInTime, handleLimit, makeCardTimeOut } = globalConfig;
        return (
            <div className={styles.root}>
                <h3>全局配置</h3>
                <Divider />
                <Tabs defaultActiveKey="1" onTabClick={ this.onTabClick } type="card">
                    <TabPane tab="基本信息" key="1">
                        <ConfigForm 
                            initialValue={ zeroCheckInTime?moment(zeroCheckInTime, 'HH:mm:ss'):null }
                            params = { nightParam }
                            getInstance={ ref => this.hfValueRef = ref } 
                            update={ this.submitHfValue }
                        />
                        <ConfigForm 
                            initialValue={ makeCardTimeOut }
                            params = { cardParam }
                            getInstance={ ref => this.cardLimitRef = ref } 
                            update={ this.submitCardLimit }
                        />
                        <ConfigForm 
                            initialValue={ handleLimit }
                            params = { dataParam }
                            getInstance={ ref => this.handleLimitRef = ref } 
                            update={ this.submitHandleLimit }
                        />
                    </TabPane>
                    <TabPane tab="标准特征" key="2">
                        <Standard 
                            getInstance={ ref => this.standardRef = ref }
                            globalConfig = { globalConfig }
                            getStandardById = { (id) => dispatch({ type:'globalConfig/action_getStandard', payload:{ id } }) }
                            action_addStandard = { (payload) => dispatch({ type:'globalConfig/action_addStandard', payload }) }
                            updateStandard = { (payload) => dispatch({ type:'globalConfig/action_editStandard', payload }) }
                            onChange={ this.onChange('action_getStandardList') }
                            onShowSizeChange={ this.onShowSizeChange('action_getStandardList') }
                            doCancle = { () => dispatch({ type:'globalConfig/pushRouter', payload:{ pathname:INDEX_GLOBAL_CONFIG} }) }
                        />
                    </TabPane>
                </Tabs>  
            </div>
        )
    }
}