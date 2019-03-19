import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { max } from '@utils/valid'
import styles from './edit.less';
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
    { name:'PMS房间号', key:'pmsRoomCode', rules:msg => [{ required:true, message:msg }, { validator:max(20) } ], disabled:true},
    { name:'酒店房间号', key:'hotelRoomCode', rules:msg => [{ required:false }, { validator:max(20) }] },
    { name:'房间位置', key:'roomLocation', rules:msg => [{ required:false }, { validator:max(20) }] },
    { name:'PSB房间号', key:'psbRoomCode', rules:msg => [{ required:false, message:msg }, { validator:max(20) }]},
    { name:'门锁房间号', key:'cardRoomCode', rules:msg => [{ required:false, message:msg }, { validator:max(20) }]},
]

@Form.create()
class EditForm extends Component {
    constructor(props) {
        super(props)
    }
    
    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:data && data[v.key]
                    })(
                        <Input placeholder={ v.name } disabled={ v.disabled?true:false } />
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

export default EditForm
