import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Select, InputNumber, message } from 'antd'
import Confirm from '@components/confirm/confirm'
import { INDEX_PARTNER_OP } from '@utils/pathIndex'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import styles from './addPartner.less'
import { isPhone, max } from '@utils/valid'
const FormItem = Form.Item;
const { Option } = Select;
function mapStateToProps(state) {
    return { addPartner:state.addPartner }
}

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
@connect(mapStateToProps)
@Form.create()
@beforeInit({ name:'addPartner', isInitData:false })
export default class AddPartner extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({type:'addPartner/addPartner',payload:values})
            }
        });
    }

    getOptionType = () => {
        const { typeStatusList } = this.props.addPartner;
        if(typeStatusList) {
            return typeStatusList.typeList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }
    getOptionStatus = () => {
        const { typeStatusList } = this.props.addPartner;
        if(typeStatusList) {
            return typeStatusList.statusList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { typeStatusList, showPmsCode } = this.props.addPartner;
        return formConfig.map((v,n) => {
            let rules = v.rules(`请输入${v.name}`)
            if(v.key === 'partnerType') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:typeStatusList && typeStatusList.typeList[0].code
                        })(
                            <Select>
                                { this.getOptionType() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partnerStatus') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:typeStatusList && typeStatusList.statusList[0].code
                        })(
                            <Select onSelect={ this.selectType }>
                                { this.getOptionStatus() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partnerEmail') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules:v.rules(`请输入正确的${v.name}`)
                        })(
                            <Input placeholder={ v.name } />
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
        const { dispatch } = this.props;
        return (
            <div className={styles.root}>
                <h3>新增合作伙伴</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'addPartner/pushRouter', payload:{ pathname:INDEX_PARTNER_OP} }) }
                    />
                </Form>   
            </div>
        )
    }
}