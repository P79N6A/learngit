import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import styles from './revokeFre.less';
const { TextArea } = Input;
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 14 },
    },
};
const formConfig = [
    { name:'入离店日期', key:'checkinDate', rules:msg => [{ required:false } ]},
    { name:'入离店日期', key:'checkoutDate', rules:msg => [{ required:false } ]},
    { name:'房费（元）', key:'roomFee', rules:(msg) => [{ required:false, message:msg } ]},
    { name:'杂费（元）', key:'otherFee', rules:(msg) => [{ required:false, message:msg } ]},
    { name:'总计实收（元）', key:'amount', rules:(msg) => [{ required:false, message:msg } ]},
    { name:'备注', key:'comment', rules:msg => [{ required:true, message:msg } ]},
]

@Form.create()
class RevokeFre extends Component {
    constructor(props) {
        super(props)
    }

    confirmFrom = () => {
        const { validateFields } = this.props.form;
        const { cancel, submit } = this.props
        validateFields((err, values) => {
            if (!err) {
                submit(values)
                cancel()
            }
        })
    }
    
    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { checkinDate, checkoutDate,roomFee,otherFee } = this.props;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key == 'roomFee') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:roomFee
                        })(
                            <Input disabled={ true } placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'otherFee') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:otherFee
                        })(
                            <Input disabled={true } placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'amount') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:parseFloat(roomFee)+parseFloat(otherFee)
                        })(
                            <Input disabled={ true } placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'comment') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                        })(
                            <TextArea placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'checkoutDate') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:checkoutDate
                        })(
                            <div className={ styles.dateBox }>
                                <span>{ checkinDate }</span>
                                <span>---</span>
                                <span>{ checkoutDate }</span>
                            </div>
                        )}
                    </FormItem>
                )
            } else if(v.key == 'checkinDate') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name } style={{ display:'none' }}>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:checkinDate
                        })(
                            <input type="text"/>
                        )}
                    </FormItem>
                )
            }
        })
    }

    render() {
        const { cancel } = this.props;
        return (
            <div>
                <div className={ styles.title }>
                    <h1>信用住撤销结账</h1>
                    <p>撤销立即生效，撤销成功后可重新发起结账</p>
                </div>
                <Form className={styles.form}>
                    { this.getDom() }
                </Form>
                <div className={styles.insetButton}>
                    <Button type="primary" onClick={ this.confirmFrom }>确认</Button>
                    <Button onClick={ cancel }>取消</Button>
                </div>
            </div>
        )
    }
}

export default RevokeFre
