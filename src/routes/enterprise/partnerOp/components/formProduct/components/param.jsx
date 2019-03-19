import React,{ Component } from 'react'
import { Radio, Input } from 'antd'
import styles from './param.less'
import { isNumber } from '@utils/valid'
import ConfigForm from '@components/configForm/configForm'
const RadioGroup = Radio.Group;

const midNightParam = { 
    name:'是否开启过零时设置', 
    key:'midnightPlatformPermission', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return (
            <RadioGroup>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
            </RadioGroup>
        )
    } 
}

const pmsTimeParam = { 
    name:'PMS超时时间（分钟）', 
    key:'bookTimeout', 
    rules:msg => [{ required:true, message:msg },{ validator:isNumber(8) }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}

const pmsIntervalParam = { 
    name:'轮询间隔时间（分钟）', 
    key:'bookInterval', 
    rules:msg => [{ required:true, message:msg },{ validator:isNumber(8) }],
    item:(name) => {
        return (
            <Input placeholder={name}/>
        )
    } 
}
export default class Param extends Component {

    reset = () => {
        this.midnightRef.reset()
        this.pmsTimeRef.reset()
        this.pmsIntervalRef.reset()
    }

    render() {
        const { updateMidnight, editPartner, updatePmsTime } = this.props
        const { configObj = {} } = editPartner
        const midnightPlatformPermission = configObj.midnightPlatformPermission && configObj.midnightPlatformPermission.value || ''
        const bookTimeout = configObj.bookTimeout && configObj.bookTimeout.value || ''
        const bookInterval = configObj.bookInterval && configObj.bookInterval.value || ''
        return (
            <div>
                <ConfigForm 
                    colSpan1={ 14 }
                    colSpan2={ 8 }
                    initialValue={ midnightPlatformPermission || '0' }
                    params = { midNightParam }
                    getInstance={ ref => this.midnightRef = ref } 
                    update={ updateMidnight }
                />
                <ConfigForm 
                    colSpan1={ 14 }
                    colSpan2={ 8 }
                    initialValue={ bookTimeout }
                    params = { pmsTimeParam }
                    getInstance={ ref => this.pmsTimeRef = ref } 
                    update={ updatePmsTime }
                />
                <ConfigForm 
                    colSpan1={ 14 }
                    colSpan2={ 8 }
                    initialValue={ bookInterval }
                    params = { pmsIntervalParam }
                    getInstance={ ref => this.pmsIntervalRef = ref } 
                    update={ updatePmsTime }
                />
            </div>
        )
    }
}
