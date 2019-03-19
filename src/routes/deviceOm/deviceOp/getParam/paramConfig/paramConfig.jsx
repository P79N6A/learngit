import React,{ Component } from 'react'
import { connect } from 'dva'
import { pickBy } from 'lodash'
import { Form, Divider, Input, Alert, Row, Col, Icon, Button } from 'antd'
import BeforeInit from '@components/HOC/beforeInit/beforeInit'
import Confirm from '@components/confirm/confirm'
import { INDEX_DEVICE_OP } from '@utils/pathIndex'
import { _jsonParse } from '@utils/tools'
const FormItem = Form.Item;
import styles from './paramConfig.less'

function mapStateToProps(state) {
    return {paramConfig:state.paramConfig}
}

const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};
@connect(mapStateToProps)
@Form.create()
@BeforeInit({ name:'paramConfig' })
export default class ParamConfig extends Component {
    getTrueParams = (v) => {
        for(let name in v) {
            /**
             * 该判断主要将tem行数据组合成真正的参数
             */
            if(name.includes('tem')) {
                let temArr = name.split('_');
                const keyName = `modelId_${temArr[1]}`
                v[keyName] = v[keyName]?v[keyName]:[];
                let temTrueV = v[keyName];
                v[name].map((vAdd,n) => {
                    if(!temTrueV[n]) {
                        temTrueV[n] = {};
                    }
                    temTrueV[n][temArr[2]] = vAdd;
                })
            }
        }
    }
    handleSubmit = (e) => {
        const { dispatch, paramConfig } = this.props;
        const { data } = paramConfig
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //遍历参数重新组装需要参数
            this.getTrueParams(values);
            //重新组装提交参数
            const params = { configs:[] }
            Object.keys(data).map(v=>{
                if(values[`modelId_${data[v].modelId}`]) {
                    params.configs.push({
                        id:data[v].configId,
                        modelId:data[v].modelId,
                        partnerType:data[v].partnerType,
                        configText:JSON.stringify(values[`modelId_${data[v].modelId}`])
                    })
                }
            })
            if (err) {
                console.log('Received values of form: ', values);
            } else {
                dispatch({type:'paramConfig/updateConfig',payload:params})
            }
        });
    }

    getInputList = (obj) => {
        const { getFieldDecorator } = this.props.form;
        const arr = _jsonParse(obj.configText)
        return arr.map((v,n)=>{
            return (
                <Row key={n} gutter={16} className = {styles.addRow}>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`tem_${obj.modelId}_key[${n}]`,{
                                initialValue:v.key
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`tem_${obj.modelId}_value[${n}]`,{
                                initialValue:v.value
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                    <FormItem>
                            {getFieldDecorator(`tem_${obj.modelId}_explain[${n}]`,{
                                initialValue:v.explain
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            )
        })
    }
    
    getForm = (data) => {
        const { getFieldDecorator } = this.props.form;
        return Object.keys(data).map((v,n) => {
            return (
                <div key={n}>
                    <FormItem {...formItemLayout} label={`${data[v].partnerTypeDesc}类型`}>
                        {getFieldDecorator(v,{
                            initialValue:data[v].modelName
                        })(
                            <span>{ data[v].modelName }</span>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`${data[v].partnerTypeDesc}配置`}>
                        {this.getInputList(data[v])}
                    </FormItem>
                    <Divider />
                </div>
            )
        })
    }
    render() {
        const { dispatch, paramConfig } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { data, param } = paramConfig;
        const remind = (
            <div className={styles.remind}>
                <p>1.配置参数从左到右依次为:参数, 值, 参数说明.</p>
                <p>2.当配置参数的参数项为"参数"字样,则该项参数的值不需要填写.</p>
            </div>
        )
        return (
            <div className={styles.root}>
                <h3>修改设备配置</h3>
                <Divider />
                <Alert message={remind} type="warning" />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    <FormItem {...formItemLayout} label="设备绑定ID">
                        {getFieldDecorator('deviceId',{
                            initialValue:param.deviceId
                        })(
                            <span>{ param.deviceId }</span>
                        )}
                    </FormItem>
                    <Divider />
                    {this.getForm(data)}
                    <Confirm
                        formItemLayout = { formItemLayout }
                        disabled = { data?false:true }
                        doCancle = { () => dispatch({type:'paramConfig/pushRouter', payload:{ pathname:INDEX_DEVICE_OP } }) }
                    />
                </Form>
            </div>
        )
    }
}