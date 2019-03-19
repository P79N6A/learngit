import React,{ Component } from 'react'
import { Form, Input, Cascader, Row, Col, Select, Button } from 'antd'
import Confirm from '@components/confirm/confirm'
import styles from './default.less'
import withRef from '@components/HOC/withRef/withRef'
import { isPhone, max } from '@utils/valid'
const FormItem = Form.Item;

const formConfig = {
    top:[
        { name:'飞猪酒店ID', key:'fgHid', rules:msg => [{ required:true, message:msg }, { validator:max(20) }] },
        { name:'卖家ID', key:'fgSellerId', rules:msg => [{ required:true, message:msg }, { validator:max(20) }] },
        { name:'旅馆代码', key:'psbHotelCode', rules:msg => [{ required:true, message:msg }, { validator:max(20) }] },
    ],
    bottom:[
        { name:'酒店名称', key:'hotelName', rules:msg => [{ required:true, message:msg }, { validator:max(64) }]},
        { name:'集团名称', key:'groupId', rules:msg => [{ required:false, message:msg }] },
        { name:'英文名称', key:'hotelEnName', rules:msg => [{ required:false }, { validator:max(64) }] },
        { name:'卖家昵称', key:'fgSellerNick', rules:msg => [{ required:true, message:msg }, { validator:max(16) }], disabled:true },
        { name:'渠道名称', key:'fgVendor', rules:msg => [{ required:true, message:msg }, { validator:max(32) }], disabled:true },
        { name:'飞猪外部酒店编码', key:'fliggyHotelCode', rules:msg => [{ required:true, message:msg }, { validator:max(56) }], disabled:true },
        { name:'PMS外部酒店编码', key:'pmsHotelCode', rules:msg => [{ required:true, message:msg }, { validator:max(56) }] },
        { name:'标准酒店ID', key:'fgShid', rules:msg => [{ required:true, message:msg }, { validator:max(20) }], disabled:true },
        { name:'联系电话', key:'contactTel', rules:msg => [{ required:false, message:msg }] },
        { name:'酒店地址', key:'hotelAddress', rules:msg => [{ required:false, message:msg }] },
        { name:'商家支付宝ID', key:'alipayId', rules:msg => [{ required:false, message:msg }, { validator:max(32) }] },
        { name:'商家支付宝账号', key:'alipayAccount', rules:msg => [{ required:false, message:msg }, { validator:max(64) }] },
        { name:'授权TOKEN', key:'alipayIsvToken', rules:msg => [{ required:false, message:msg }, { validator:max(60) }] },
        { name:'省/市/县', key:'pcc', rules:msg => [{ type:'array', required:false }] },
        { name:'酒店星级', key:'hotelStar', rules:msg => [{ required:false }] },
        { name:'酒店状态', key:'hotelStatus', rules:msg => [{ required:false }] },
        { name:'电子邮箱', key:'email', rules:msg => [{ type:'email', message:'请输入正确的邮箱格式', required:false }] },
        { name:'经纬度', key:'longitudeLatitude', rules:msg => [{ required:false }] },
    ]
}

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
let queryParams = {
    fgHid:'',
    fgSellerId:'',
    psbHotelCode:'',
}

let timeAgain = null;
@Form.create()
@withRef
export default class Default extends Component {
    componentDidMount() {
        const { data } = this.props.editHotel
        queryParams = {
            fgHid:data.fgHid,
            fgSellerId:data.fgSellerId,
            psbHotelCode:data.psbHotelCode,
        }
        
        timeAgain = null;
    }

    handleSubmit_ = (e) => {
        const { update } = this.props;
        const { initValuePcc } = this.props.editHotel
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.pcc = JSON.stringify(initValuePcc)
                update(values)
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

    handleInput = (e) => {
        const { dispatchSave } = this.props;
        const { id, value } = e.target
        queryParams[id] = value;
        const { fgHid, fgSellerId, psbHotelCode } = queryParams
        //加入防抖模式，当用户输入完300毫秒后判断是否展示按钮
        clearTimeout(timeAgain);
        timeAgain = setTimeout(() => {
            if(fgHid && fgSellerId && psbHotelCode) {
                dispatchSave({ isDisabled:false })
            } else {
                dispatchSave({ isDisabled:true })
            }
        }, 300);
    }

    getTopDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props.editHotel;
        return formConfig.top.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules,
                        initialValue:data[v.key]
                    })(
                        <Input placeholder={ v.name } onChange={ this.handleInput } disabled={ v.disabled?true:false }/>
                    )}
                </FormItem>
            )
        })
    }

    getBottomDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { editHotel, getOptionStatus, getOptionStar, loadData, onChange, visibleChange, getOptionGroup } = this.props;
        const { data, casOptions, bottomData, blocNames } = editHotel;
        //设置选择框的默认值
        return formConfig.bottom.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            const required = rules[0].required
            if(v.key === 'pcc') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data[v.key]
                        })(
                            <Cascader
                                popupPlacement="topLeft"
                                placeholder={ v.name }
                                loadData={ loadData }
                                options={ casOptions }
                                onChange={ onChange }
                                onPopupVisibleChange={ visibleChange }
                                changeOnSelect
                            />,
                        )}
                    </FormItem>
                )
            } else if(v.key === 'longitudeLatitude') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key)(
                        <Row gutter={16} className = {styles.addRow}>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('longitude',{
                                        rules,
                                        initialValue:data.longitude
                                    })(
                                        <Input placeholder='经度' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('latitude',{
                                        rules,
                                        initialValue:data.latitude
                                    })(
                                        <Input placeholder='纬度' />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'hotelStar') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data[v.key] === 0?'':data[v.key]
                        })(
                            <Select>
                                { getOptionStar }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'hotelStatus') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data[v.key] === 0?'':data[v.key]
                        })(
                            <Select>
                                { getOptionStatus }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'groupId') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:data[v.key] || ''
                        })(
                            <Select>
                                { getOptionGroup }
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
                        initialValue:(required && bottomData)?bottomData[v.key]:data[v.key]
                    })(
                        <Input placeholder={ v.name } disabled={ v.disabled?true:false } />
                    )}
                </FormItem>
            )
        })
    }

    getFeiInfo_ = () => {
        const { form, getFeiInfo } = this.props;
        const { resetFields } = form;
        formConfig.bottom.map(v=>{
            let key = v.key
            let required = v.rules()[0].required
            if(required) resetFields(key)
        })
        getFeiInfo(queryParams)
    }

    render() {
        const { loadingOp, isDisabled } = this.props.editHotel
        return (
            <div className={styles.root}>
                <Form onSubmit={this.handleSubmit_} className={styles.form}>
                    { this.getTopDom() }
                    <Row>
                        <Col span={20} offset={4}>
                            <Button onClick={ this.getFeiInfo_ } icon="search" disabled={ isDisabled } loading={ loadingOp } type="primary">获取飞猪信息</Button>
                        </Col>
                    </Row>
                    { this.getBottomDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { this.doCancle_ }
                    />
                </Form>   
            </div>
        )
    }
}