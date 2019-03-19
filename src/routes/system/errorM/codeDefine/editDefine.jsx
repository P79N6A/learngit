import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Button, Cascader, Row, Col, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_CODE_DEFINE } from '@utils/pathIndex'
import { max } from '@utils/valid'
import styles from './editDefine.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
function mapStateToProps(state) {
    return { editDefine:state.editDefine, common:state.common }
}

const formConfig = [
    { name:'配件类型', key:'partsType', rules:msg => [{ required:true, message:msg }] },
    { name:'错误名称', key:'standardErrorCodeName', rules:msg => [{ required:true, message:msg }, { validator:max(100) }] },
    { name:'错误码', key:'standardErrorCode', rules:msg => [{ required:true, message:msg }, { validator:max(100) }] },
    { name:'前端文案', key:'standardErrorCodeDesc', rules:msg => [{ required:true, message:msg }, { validator:max(150) }] },
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
@beforeInit({ name:'editDefine'})
export default class Edit extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({type:'editDefine/updateCode',payload:values})
            }
        });
    }

    //获取配置类型
    getPartsList = () => {
        const { typeLists } = this.props.common;
        if(typeLists && typeLists.typeList) {
            return typeLists.typeList.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props.editDefine;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key === 'standardErrorCodeDesc') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data.standardErrorCodeDesc
                        })(
                            <TextArea rows={4} placeholder={ v.name }/>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partsType') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data.partsType
                        })(
                            <Select>
                                { this.getPartsList() }
                            </Select>
                        )}
                    </FormItem>
                )
            }
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {
                    getFieldDecorator(v.key, {
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
        const { dispatch } = this.props;
        return (
            <div className={styles.root}>
                <h3>编辑标准错误码</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'editDefine/pushRouter', payload:{ pathname:INDEX_CODE_DEFINE} }) }
                    />
                </Form>   
            </div>
        )
    }
}