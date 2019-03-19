import React,{ Component } from 'react'
import { Form, Radio } from 'antd'
import styles from './param.less'
import withRef from '@components/HOC/withRef/withRef'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const paramConfig = [
    { name:'过零时设置', key:'midnightPlatformPermission', rules:msg => [{ required:true, message:msg }] },
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
@Form.create()
@withRef
export default class Param extends Component {
    handleSubmit_ = (e) => {
        const { update } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {//可以提交
                update(values)
            }
        });
    }

    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    doCancle_ = () => {
        const { doCancle } = this.props
        doCancle()
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form
        const { data } = this.props
        return paramConfig.map((v,n) => {
            let rules = v.rules(`请输入${v.name}`)
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:data[v.key]
                    })(
                        <RadioGroup>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
            )
        })
    }

    render() {
        return (
            <div className={styles.root}>
                {/* <Form onSubmit={this.handleSubmit_} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { this.doCancle_ }
                    />
                </Form>    */}
            </div>
        )
    }
}
