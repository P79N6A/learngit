import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Select, InputNumber, message } from 'antd'
import Confirm from '@components/confirm/confirm'
import { INDEX_BLOC_OP } from '@utils/pathIndex'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import styles from './addBloc.less'
import { isPhone } from '@utils/valid'
const FormItem = Form.Item;
const { Option } = Select;
function mapStateToProps(state) {
    return { addBloc:state.addBloc }
}

const formConfig = [
    { name:'集团全名', key:'groupName', rules:msg => [{ required:true, message:msg }] },
    { name:'联系电话', key:'groupTel', rules:msg => [{ required:true, message:msg },{ validator:isPhone() }] },
    { name:'邮箱', key:'groupEmail', rules:msg => [{ required:false, type:'email', message:'请输入正确的邮箱格式' }] },
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
@beforeInit({ name:'addBloc', isInitData:false })
export default class AddBloc extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.contactGroupIds = [values.contactGroupIds]
                dispatch({type:'addBloc/action_addGroup',payload:values})
            }
        });
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        return formConfig.map((v,n) => {
            let rules = v.rules(`请输入${v.name}`)
            if(v.key === 'groupEmail') {
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
                <h3>新增集团信息</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'addBloc/pushRouter', payload:{ pathname:INDEX_BLOC_OP} }) }
                    />
                </Form>   
            </div>
        )
    }
}