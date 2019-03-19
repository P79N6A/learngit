import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Button, Cascader, Row, Col, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_MATCH_RULE } from '@utils/pathIndex'
import styles from './addMatch.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

function mapStateToProps(state) {
    return { addMatch:state.addMatch}
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
@beforeInit({ name:'addMatch', isInitData:false })
export default class addMatch extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({type:'addMatch/addMatchRule',payload:values})
            }
        });
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        return formConfig.map((v,n) => {
            const rules = [{ ...v.rules, message: `请输入${v.name}` }]
            if(v.key === 'matchRuleDesc') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules: rules,
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
                <h3>新增匹配规则</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'addMatch/pushRouter', payload:{ pathname:INDEX_MATCH_RULE} }) }
                    />
                </Form>   
            </div>
        )
    }
}