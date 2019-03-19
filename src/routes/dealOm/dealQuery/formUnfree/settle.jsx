import React, { Component } from 'react';
import { Form, Input, DatePicker, Button } from 'antd';
import styles from './settle.less';
import { isMoney } from '@utils/valid'
const { TextArea } = Input;
const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 16 },
    },
};
const formConfig = [
    { name:'入离店日期', key:'checkoutDate', rules:msg => [{ required:true, message:'离店日期' } ]},
    { name:'冻结金额', key:'freezeAmount', rules:msg => [{ required:false, message:msg } ]},
    { name:'结算金额', key:'amount', rules:(msg,min,max) => [{ required:true, message:msg }, { validator:isMoney(min,max) } ]},
    { name:'备注', key:'comment', rules:msg => [{ required:true, message:msg } ]},
]

@Form.create()
class Settle extends Component {
    constructor(props) {
        super(props)
        this.state={
            checkoutDate:null
        }
    }

    confirmFrom = (flag) => {
        const { validateFields } = this.props.form;
        const { save, cancel, submit } = this.props
        validateFields((err, values) => {
            if (!err) {
                if(flag) {//提交
                    values.checkoutDate = values.checkoutDate.format('YYYY-MM-DD')
                    submit(values)
                    cancel()
                } else {//下一步
                    save({ stepSettle:1 })
                }
            }
        })
    }

    reset = () => {
        this.setState({
            checkoutDate:null
        })
        const { form } = this.props;
        const { resetFields } = form
        resetFields()
    }

    setEndDate = (moment) => {
        const { setFieldsValue } = this.props.form;
        this.setState({
            checkoutDate:moment
        })
        setFieldsValue({
            checkoutDate:moment
        })
    }

    preStep = () => {
        const { save } = this.props
        save({ stepSettle:null })
    }
    
    getDom = () => {
        const { stepSettle } = this.props.dealQuery;
        const { freezeAmount } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { checkinDate } = this.props;
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
                            rules:v.rules(`${v.name}`,0,freezeAmount)
                        })(
                            <Input placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'comment') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                        })(
                            <TextArea disabled={ stepSettle?true:false } placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'checkoutDate') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                        })(
                            <div className={ styles.dateBox }>
                                <span>{ checkinDate }</span>
                                <span>---</span>
                                <DatePicker disabled={ stepSettle?true:false } placeholder={ v.name } value={ this.state.checkoutDate } onChange={ this.setEndDate } />
                            </div>
                        )}
                    </FormItem>
                )
            }
        })
    }

    render() {
        const { stepSettle } = this.props.dealQuery;
        const { cancel } = this.props;
        return (
            <div>
                {
                    !stepSettle?
                    <div className={ styles.title }>
                        <h1>请输入结算金额</h1>
                        <p>结算金额必须&ge;0且&le;冻结金额</p>
                    </div>:
                    <div className={ styles.title }>
                        <h1>请确认结算金额</h1>
                        <p>两小时后生效，两小时内支持撤销</p>
                    </div>
                }
                    <Form className={styles.form}>
                        { this.getDom() }
                    </Form>
                {
                    !stepSettle?
                    <div className={styles.insetButton}>
                        <Button type="primary" onClick={ this.confirmFrom.bind(this,false) }>下一步</Button>
                        <Button onClick={ cancel }>取消</Button>
                    </div>:
                    <div className={styles.insetButton}>
                        <Button type="primary" onClick={ this.confirmFrom.bind(this,true) }>确认</Button>
                        <Button onClick={ this.preStep }>上一步</Button>
                    </div>
                }
            </div>
        )
    }
}

export default Settle
