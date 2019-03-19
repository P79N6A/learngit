import React, { Component } from 'react';
import { Form, TimePicker, Col, Input } from 'antd';
import { max } from '@utils/valid'
import styles from './add.less';
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
    { name:'会员等级', key:'memberLevel', rules:msg => [{ required:true, message:msg }]},
    { name:'退房时间', key:'checkoutTime', rules:msg => [{ required:true, message:msg }]},
    { name:'可开启的行政楼层', key:'floors', rules:msg => [{ required:false, message:msg }] },
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
            if(v.key == 'checkoutTime') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                        })(
                            <TimePicker className={ styles.timePicker } placeholder={ v.name }/>
                        )}
                    </FormItem>
                )
            }
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
            <div>
                <Form className={styles.form}>
                    { this.getDom() }
                </Form>
                <div className={ styles.mind }>
                    <p>*请输入具体行政楼层或楼层区间，用英文逗号隔开</p>
                    <p>例如：开启1-20楼和88楼，则输入：1-20,88</p>
                    <p>*配置为空则表示不能开启行政楼层</p>
                </div>
            </div>
        )
    }
}

export default AddForm
