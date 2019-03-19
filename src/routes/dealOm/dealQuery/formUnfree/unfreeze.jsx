import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import styles from './unfreeze.less';
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
    { name:'结算金额', key:'amount', rules:msg => [{ required:true, message:msg } ]},
    { name:'备注', key:'comment', rules:msg => [{ required:true, message:msg } ]},
]

@Form.create()
class Unfreeze extends Component {
    constructor(props) {
        super(props)
    }

    confirmFrom = (flag) => {
        const { validateFields } = this.props.form;
        const { save, cancel, submit } = this.props
        validateFields((err, values) => {
            if (!err) {
                if(flag) {//提交
                    submit(values)
                    cancel()
                } else {//下一步
                    save({ stepUnfreeze:1 })
                }
            }
        })
    }

    preStep = () => {
        const { save } = this.props
        save({ stepUnfreeze:null })
    }
    
    getDom = () => {
        const { stepUnfreeze } = this.props.dealQuery;
        const { freezeAmount } = this.props;
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
                            initialValue:0
                        })(
                            <span>{ 0 }</span>
                        )}
                    </FormItem>
                )
            } else if(v.key == 'comment') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                        })(
                            <TextArea disabled={ stepUnfreeze?true:false } placeholder={ v.name } />
                        )}
                    </FormItem>
                )
            }
        })
    }

    render() {
        const { stepUnfreeze } = this.props.dealQuery;
        const { cancel } = this.props;
        return (
            <div>
                {
                    !stepUnfreeze?
                    <div className={ styles.title }>
                        <h1>请输入解冻说明</h1>
                    </div>:
                    <div className={ styles.title }>
                        <h1>请确认解冻</h1>
                        <p>两小时后生效，两小时内支持撤销</p>
                    </div>
                }
                    <Form className={styles.form}>
                        { this.getDom() }
                    </Form>
                {
                    !stepUnfreeze?
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

export default Unfreeze
