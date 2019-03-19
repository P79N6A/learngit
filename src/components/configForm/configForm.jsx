import React,{ Component } from 'react'
import { Form, Row, Col, Button, LocaleProvider } from 'antd'
import styles from './configForm.less'
import withRef from '@components/HOC/withRef/withRef'
import zhCN from 'antd/lib/locale-provider/zh_CN';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 20 },
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
        align: 'middle',
    };

    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form
        const { initialValue, params, align, colSpan1 = 10, colSpan2 = 12 } = this.props
        const rules = params.rules(`请输入${params.name}`)
        return (
            <Row type="flex" align={ align } gutter={ 16 }>
                <Col key={1} span={ colSpan1 } offset={2}>
                    <FormItem {...formItemLayout} label={ params.name }>
                        {getFieldDecorator(params.key, {
                            rules,
                            initialValue
                        })(
                            params.item(params.name)
                        )}
                    </FormItem> 
                </Col>
                <Col key={2} span={ colSpan2 }>
                    <Button className={ styles.button } type="primary" htmlType="submit">确定</Button>
                </Col>
            </Row>
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
