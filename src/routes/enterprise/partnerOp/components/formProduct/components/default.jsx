import React, { Component } from 'react';
import { Form, Select, Button, Input } from 'antd';
import styles from './default.less';
import withRef from '@components/HOC/withRef/withRef'
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
@withRef
class EditForm extends Component {
    constructor(props) {
        super(props)
    }

    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    handleSubmit = (e) => {
        const { update, doCancel } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                doCancel()
                update(values)
            }
        });
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { productInfo, typeLists } = this.props.editPartner;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:productInfo && productInfo[v.key]
                    })(
                        <Input placeholder={ v.name } disabled={ v.disabled?true:false } />
                    )}
                </FormItem>
            )
        })
    }

    render() {
        const { doCancel } = this.props
        return (
            <Form onSubmit={this.handleSubmit} className={styles.form}>
                { this.getDom() }
                <div className={styles.btnConfirm}>
                    <Button type="primary"  htmlType="submit">
                        确定
                    </Button>
                    <Button onClick={ doCancel }>
                        取消
                    </Button>
                </div>
                {/* <Confirm
                    className={ styles.btnConfirm }
                    formItemLayout = { formItemLayout }
                    doCancle = { doCancel }
                /> */}
            </Form>
        )
    }
}

export default EditForm
