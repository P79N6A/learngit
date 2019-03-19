import React, { Component } from 'react';
import { Form, Radio, Button, Row, Col } from 'antd';
import styles from './debugForm.less';
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const formItemLayoutDrive = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 16 },
    },
  };

@Form.create()
class DebugForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { debugInfo } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Row>
                <Col span={ 24 } className={ styles.centerContent }>
                {
                    debugInfo && <Form className={styles.form}>
                    <FormItem {...formItemLayoutDrive} label="选择">
                        {getFieldDecorator('debugStatus', {
                            rules: [{ required: true}],
                            initialValue: debugInfo.debugStatus
                        })(
                        <RadioGroup>
                            <Radio value='1'>开启</Radio>
                            <Radio value='0'>关闭</Radio>
                        </RadioGroup>
                        )}
                    </FormItem>
                </Form>
                }
                </Col>
            </Row>
        )
    }
}

export default DebugForm
