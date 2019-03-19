import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_DEVICE_APPVM } from '@utils/pathIndex'
import styles from './editVersion.less'
import { isNumber } from '@utils/valid'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
function mapStateToProps(state) {
    return { editVersion:state.editVersion }
}

const formConfig = [
    { name:'通用设备类型', key:'deviceType', rules:msg => [{ required:true, message:msg }] },
    { name:'合作伙伴产品', key:'productId', rules:msg => [{ required:true, message:msg }] },
    { name:'版本名称', key:'versionName', rules:msg => [{ required:true, message:msg }] },
    { name:'版本号', key:'versionCode', rules:msg => [{ required:true, message:msg },{ validator:isNumber(20) }] },
    { name:'下载地址', key:'downloadUrl', rules:msg => [{ required:true, message:msg }] },
    { name:'oss地址', key:'ossKey', rules:msg => [{ required:true, message:msg }] },
    { name:'md5', key:'md5', rules:msg => [{ required:true, message:msg }] },
    { name:'描述', key:'description', rules:msg => [{ required:false, message:msg }] },
]
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 8 },
    },
};

@connect(mapStateToProps)
@Form.create()
@beforeInit({ name:'editVersion' })
export default class EditVersion extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props
        const { isShowPro } = this.props.editVersion
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //入参不包含合作伙伴产品id
                if(!isShowPro) {
                    values.productId = null
                }
                dispatch({type:'editVersion/update',payload:{ ...values }})
            }
        });
    }

    getDeviceTypes = () => {
        const { appTypes } = this.props.editVersion;
        if(appTypes) {
            return appTypes.map((v,n)=> <Option key={n} data-partnerType={ v.partnerType } value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    getPartnerProList = () => {
        const { productList } = this.props.editVersion;
        if(productList) {
            return productList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    //设备类型选择框
    showDeviceType = (code,v) => {
        const { dispatch } = this.props
        const { resetFields } = this.props.form
        if(v.props['data-partnerType']) {//有值，展示产品列表
            resetFields('productId')
            dispatch({ type:'editVersion/getPartnerProductList', payload:{ partnerType:v.props['data-partnerType'] } })
        } else {
            dispatch({ type:'editVersion/save', payload:{ isShowPro:false } })
        }
        
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { editVersion } = this.props;
        const { data, productList, isShowPro } = editVersion;
        return formConfig.map((v,n) => {
            const rules = v.rules(`输入${v.name}`)
            if(v.key === 'description') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data && data[v.key]
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                )
            } else if(v.key === 'deviceType') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:(data && data[v.key]) || (data.deviceTypes && data.deviceTypes[0].code)
                        })(
                            <Select onSelect={ this.showDeviceType }>
                                { this.getDeviceTypes() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key == 'productId' && isShowPro) {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data[v.key] || productList && productList[0].code
                        })(
                            <Select>
                                { this.getPartnerProList() }
                            </Select>
                        )}
                    </FormItem>
                )
            }
            
            if(v.key != 'productId') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data && data[v.key]
                        })(
                            <Input placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            }
        })
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div className={styles.root}>
                <h3>编辑app版本信息</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'editVersion/pushRouter', payload:{ pathname:INDEX_DEVICE_APPVM} }) }
                    />
                </Form>   
            </div>
        )
    }
}