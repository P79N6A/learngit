import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Select, message } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_MATCH_RULE_PARTNER } from '@utils/pathIndex'
import styles from './editMatchPartner.less'
import { checkisSe } from '@utils/tools'
const FormItem = Form.Item;
const { Option } = Select;
function mapStateToProps(state) {
    return { editMatchPartner:state.editMatchPartner, common:state.common }
}

const formConfig = [
    { name:'配置类型', key:'partsType', rules:{ required:true } },
    { name:'合作伙伴产品', key:'productId', rules:{ required:true } },
    { name:'合作伙伴', key:'partnerId', rules:{ required:true } },
    { name:'匹配关键字', key:'matchKeywords', rules:{ required:false } },
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
@beforeInit({ name:'editMatchPartner'})
export default class Edit extends Component {
    handleSubmit = (e) => {
        const { standardErrorCodeList } = this.props.editMatchPartner
        if(!standardErrorCodeList || standardErrorCodeList.length==0) {
            message.error('请添加新的标准错误码')
            return
        }
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({type:'editMatchPartner/updateMatchPartner',payload:values})
            }
        });
    }

    getMatchRuleList = () => {
        let { matchrule } = this.props.editMatchPartner;
        if(matchrule.length==0) matchrule = [{matchRuleType:'',matchRuleType:'暂无'}]
        return matchrule.map((v,n)=> <Option key={n} value={ v.matchRuleType }>{ v.matchRuleType }</Option>)
    }

    //商家列表
    getPartnerName = () => {
        let { partnerList=[] } = this.props.editMatchPartner;
        if(partnerList.length==0) partnerList = [{partnerId:'',partnerName:'暂无'}]
        return partnerList.map((v,n)=> <Option key={n} value={ v.partnerId }>{ v.partnerName }</Option>)
    }

    //标准错误吗列表
    getStandardErrorCodeList = () => {
        let { standardErrorCodeList=[] } = this.props.editMatchPartner;
        if(standardErrorCodeList.length==0) standardErrorCodeList = [{standardErrorCode:'',standardErrorCodeName:'暂无'}]
        return standardErrorCodeList.map((v,n)=> <Option key={n} value={ v.standardErrorCode }>{ v.standardErrorCodeName }</Option>)
    }

    //获取配置类型
    getPartsList = () => {
        const { typeLists } = this.props.editMatchPartner;
        if(typeLists && typeLists.typeList) {
            return typeLists.typeList.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    //合作伙伴产品列表
    getPartnerProList = () => {
        let { productList=[] } = this.props.editMatchPartner;
        if(productList.length==0) productList = [{code:'',description:'暂无'}]
        return productList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
    }

    //根据商家名称和配置类型获取标准错误码列表
    getStandErrorList = (partsType) => {
        const { dispatch } = this.props
        dispatch({ type:'editMatchPartner/getStandErrorList', payload:{ partsType } })
    }

    //根据商家名称和配置类型获取合作伙伴
    getPartnerList = (partsType) => {
        const { dispatch } = this.props
        dispatch({ type:'editMatchPartner/getPartnerList', payload:{ partsType } })
    }

    //根据合作伙伴id获取合作伙伴产品列表
    getProductList = (partnerId) => {
        const { dispatch } = this.props
        dispatch({ type:'editMatchPartner/getPartnerProductList', payload:{ partnerId } })
    }

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
        const { partnerList=[], matchrule=[], standardErrorCodeList=[], typeLists, data, productList=[] } = this.props.editMatchPartner;
        return formConfig.map((v,n) => {
            const rules = [{ ...v.rules, message: `请输入${v.name}` }]
            if(v.key === 'partnerId') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:checkisSe(partnerList,v.key,data[v.key])
                        })(
                            <Select onSelect={ this.selectPartner }>
                                { this.getPartnerName() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'standardErrorCode') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:checkisSe(standardErrorCodeList,v.key,data[v.key])
                        })(
                            <Select disabled={ standardErrorCodeList.length>0?false:true }>
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
                            initialValue:checkisSe(typeLists.typeList,'code',data[v.key])
                        })(
                            <Select onSelect={ this.selectType }>
                                { this.getPartsList() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'matchRuleType') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules: rules,
                            initialValue:checkisSe(matchrule,v.key,data[v.key])
                        })(
                            <Select>
                                { this.getMatchRuleList() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'productId') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules,
                            initialValue:checkisSe(productList,'code',data[v.key])
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
                        rules,
                        initialValue:data[v.key] || ''
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
                <h3>编辑合作伙伴规则</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'editMatchPartner/pushRouter', payload:{ pathname:INDEX_MATCH_RULE_PARTNER} }) }
                    />
                </Form>   
            </div>
        )
    }
}