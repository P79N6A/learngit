import React, { Component } from 'react';
import { Form, Select, Button, Row, Col } from 'antd';
import styles from './driveForm.less';
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
class DriveForm extends Component {
    constructor(props) {
        super(props)
    }

    //获取驱动类型
    getDriveTypes = () => {
        const { driveTypes } = this.props;
        if(driveTypes) {
            return driveTypes.map((v,n)=> <Option key={n} value={ v }>{ v }</Option>)
        } else {
            return []
        }
    }

    //获取驱动品牌
    getDriveBrand = () => {
        const { brandVersion } = this.props;
        if(brandVersion) {
            return brandVersion.map((v,n)=> <Option key={n} value={ v.brand }>{ v.brand }</Option>)
        } else {
            return []
        }
    }
    //获取驱动版本
    getDriveVersion = () => {
        const { driveVersion } = this.props;
        if(driveVersion) {
            return driveVersion.map((v,n)=> <Option key={n} value={ v }>{ v }</Option>)
        } else {
            return []
        }
    }

    codeChangeReset = (v) => {
        const { codeChange } = this.props;
        const { resetFields } = this.props.form;
        resetFields()
        codeChange(v)
    }
    
    brandChangeReset = (v) => {
        const { brandChange } = this.props;
        const { resetFields } = this.props.form;
        resetFields('version')
        brandChange(v)
    }

    render() {
        const { driveTypes, brandVersion, driveVersion } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Row>
                <Col span={ 24 }>
                <Form className={styles.form}>
                    <FormItem {...formItemLayoutDrive} label="类型">
                        {getFieldDecorator('code', {
                            rules: [{ required: true}],
                            initialValue:driveTypes && driveTypes[0]
                        })(
                        <Select onSelect={ this.codeChangeReset }>
                            { this.getDriveTypes() }
                        </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayoutDrive} label="品牌">
                        {getFieldDecorator('brand', {
                            rules: [{ required: true}],
                            initialValue:brandVersion && brandVersion[0].brand
                        })(
                        <Select onSelect={ this.brandChangeReset }>
                            { this.getDriveBrand() }
                        </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayoutDrive} label="版本">
                        {getFieldDecorator('version', {
                            rules: [{ required: true}],
                            initialValue:driveVersion && driveVersion[0]
                        })(
                        <Select>
                            { this.getDriveVersion() }
                        </Select>
                        )}
                    </FormItem>
                </Form> 
                </Col>
            </Row>
        )
    }
}

export default DriveForm
