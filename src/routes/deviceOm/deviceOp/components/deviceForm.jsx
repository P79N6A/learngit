import React, { Component } from 'react';
import { Form, Select, Row, Col } from 'antd';
import styles from './deviceForm.less';
const FormItem = Form.Item
const { Option } = Select
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
class DeviceForm extends Component {
    constructor(props) {
        super(props)
    }
    
    //获取升级列表apkapp类型
    getDeviceTypes = (deviceTypes) => {
        if(deviceTypes) {
            return deviceTypes.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    render() {
        const { deviceTypes } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Row>
                <Col span={ 24 }>
                    <Form className={styles.form}>
                        <FormItem {...formItemLayoutDrive} label="类型">
                            {getFieldDecorator('code', {
                                rules: [{ required: true}],
                                initialValue:deviceTypes && deviceTypes[0].code
                            })(
                            <Select>
                                { this.getDeviceTypes(deviceTypes) }
                            </Select>
                            )}
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        )
    }
}

export default DeviceForm
