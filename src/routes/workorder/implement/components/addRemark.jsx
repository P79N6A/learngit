import React, { Component } from 'react';
import { Form, Input } from 'antd';
import styles from './addRemark.less';
const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 14 },
    },
};
const formConfig = [
    { name:'备注信息', key:'remark', rules:msg => [{ required:true, message:msg }]},
]

@Form.create()
class AddRemark extends Component {
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
                        <TextArea rows={4} placeholder={ v.name } />
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

export default AddRemark
