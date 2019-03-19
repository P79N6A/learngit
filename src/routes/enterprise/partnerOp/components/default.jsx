import React,{ Component } from 'react'
import { Form, Input, Select, Button } from 'antd'
import Confirm from '@components/confirm/confirm'
import styles from './default.less'
import withRef from '@components/HOC/withRef/withRef'
import { isPhone, max } from '@utils/valid'
const FormItem = Form.Item;

const formConfig = [
    { name:'名称', key:'partnerName', rules:msg => [{ required:true, message:msg }] },
    { name:'联系人', key:'contactName', rules:msg => [{ required:true, message:msg }, { validator:max(10) }] },
    { name:'联系电话', key:'contactTel', rules:msg => [{ required:true, message:msg },{ validator:isPhone() }] },
    { name:'类型', key:'partnerType', rules:msg => [{ required:true, message:msg }] },
    { name:'状态', key:'partnerStatus', rules:msg => [{ required:true, message:msg }] },
    { name:'邮箱', key:'partnerEmail', rules:msg => [{ required:false, type:'email', message:'请输入正确的邮箱格式' }] },
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
export default class Default extends Component {

    handleSubmit_ = (e) => {
        const { update } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
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
        const { getFieldDecorator } = this.props.form;
        const { editPartner, getOptionStatus, getOptionType } = this.props;
        const { typeStatusList, data } = editPartner
        //设置选择框的默认值
        return formConfig.map((v,n) => {
            let rules = v.rules(`请输入${v.name}`)
            if(v.key === 'partnerType') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue: data[v.key] || typeStatusList.typeList[0].code
                        })(
                            <Select disabled={true}>
                                { getOptionType }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partnerStatus') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue: data[v.key] || typeStatusList.statusList[0].code
                        })(
                            <Select>
                                { getOptionStatus }
                            </Select>
                        )}
                    </FormItem>
                )
            }
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:data[v.key]
                    })(
                        <Input placeholder={ v.name } />
                    )}
                </FormItem>
            )
        })
    }

    render() {
        return (
            <div className={styles.root}>
                <Form onSubmit={this.handleSubmit_} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { this.doCancle_ }
                    />
                </Form>   
            </div>
        )
    }
}