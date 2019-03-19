import React,{ Component } from 'react'
import { Alert, Form, Upload, Checkbox,Input, Icon, message, Select, Button, Row, Col } from 'antd'
import Confirm from '@components/confirm/confirm'
import styles from './checkout.less'
import withRef from '@components/HOC/withRef/withRef'
import { uploadQrcode } from '@services/enterprise/hotelOp/checkout';
const FormItem = Form.Item;
const { Option } = Select

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

@Form.create()
@withRef
export default class Checkout extends Component {
    componentDidMount() {
        const { save } = this.props
        save({ uploadFileList:[], checkout_showQrcode:true })
    }

    handleSubmit_ = (e) => {
        const { updateCheckOut } = this.props;
        const { uploadFileList } = this.props.editHotel
        const uploadImg = uploadFileList && uploadFileList.length>0 && uploadFileList[0].response && uploadFileList[0].response.data
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                values.creditCheckOut = values.creditCheckOut?'1':'0'
                values.noCreditCheckOut = values.noCreditCheckOut?'1':'0'
                // uploadImg && (values.billQRCode = uploadImg)
                updateCheckOut(values)
            }
        });
    }
    
    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    doCancle_ = () => {
        const { doCancle } = this.props
        doCancle()
    }

    deleteQrcode = () => {
        const { save, form } = this.props
        form.setFieldsValue({
            billQRCode: '',
        });
        save({ checkout_showQrcode:false })
    }

    onChangeCredit = (e) => {
        const { save, editHotel={} } = this.props
        const { getFieldValue } = this.props.form
        const noCreditCheckOut = getFieldValue('noCreditCheckOut')
        if(noCreditCheckOut) return
        const { checkoutConfig={} } = editHotel
        checkoutConfig['creditCheckOut'] = e.target.checked?'1':'0'
        save({ checkoutConfig })
    }

    onChangeNoCredit = (e) => {
        const { save, editHotel={} } = this.props
        const { setFieldsValue } = this.props.form
        const { checkoutConfig={} } = editHotel
        if(e.target.checked) {//费信用住打开信用住默认选中
            setFieldsValue({ creditCheckOut:true })
            checkoutConfig['creditCheckOut'] = e.target.checked
        }
        checkoutConfig['noCreditCheckOut'] = e.target.checked?'1':'0'
        save({ checkoutConfig })
    }

    getUploadDom = () => {
        const { save, form } = this.props;
        const { uploadFileList, fhHid } = this.props.editHotel;
        const props = {
            name:'img',
            data: {
                fhHid,
            },
            action: uploadQrcode.action,
            beforeUpload:(file) => {
                save({ uploadFileList:[] })
                const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                if (!isJPG && !isPNG) {
                    message.error('图片格式须为png或jpg');
                }
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isLt2M) {
                    message.error('图片大小须小于1M');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            showUploadList:false,
            onChange:(info) => {
                save({ uploadFileList:[ info.file ] })
                if (info.file.status === 'done') {
                    const { response } = info.file
                    if(response.success) {
                        form.setFieldsValue({
                            billQRCode: uploadFileList[0].response.data,
                        });
                        save({ checkout_showQrcode:true })
                        message.success('上传成功');
                    } else {
                        message.error('上传失败');
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传异常`);
                }
            },
        };
        return (
            <div>
                <Upload className={ styles.upload } {...props} fileList={ uploadFileList || [] }>
                    <Button type="primary" size="small">
                        <Icon type="upload" /> 上传
                    </Button>
                </Upload>
                <Button style={{ marginLeft:'20px' }} type="primary" size="small" onClick={ this.deleteQrcode }>清除</Button>
                <p><Icon type="info-circle" />支持jpg/png格式，大小不超过1M，尺寸240*240像素</p>
            </div>
        )
    }

    render() {
        const { editHotel={} } = this.props
        const { checkoutConfig={}, uploadFileList, checkout_showQrcode } = editHotel
        const uploadImg = uploadFileList && uploadFileList.length>0 && uploadFileList[0].response && uploadFileList[0].response.data
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.root}>
                <Alert style={{ marginBottom:'10px' }} message="*功能前置条件：西软PMS线下&爱迪尔门锁" type="warning" />
                <Form onSubmit={this.handleSubmit_} className={styles.form}>
                    <FormItem {...formItemLayout} key='walkOutOnOff' label='首页退房按钮'>
                        {getFieldDecorator('walkOutOnOff', {
                            rules:[{ required:true }],
                            initialValue:checkoutConfig['walkOutOnOff'] || '0'
                        })(
                            <Select>
                                <Option value={ '0' }>不展示</Option>
                                <Option value={ '1' }>展示</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} key='cardTips' label='退卡页提示'>
                        {getFieldDecorator('cardTips', {
                            rules:[{ required:false }],
                            initialValue:checkoutConfig['cardTips'] || ''
                        })(
                            <Input placeholder={ '请输入退卡页提示' } />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} key='billQRCode' label='发票二维码'>
                        {getFieldDecorator('billQRCode', {
                            initialValue:checkoutConfig['billQRCode'] || ''
                        })(
                            this.getUploadDom()
                        )}
                    </FormItem>
                    <Row>
                        <Col span={20} offset={4}>
                            {checkout_showQrcode && <p>{ uploadImg || checkoutConfig['billQRCode'] }</p>}
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout} key='creditCheckOut' label='信用住退房'>
                        {getFieldDecorator('creditCheckOut', {
                            rules:[{ required:false }],
                            initialValue:checkoutConfig['creditCheckOut'] == '1'?true:false
                        })(
                            <Checkbox checked={ checkoutConfig['creditCheckOut'] == '1'?true:false } onChange={ this.onChangeCredit }>信用住退房</Checkbox>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} key='noCreditCheckOut' label='非信用住退房'>
                        {getFieldDecorator('noCreditCheckOut', {
                            rules:[{ required:false }],
                            initialValue:checkoutConfig['noCreditCheckOut'] == '1'?true:false
                        })(
                            <Checkbox checked={ checkoutConfig['noCreditCheckOut'] == '1'?true:false } onChange={ this.onChangeNoCredit }>非信用住退房</Checkbox>
                        )}
                    </FormItem>
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { this.doCancle_ }
                    />
                </Form>   
            </div>
        )
    }
}