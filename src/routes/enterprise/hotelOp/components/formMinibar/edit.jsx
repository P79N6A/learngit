import React, { Component } from 'react';
import { Form, Select, Col, Input } from 'antd';
import { max } from '@utils/valid'
import styles from './edit.less';
const { Option } = Select
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
    { name:'费用代码输入方式', key:'feeCodeSelect', rules:msg => [{ required:false, message:msg }]},
    { name:'费用代码', key:'feeCode', rules:msg => [{ required:true, message:msg }]},
    { name:'物品代码', key:'goodsCode', rules:msg => [{ required:false, message:msg }, { validator:max(60) }]},
]

@Form.create()
class EditForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputType:1,
        }
    }

    componentDidMount() {
        this.setState({
            inputType:1,
        })
    }

    reset = () => {
        this.setState({
            inputType:1,
        })
    }

    getOptionSe = () => {
        const { feesList=[] } = this.props;
        return feesList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
    }
    
    feeChange = (v) => {
        const { resetFields } = this.props.form;
        this.setState({
            inputType:v,
        })
        resetFields('feeCode')
    }
    
    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { data={}, feesList=[] } = this.props
        const { inputType } = this.state
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key == 'feeCodeSelect') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules:[{ required:this.state.feeCodeInputRe, message:`请输入${v.name}` }],
                            initialValue:1
                        })(
                            <Select onChange={ this.feeChange }>
                                <Option key={1} value={ 1 }>手动输入</Option>
                                <Option key={2} value={ 2 }>自动选择</Option>
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key == 'feeCode') {
                return inputType == 1?
                 (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data.feeCode || ''
                        })(
                            <Input placeholder='请输入费用代码'/>
                        )}
                    </FormItem>
                ):(
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules:[{ required:true }],
                            initialValue:feesList[0].code
                        })(
                            <Select>
                                { this.getOptionSe() }
                            </Select>
                        )}
                    </FormItem>
                )
            }
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:data[v.key] || ''
                    })(
                        <Input placeholder={ v.name } />
                    )}
                </FormItem>
            )
        })
    }

    render() {
        return (
            <Form className={styles.form}>
                { this.getDom() }
            </Form>
        )
    }
}

export default EditForm
