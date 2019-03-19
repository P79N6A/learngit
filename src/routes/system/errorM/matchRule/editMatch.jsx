import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_MATCH_RULE } from '@utils/pathIndex'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
import styles from './editMatch.less'
function mapStateToProps(state) {
    return { editMatch:state.editMatch }
}

const formConfig = [
      { name:'规则类型', key:'matchRuleType', rules:{ required:true } },
      { name:'规则描述', key:'matchRuleDesc', rules:{ required:true } },
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
@beforeInit({ name:'editMatch'})
export default class Edit extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({type:'editMatch/updateMatchRule',payload:values})
            }
        });
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props.editMatch;
        return formConfig.map((v,n) => {
            const rules = [{ ...v.rules, message: `请输入${v.name}` }]
            if(v.key === 'matchRuleDesc') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules: rules,
                            initialValue:data[v.key]
                        })(
                            <TextArea rows={4} placeholder={ v.name }/>
                        )}
                    </FormItem>
                )
            }
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {
                    getFieldDecorator(v.key, {
                        rules: rules,
                        initialValue:data[v.key]
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
                <h3>新增标准错误码</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'editMatch/pushRouter', payload:{ pathname:INDEX_MATCH_RULE} }) }
                    />
                </Form>   
            </div>
        )
    }
}