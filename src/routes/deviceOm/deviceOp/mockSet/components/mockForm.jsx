import React,{ Component } from 'react'
import { Form, Row, Col, Button, LocaleProvider, Input, Select } from 'antd'
import styles from './mockForm.less'
import withRef from '@components/HOC/withRef/withRef'
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { Option } = Select
const { TextArea } = Input
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
    },
};
@Form.create()
@withRef
export default class ConfigForm extends Component {
    handleSubmit_ = (e) => {
        const { update } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {//可以提交
                update(values)
            }
        });
    }

    static defaultProps = {
        justify: 'middle',
    };

    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form
        const { initialObj, justify, colSpan1 = 10, colSpan2 = 14 } = this.props
        return (
            <div>
                <Row type="flex" justify={ justify } gutter={ 16 }>
                    <Col key={1} span={ colSpan1 }>
                        <FormItem {...formItemLayout} label='是否开启mock'>
                            {getFieldDecorator('mockStatus', {
                                rules:[{ required:true, message:'请输入mock设置' }],
                                initialValue:initialObj.mockStatus || 0
                            })(
                                <Select>
                                    <Option value={1}>是</Option>
                                    <Option value={0}>否</Option>
                                </Select>
                            )}
                        </FormItem> 
                    </Col>
                    <Col key={2} span={ colSpan2 }>
                        <Button className={ styles.button } type="primary" htmlType="submit">确定</Button>
                    </Col>
                </Row>
                <Row type="flex" justify={ justify } gutter={ 16 }>
                    <Col span={ colSpan1 }>
                        <FormItem {...formItemLayout} label='mock响应值'>
                            {getFieldDecorator('mockResponse', {
                                rules:[{ required:true, message:'请输入mockRepsonse' }],
                                initialValue:initialObj.mockResponse || "{}"
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem> 
                    </Col>
                </Row>
                <Row style={{ display:'none' }} type="flex" justify={ justify } gutter={ 16 }>
                    <Col span={ colSpan1 }>
                        <FormItem {...formItemLayout} label='mockId'>
                            {getFieldDecorator('mockId', {
                                initialValue:initialObj.mockID || ''
                            })(
                                <Input type="hidden" />
                            )}
                        </FormItem> 
                    </Col>
                </Row>
            </div>
        )
    }

    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Form onSubmit={this.handleSubmit_} className={styles.form}>
                    { this.getDom() }
                </Form>   
            </LocaleProvider>
        )
    }
}
