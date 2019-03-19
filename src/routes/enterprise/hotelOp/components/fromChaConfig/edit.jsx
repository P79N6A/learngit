import React, { Component } from 'react';
import { Form, Select, Col, Input } from 'antd';
import { max } from '@utils/valid'
import styles from './edit.less';
import { checkisSe } from '@utils/tools'
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
    { name:'标准特征', key:'featureStandardId', rules:msg => [{ required:true, message:msg }]},
    { name:'房间类型代码', key:'pmsFeatureCode', rules:msg => [{ required:true, message:msg }, { validator:max(60) }], disabled:true },
    { name:'是否筛选条件', key:'filterCondition', rules:msg => [{ required:true, message:msg }] },
]

@Form.create()
class EditForm extends Component {
    constructor(props) {
        super(props)
    }

    getOptionSe = () => {
        const arr = [{ key:1, value:'是'}, { key:2, value:'否' }]
        return arr.map((v,n)=> <Option key={n} value={ v.key }>{ v.value }</Option>)
    }

    getOptionStandard = () => {
        const { data } = this.props;
        if(data && data.standardAll) {
            return data.standardAll.map((v,n)=> <Option key={n} value={ v.id }>{ v.featureDesc }</Option>)
        } else {
            return []
        }
    }
    
    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { data={} } = this.props;
        return formConfig.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key == 'filterCondition') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:(data && data[v.key]) || 1
                        })(
                            <Select>
                                { this.getOptionSe() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key == 'featureStandardId') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue: checkisSe(data.standardAll,'id',data[v.key])
                        })(
                            <Select>
                                { this.getOptionStandard() }
                            </Select>
                        )}
                    </FormItem>
                )
            }
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:data && data[v.key]
                    })(
                        <Input placeholder={ v.name } disabled={ v.disabled?true:false } />
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
