import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_CODE_MAP } from '@utils/pathIndex'
import styles from './addMap.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
function mapStateToProps(state) {
    return { addMap:state.addMap }
}

const formConfig = [
    { name:'配置类型', key:'partsType', rules:{ required:true } },
    { name:'合作伙伴', key:'partnerId', rules:{ required:true } },
    { name:'合作伙伴产品', key:'productId', rules:{ required:true } },
    { name:'合作伙伴错误码', key:'partnerErrorCode', rules:{ required:true } },
    { name:'合作伙伴错误描述', key:'partnerErrorCodeDesc', rules:{ required:true } },
    { name:'匹配规则类型', key:'matchRuleType', rules:{ required:true } },
    { name:'标准错误码列表', key:'standardErrorCode', rules:{ required:true } },
  ]
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
let seType = null
@connect(mapStateToProps)
@Form.create()
@beforeInit({ name:'addMap', isInitData:false })
export default class Add extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({type:'addMap/addCode',payload:values})
            }
        });
    }
    //商家列表
    getPartnerName = () => {
        const { partnerList } = this.props.addMap;
        if(partnerList) {
            return partnerList.map((v,n)=> <Option key={n} value={ v.partnerId }>{ v.partnerName }</Option>)
        } else {
            return []
        }
    }
    //匹配规则类型
    getMatchRuleList = () => {
        const { matchrule } = this.props.addMap;
        if(matchrule) {
            return matchrule.map((v,n)=> <Option key={n} value={ v.matchRuleType }>{ v.matchRuleType }</Option>)
        } else {
            return []
        }
    }
    //标准错误吗列表
    getStandardErrorCodeList = () => {
        const { standardErrorCodeList } = this.props.addMap;
        if(standardErrorCodeList && standardErrorCodeList.length>0) {
            return standardErrorCodeList.map((v,n)=> <Option key={n} value={ v.standardErrorCode }>{ v.standardErrorCodeName }</Option>)
        } else {
            return []
        }
    }

    //获取配置类型
    getPartsList = () => {
        const { typeLists } = this.props.addMap;
        if(typeLists && typeLists.typeList) {
            return typeLists.typeList.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    //根据商家名称和配置类型获取标准错误码列表
    getStandErrorList = (partsType) => {
        const { dispatch } = this.props
        dispatch({ type:'addMap/getStandErrorList', payload:{ partsType } })
    }

    //根据商家名称和配置类型获取合作伙伴
    getPartnerList = (partsType) => {
        const { dispatch } = this.props
        dispatch({ type:'addMap/getPartnerList', payload:{ partsType } })
    }

    //根据合作伙伴id获取合作伙伴产品列表
    getProductList = (partnerId) => {
        const { dispatch } = this.props
        dispatch({ type:'addMap/getPartnerProductList', payload:{ partnerId } })
    }

    //合作伙伴产品列表
    getPartnerProList = () => {
        let { productList=[] } = this.props.addMap;
        if(productList.length==0) {
            productList = [{code:'',description:'暂无'}]
        }
        return productList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
    }

    //选择配置类型下拉框
    selectType = (v,o) => {
        seType = v;
        const { resetFields } = this.props.form
        resetFields()
        if(seType) {
            this.getStandErrorList(seType)
            this.getPartnerList(seType)
        }
    }

    //选择合作伙伴下拉框
    selectPartner = (v,o) => {
        seType = v;
        const { resetFields } = this.props.form
        resetFields(['productId'])
        if(seType) {
            this.getProductList(seType)
        }
    }

    getDom = () => {
        const { getFieldDecorator } = this.props.form;
        const { partnerList, matchrule, standardErrorCodeList, typeLists, productList=[] } = this.props.addMap;
        return formConfig.map((v,n) => {
            const rules = [{ ...v.rules, message: `请输入${v.name}` }]
            if(v.key === 'standardErrorCodeDesc') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                        })(
                            <TextArea rows={4} placeholder={ v.name }/>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partnerId') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:partnerList && partnerList[0].partnerId
                        })(
                            <Select onSelect={ this.selectPartner }>
                                { this.getPartnerName() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'matchRuleType') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:matchrule && matchrule[0].matchRuleType
                        })(
                            <Select>
                                { this.getMatchRuleList() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'standardErrorCode') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:(standardErrorCodeList && standardErrorCodeList.length>0)?standardErrorCodeList[0].standardErrorCode:'请添加新的标准错误码'
                        })(
                            <Select disabled={ (standardErrorCodeList && standardErrorCodeList.length>0)?false:true }>
                                { this.getStandardErrorCodeList() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partsType') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:typeLists && typeLists.typeList && typeLists.typeList[0].code
                        })(
                            <Select onSelect={ this.selectType }>
                                { this.getPartsList() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'productId') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:productList.length>0?productList[0].code:''
                        })(
                            <Select>
                                { this.getPartnerProList() }
                            </Select>
                        )}
                    </FormItem>
                )
            }
            return (
                <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                    {
                    getFieldDecorator(v.key, {
                        rules: rules,
                    })(
                        <Input placeholder={ v.name } />
                    )}
                </FormItem>
            )
        })
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div className={styles.root}>
                <h3>新增映射错误码</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'addMap/pushRouter', payload:{ pathname:INDEX_CODE_MAP} }) }
                    />
                </Form>   
            </div>
        )
    }
}