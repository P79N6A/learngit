import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Button, Cascader, Row, Col, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_HOTEL_OP } from '@utils/pathIndex'
import { isPhone, max } from '@utils/valid'
import styles from './addHotel.less'
const FormItem = Form.Item;
const { Option } = Select;
function mapStateToProps(state) {
    return { addHotel:state.addHotel }
}

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

@connect(mapStateToProps)
@Form.create()
@beforeInit({ name:'addHotel', isInitData:false })
export default class AddHotel extends Component {
    componentDidMount() {
        queryParams = {
            fgHid:'',
            fgSellerId:'',
            psbHotelCode:'',
        }
        
        timeAgain = null;
    }
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        const { initValuePcc } = this.props.addHotel
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.pcc = JSON.stringify(initValuePcc)
                dispatch({type:'addHotel/action_addHotel',payload:values})
            }
        });
    }

    getOptionStar = () => {
        const { hotelStars } = this.props.addHotel;
        if(hotelStars) {
            const hotelStar_ =  [].concat([{ code:'', description:'请选择' }],hotelStars)
            return hotelStar_.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    getOptionStatus = () => {
        const { hotelStatus } = this.props.addHotel;
        if(hotelStatus) {
            const hotelStatus_ =  [].concat([{ code:'', description:'请选择' }],hotelStatus)
            return hotelStatus_.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    getOptionGroup = () => {
        const { blocNames } = this.props.addHotel;
        if(blocNames) {
          const blocNames_ =  [].concat([ {groupId:'', groupName:'请选择'} ],blocNames)
          return blocNames_.map((v,n)=> <Option key={n} value={ v.groupId }>{ v.groupName }</Option>)
        } else {
          return []
        }
    }

    getFeiInfo = () => {
        const { dispatch, form } = this.props;
        const { resetFields } = form;
        formConfig.bottom.map(v=>{
            let key = v.key
            let required = v.rules()[0].required
            if(required) resetFields(key)
        })
        dispatch({ type:'addHotel/action_getHotelInfoFromTop', payload: queryParams})
    }

    handleInput = (e) => {
        const { dispatch } = this.props;
        const { id, value } = e.target
        queryParams[id] = value;
        const { fgHid, fgSellerId, psbHotelCode } = queryParams
        //加入防抖模式，当用户输入完300毫秒后判断是否展示按钮
        clearTimeout(timeAgain);
        timeAgain = setTimeout(() => {
            if(fgHid && fgSellerId && psbHotelCode) {
                dispatch({ type:'addHotel/save', payload:{ isDisabled:false } })
            } else {
                dispatch({ type:'addHotel/save', payload:{ isDisabled:true } })
            }
        }, 300);
    }

    getTopDom = () => {
        const { getFieldDecorator } = this.props.form;
        return formConfig.top.map((v,n) => {
            return (
                <FormItem {...formItemLayout} key={ n } label={ v.name }>
                    {getFieldDecorator(v.key, {
                        rules: v.rules(`请输入${v.name}`),
                    })(
                        <Input placeholder={ v.name }  onChange={ this.handleInput } />
                    )}
                </FormItem>
            )
        })
    }

    onChange = (v,s) => {
        s = s.map(v=>{
            return { code:v.value, descript:v.label }
        })
        const { dispatch } = this.props
        dispatch({ type:'addHotel/save', payload:{ initValuePcc:s } })
    }

    loadData = (selectedOptions) => {
        const { dispatch } = this.props
        const { loadingOp } = this.props.addHotel
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = loadingOp;
        if (selectedOptions.length == 1) {//点击省获取市
            dispatch({ type:'addHotel/action_getCity', payload:{ prv:targetOption.value, city:'T' } })
        } else if(selectedOptions.length == 2) {//点击市获取县
            const prv = selectedOptions[0].value
            const cityCode = selectedOptions[1].cityCode
            dispatch({ type:'addHotel/action_getCounty', payload:{ prv, cityCode } })
        }
    }

    getBottomDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { addHotel } = this.props;
        const { bottomData, casOptions, param } = addHotel;
        return formConfig.bottom.map((v,n) => {
            const rules = v.rules(`请输入${v.name}`)
            if(v.key === 'pcc') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules: rules,
                        })(
                            <Cascader
                                popupPlacement="topLeft"
                                placeholder={ v.name }
                                loadData={ this.loadData }
                                options={ casOptions }
                                onChange={ this.onChange }
                                changeOnSelect
                            />,
                        )}
                    </FormItem>
                )
            } else if(v.key === 'longitudeLatitude') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key)(
                        <Row gutter={16} className = { styles.addRow }>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('longitude',{
                                        rules,
                                        initialValue:bottomData && bottomData.longitude
                                    })(
                                        <Input placeholder='经度' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('latitude',{
                                        rules,
                                        initialValue:bottomData && bottomData.longitude
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
                            initialValue:bottomData?(bottomData[v.key] === 0?'':bottomData[v.key]):''
                        })(
                            <Select>
                                { this.getOptionStar() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'hotelStatus') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:bottomData?(bottomData[v.key] === 0?'':bottomData[v.key]):''
                        })(
                            <Select>
                                { this.getOptionStatus() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'groupId') {
                return (
                    <FormItem {...formItemLayout} key={ n } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:''
                        })(
                            <Select>
                                { this.getOptionGroup() }
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
                        initialValue:bottomData && bottomData[v.key]
                    })(
                        <Input placeholder={ v.name } disabled={ v.disabled?true:false } />
                    )}
                </FormItem>
            )
        })
    }

    render() {
        const { dispatch,addHotel } = this.props;
        const { isDisabled, loading } = addHotel;
        return (
            <div className={styles.root}>
                <h3>新增酒店</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getTopDom() }
                    <Row>
                        <Col span={20} offset={4}>
                            <Button onClick={ this.getFeiInfo } icon="search" loading={ loading } type="primary" disabled={ isDisabled }>获取飞猪信息</Button>
                            <span> 输入上面三个参数，获取飞猪信息</span>
                        </Col>
                    </Row>
                    { this.getBottomDom() }

                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'addHotel/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                    />
                </Form>   
            </div>
        )
    }
}