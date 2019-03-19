import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_CODE_MAP } from '@utils/pathIndex'
import styles from './editMap.less'
import { checkisSe } from '@utils/tools'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
function mapStateToProps(state) {
    return { editMap:state.editMap }
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
@beforeInit({ name:'editMap' })
export default class Add extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                dispatch({type:'editMap/upData',payload:values})
            }
        });
    }
    //商家列表
    getPartnerName = () => {
        let { partnerList=[] } = this.props.editMap;
        if(partnerList.length==0) partnerList = [{partnerId:'',partnerName:'暂无'}]
        return partnerList.map((v,n)=> <Option key={n} value={ v.partnerId }>{ v.partnerName }</Option>)
    }
    //匹配规则类型
    getMatchRuleList = () => {
        let { matchrule=[] } = this.props.editMap;
        if(matchrule.length==0) matchrule = [{matchRuleType:'',matchRuleType:'暂无'}]
        return matchrule.map((v,n)=> <Option key={n} value={ v.matchRuleType }>{ v.matchRuleType }</Option>)
    }
    //标准错误吗列表
    getStandardErrorCodeList = () => {
        let { standardErrorCodeList=[] } = this.props.editMap;
        if(standardErrorCodeList.length==0) standardErrorCodeList = [{standardErrorCode:'',standardErrorCodeName:'暂无'}]
        return standardErrorCodeList.map((v,n)=> <Option key={n} value={ v.standardErrorCode }>{ v.standardErrorCodeName }</Option>)
    }

    //获取配置类型
    getPartsList = () => {
        const { typeLists } = this.props.editMap;
        if(typeLists && typeLists.typeList) {
            return typeLists.typeList.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    //根据商家名称和配置类型获取标准错误码列表
    getStandErrorList = (partsType) => {
        const { dispatch } = this.props
        dispatch({ type:'editMap/getStandErrorList', payload:{ partsType } })
    }

    //根据商家名称和配置类型获取合作伙伴
    getPartnerList = (partsType) => {
        const { dispatch } = this.props
        dispatch({ type:'editMap/getPartnerList', payload:{ partsType } })
    }

    //根据合作伙伴id获取合作伙伴产品列表
    getProductList = (partnerId) => {
        const { dispatch } = this.props
        dispatch({ type:'editMap/getPartnerProductList', payload:{ partnerId } })
    }

    //合作伙伴产品列表
    getPartnerProList = () => {
        let { productList=[] } = this.props.editMap;
        if(productList.length==0) productList = [{code:'',description:'暂无'}]
        return productList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
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
        const { partnerList=[], matchrule=[], standardErrorCodeList=[], typeLists={}, data, productList=[] } = this.props.editMap;
        //设置选择框的默认值
        return formConfig.map((v,n) => {
            const rules = [{ ...v.rules, message: `请输入${v.name}` }]
            if(v.key === 'standardErrorCodeDesc') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules: rules,
                            initialValue:data[v.key] || ''
                        })(
                            <TextArea rows={4} placeholder={ v.name }/>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partnerId') {
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules: rules,
                            initialValue: checkisSe(partnerList,v.key,data[v.key])
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
                            rules: rules,
                            initialValue:checkisSe(matchrule,v.key,data[v.key])
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
                            rules: rules,
                            initialValue:checkisSe(standardErrorCodeList,v.key,data[v.key])
                        })(
                            <Select disabled={ standardErrorCodeList.length>0?false:true }>
                                { this.getStandardErrorCodeList() }
                            </Select>
                        )}
                    </FormItem>
                )
            } else if(v.key === 'partsType') {
                console.log(typeLists.typeList,data[v.key])
                return (
                    <FormItem {...formItemLayout} key={ v.key } label={ v.name }>
                        {getFieldDecorator(v.key, {
                            rules: rules,
                            initialValue:checkisSe(typeLists.typeList,'code',data[v.key])
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
                        rules: rules,
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
                <h3>编辑映射错误码</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    { this.getDom() }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { () => dispatch({ type:'editMap/pushRouter', payload:{ pathname:INDEX_CODE_MAP} }) }
                    />
                </Form>   
            </div>
        )
    }
}