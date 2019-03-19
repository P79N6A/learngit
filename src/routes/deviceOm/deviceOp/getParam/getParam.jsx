import React,{ Component } from 'react'
import { connect } from 'dva'
import { camelCase } from 'lodash'
import { Form, Divider, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import BeforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_DEVICE_OP } from '@utils/pathIndex'
const FormItem = Form.Item;
import styles from './getParam.less'
function mapStateToProps(state) {
    return {getParam:state.getParam}
}
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 8 },
    }
}
@connect(mapStateToProps)
@Form.create()
@BeforeInit({ name:'getParam' })
export default class getParam extends Component {
    handleSubmit = (e) => {
        const { dispatch,getParam } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const valuesNew = {}
                Object.keys(values).map(v=>{
                    if(v.includes('_')) {
                        //转驼峰
                        const camelCaseName = `${camelCase(v)}ModelId`
                        valuesNew[camelCaseName] = values[v]
                    } else {
                        valuesNew[`${v}ModelId`] = values[v]
                    }
                })
                valuesNew.deviceId = getParam.deviceId;
                dispatch({ type: 'getParam/pushRouter',payload:{ pathname:`${INDEX_DEVICE_OP}/getParam/paramConfig`,search:{ ...valuesNew } }})
            }
        });
    }
    getSelect = (configObj) => {
        return (
            <Select>
                {
                    configObj.map(v => {
                        return <Select.Option key={v.code} value={v.code}>{v.description}</Select.Option>
                    })
                }
            </Select>
        )
    }
    getFormItem = (data) => {
        const { getFieldDecorator } = this.props.form;
        const { configTypes, deviceConfig } = data;
        return Object.keys(configTypes).map(v => {
            if(data[v]) return (
                <FormItem key={v} {...formItemLayout} label={ configTypes[v] }>
                    {getFieldDecorator(v,{
                        rules: [{ required: true}],
                        initialValue: (deviceConfig && Object.keys(deviceConfig).length>0)?deviceConfig[v]:data[v][0].code
                    })(
                        this.getSelect(data[v])
                    )}
                </FormItem>
            )
        })
    }
    doConfirm = () => {

    }

    render() {
        const { dispatch,getParam } = this.props;
        const { data } = getParam;
        return (
            <div className={styles.root}>
                <h3>请选择设备类型信息</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    {this.getFormItem(data)}
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doConfirm = { this.doConfirm }
                        doCancle = { () => dispatch({type:'getParam/pushRouter',payload:{ pathname:INDEX_DEVICE_OP }}) }
                    />
                </Form>   
            </div>
        )
    }
}