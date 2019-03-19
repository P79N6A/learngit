import React, { Component } from 'react';
import { Form, Input, DatePicker, Button, LocaleProvider } from 'antd';
import styles from './settleFre.less';
import { isMoney } from '@utils/valid'
import zhCN from 'antd/lib/locale-provider/zh_CN';
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
    { name:'房费（元）', key:'roomFee', rules:(msg, min) => [{ required:true, message:msg }, { validator:isMoney(min) } ]},
    { name:'杂费（元）', key:'otherFee', rules:(msg,min) => [{ required:true, message:msg }, { validator:isMoney(min) } ]},
    { name:'总计实收（元）', key:'amount', rules:(msg) => [{ required:false, message:msg } ]},
    { name:'备注', key:'comment', rules:msg => [{ required:true, message:msg } ]},
]

@Form.create()
class SettleFre extends Component {
    constructor(props) {
        super(props)
        this.state={
            checkoutDate:null
        }
    }

    confirmFrom = (flag) => {
        const { validateFields, setFieldsValue } = this.props.form;
        const { save, cancel, submit } = this.props
        validateFields((err, values) => {
            if (!err) {
                if(flag) {//提交
                    values.checkoutDate = values.checkoutDate.format('YYYY-MM-DD')
                    submit(values)
                    cancel()
                } else {//下一步,同时设置总计实收
                    setFieldsValue({
                        amount: parseFloat(values.roomFee)+ parseFloat(values.otherFee)
                    })
                    save({ stepSettle:1 })
                }
            }
        })
    }

    preStep = () => {
        const { save } = this.props
        save({ stepSettle:null })
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
    
    getDom = () => {
        const { stepSettle } = this.props.dealQuery;
        const { getFieldDecorator } = this.props.form;
        const { checkinDate } = this.props;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key == 'roomFee') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules:v.rules(`${v.name}`,0)
                        })(
                            <Input disabled={ stepSettle?true:false } placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'otherFee') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules:v.rules(`${v.name}`,0)
                        })(
                            <Input disabled={ stepSettle?true:false } placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            } else if(v.key == 'amount') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules
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
                        <h1>请输入结账信息</h1>
                        <p>结算金额必须&ge;0</p>
                    </div>:
                    <div className={ styles.title }>
                        <h1>请确认结账信息</h1>
                        <p>两小时后生效，两小时内支持撤销</p>
                    </div>
                }   
                <LocaleProvider locale={zhCN}>
                    <Form className={styles.form}>
                        { this.getDom() }
                    </Form>
                </LocaleProvider>
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

export default SettleFre
