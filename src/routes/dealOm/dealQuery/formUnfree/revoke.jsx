import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import styles from './revoke.less';
const { TextArea } = Input;
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
    { name:'冻结金额', key:'freezeAmount', rules:msg => [{ required:false, message:msg } ]},
    { name:'结算金额', key:'amount', rules:msg => [{ required:false, message:msg } ]},
    { name:'备注', key:'comment', rules:msg => [{ required:true, message:msg } ]},
]

@Form.create()
class Revoke extends Component {
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
        const { freezeAmount, tradeAmount } = this.props;
        const { getFieldDecorator } = this.props.form;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key == 'freezeAmount') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:freezeAmount
                        })(
                            <span>{ freezeAmount }</span>
                        )}
                    </FormItem>
                )
            } else if(v.key == 'amount') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:tradeAmount
                        })(
                            <span>{ tradeAmount }</span>
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
            }
        })
    }

    render() {
        const { cancel } = this.props;
        return (
            <div>
                <div className={ styles.title }>
                    <h1>预授权撤销</h1>
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

export default Revoke
