import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { max } from '@utils/valid'
import styles from './preRegister.less';
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 12 },
    },
};
const formConfig = [
    { name:'商户id', key:'pid', rules:msg => [{ required:false, message:msg }]},
    { name:'门店id', key:'shopId', rules:msg => [{ required:false, message:msg }]},
    { name:'物料id', key:'itemId', rules:msg => [{ required:false, message:msg }, { validator:max(60) }]},
    { name:'设备供应商id', key:'supplierSn', rules:msg => [{ required:false, message:msg }, { validator:max(60) }]},
    { name:'设备sn', key:'deviceSn', rules:msg => [{ required:false, message:msg }, { validator:max(60) }]},
    { name:'设备mac', key:'mac', rules:msg => [{ required:false, message:msg }, { validator:max(60) }]},
    { name:'注册状态', key:'status', rules:msg => [{ required:false, message:msg }, { validator:max(60) }]},
]

@Form.create()
class PreRegister extends Component {
    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { data={} } = this.props
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key == 'status') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data[v.key] || ''
                        })(
                            <Input disabled={ true } placeholder={ '注册状态' } />
                        )}
                    </FormItem>
                )
            }
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:data[v.key] || ''
                    })(
                        <Input placeholder={ v.name } />
                    )}
                </FormItem>
            )
        })
    }

    render() {
        return (
            <Form className={styles.form}>
                { this.getDom() }
            </Form>
        )
    }
}

export default PreRegister
