import React, { Component } from 'react';
import { Form, Select, Col, Input } from 'antd';
import { max } from '@utils/valid'
import styles from './add.less';
const { Option } = Select
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
    { name:'产品名称', key:'productName', rules:msg => [{ required:true, message:msg }]},
    { name:'产品版本', key:'productVersion', rules:msg => [{ required:true, message:msg }] },
    // { name:'关联产品ID', key:'relationProductId', rules:msg => [{ required:false, message:msg }] },
]

@Form.create()
class AddForm extends Component {
    constructor(props) {
        super(props)
    }
    
    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
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

export default AddForm
