import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Tabs, Select } from 'antd'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_PARTNER_OP } from '@utils/pathIndex'
import styles from './editPartner.less'
import Default from './components/default'
import ProductConfig from './components/product'
const TabPane = Tabs.TabPane
const { Option } = Select;
function mapStateToProps(state) {
    return { editPartner:state.editPartner }
}
@connect(mapStateToProps)
@Form.create()
@beforeInit({ name:'editPartner' })
export default class EditPartner extends Component {

    getOptionType = () => {
        const { typeStatusList } = this.props.editPartner;
        if(typeStatusList) {
            return typeStatusList.typeList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }
    getOptionStatus = () => {
        const { typeStatusList } = this.props.editPartner;
        if(typeStatusList) {
            return typeStatusList.statusList.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    onTabClick = (key) => {
        const { dispatch } = this.props
        if(key == 1) {
            this.defaultRef && this.defaultRef.reset()
        } else if(key == 2) {
            dispatch({ type:'editPartner/getPartnerProducts' })
        }
    }

    //编辑合作伙伴tab2--产品模块-编辑-tab2-获取pms信息
    getByPmsCode = (payload) => {
        const { dispatch } = this.props;
        dispatch({type:'editPartner/getByPmsCode',payload })
    }

    //编辑合作伙伴tab1--合作伙伴基本信息修改
    update = (payload) => {
        const { dispatch } = this.props;
        dispatch({type:'editPartner/updatePartner',payload })
    }

    //编辑合作伙伴tab2--产品模块--编辑更新
    updatePro = (payload) => {
        const { dispatch } = this.props;
        dispatch({ type:'editPartner/updatePartnerProduct', payload })
    }

    //编辑合作伙伴tab2--产品模块--添加产品
    addPro = (payload) => {
        const { dispatch } = this.props;
        dispatch({ type:'editPartner/addPartnerProduct', payload })
    }

    //编辑合作伙伴tab2--产品模块--获取产品信息
    infoPro = (id) => {
        const { dispatch } = this.props;
        dispatch({ type:'editPartner/partnerProductsInfo', payload:{ id } })
    }

    //编辑合作伙伴tab2--产品模块--添加和编辑获取合作伙伴枚举列表
    getTypeLists = (payload) => {
        const { dispatch } = this.props;
        dispatch({ type:'editPartner/getPartsType', payload })
    }

    updateMidnight = (payload) => {
        const { dispatch } = this.props;
        dispatch({type:'editPartner/saveOrUpdate',payload })
    }

    updatePmsTime = (payload) => {
        const { dispatch } = this.props;
        dispatch({type:'editPartner/saveOrUpdate',payload })
    }

    //编辑合作伙伴tab2--产品模块--搜索列表
    onChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.editPartner
        dispatch({
        type: `editPartner/${type}`,
            payload: {
                ...filter,
                currentPage,
                currentSize,
            },
        })
    }

    //编辑合作伙伴tab2--产品模块--点击页码搜索
    onShowSizeChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.editPartner
        dispatch({
        type: `editPartner/${type}`,
            payload: {
                ...filter,
                currentPage,
                currentSize,
            },
        })
    }

    render() {
        const { dispatch, editPartner } = this.props;
        return (
            <div className={styles.root}>
                <h3>编辑合作伙伴</h3>
                <Divider />
                <Tabs defaultActiveKey="1" onTabClick={ this.onTabClick } type="card">
                    <TabPane tab="基本信息" key="1">
                        <Default
                            getInstance={ ref => this.defaultRef = ref }
                            editPartner = { editPartner }
                            update={ this.update }
                            visibleChange = { this.visibleChange }
                            getOptionType = { this.getOptionType() }
                            getOptionStatus = { this.getOptionStatus() }
                            doCancle = { () => dispatch({ type:'editPartner/pushRouter', payload:{ pathname:INDEX_PARTNER_OP} }) }
                        />
                    </TabPane>
                    <TabPane tab="产品配置" key="2">
                        <ProductConfig
                            getInstance={ ref => this.productRef = ref }
                            editPartner = { editPartner }
                            getTypeLists = { this.getTypeLists }
                            info = { this.infoPro }
                            add = { this.addPro }
                            update = { this.updatePro }
                            onChange={ this.onChange('getPartnerProducts') }
                            updateMidnight = { this.updateMidnight }
                            getByPmsCode = { this.getByPmsCode }
                            onShowSizeChange={ this.onShowSizeChange('getPartnerProducts') }
                            />
                    </TabPane>
                </Tabs>  
            </div>
        )
    }
}