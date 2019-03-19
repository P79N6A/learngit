import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Table, Form, Select, LocaleProvider, Input, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './codeMap.less'
import { INDEX_CODE_MAP } from '@utils/pathIndex'

const Option = Select.Option;
let seType = null
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return { codeMap:state.codeMap }
}
@connect(mapStateToProps)
@Form.create()
export default class codeMap extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    Object.keys(fields).map((key) => {
      if (key === 'date' && fields[key] && fields[key].length > 0) {
        submitData = {
          ...submitData,
          startTime: fields[key][0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: fields[key][1].format('YYYY-MM-DD HH:mm:ss'),
        }
      } else if((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
      
    });
    dispatch({ type: 'codeMap/save', payload: { filter:submitData } });
    dispatch({ type: 'codeMap/queryBaseData', payload: submitData });
  }

  //重置
  onReset = () => {
    const { dispatch, form } = this.props;
    const { resetFields } = form;
    resetFields()
    dispatch({ type:'codeMap/save', payload:{ filter:{}, partnerDisable:true, partnerList:undefined } })
  }

  deleteCode = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'codeMap/deleteCode', payload:{ id } })
  }

  //获取合作伙伴等列表配置
  allParamList = () => {
    const { partnerList } = this.props.codeMap;
    if(partnerList) {
        return partnerList.map((v,n)=> <Option key={ n }  value={ v.partnerId }>{ v.partnerName }</Option>)
    } else {
        return []
    }
  }

  //获取配置类型
  getPartsList = () => {
    const { typeLists } = this.props.codeMap;
    if(typeLists && typeLists.typeList) {
        const partsListSe =  [].concat([{ code:'', description:'全部' }],typeLists.typeList)
        return partsListSe.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  //根据商家名称和配置类型获取合作伙伴
  getPartnerList = (partsType) => {
    const { dispatch } = this.props
    dispatch({ type:'codeMap/getPartnerList', payload:{ partsType } })
  }

  selectType = (v,o) => {
    if(!v) {
      this.onReset()
      return
    }
    seType = v;
    if(seType) this.getPartnerList(seType)
  }
  
  render() {
    const { loading, filter, pagination,teamList, partnerDisable, partnerList } = this.props.codeMap;
    const { dispatch } = this.props;
    const placeholder = partnerList?'请选择合作伙伴':'请先选择配置类型'
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'partnerId',
        label: '合作伙伴列表',
        span: 8,
        formItemLayout,
        option: this.allParamList(),
        fieldAdapter: {
          component: Select,
          disabled:partnerDisable,
          placeholder
        },
      },
      {
        key: 'partsType',
        label: '配件类型',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getPartsList(),
        fieldAdapter: {
          component: Select,
          onSelect:this.selectType,
        },
      },
      {
        key: 'partnerErrorCode',
        label: '合作伙伴错误码',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写操作模块',
          component: Input,
        },
      },
      {
        key: 'partnerErrorCodeDesc',
        label: '合作伙伴错误信息',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写操作模块',
          component: Input,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '配件类型',
        dataIndex: 'partsName',
        key: 'partsName',
        width:'10%',
      }, 
      {
        title: '合作伙伴名称',
        dataIndex: 'partnerName',
        key: 'partnerName',
        width:'10%',
      }, 
      {
        title: '合作伙伴产品名称',
        dataIndex: 'productName',
        key: 'productName',
        width:'10%',
      }, 
      {
        title: '合作伙伴错误码',
        dataIndex: 'partnerErrorCode',
        key: 'partnerErrorCode',
        width:'10%',
      }, {
        title: '合作伙伴错误信息',
        dataIndex: 'partnerErrorCodeDesc',
        key: 'partnerErrorCodeDesc',
        width:'10%',
      }, {
        title: '匹配规则类型',
        dataIndex: 'matchRuleType',
        key: 'matchRuleType',
        width:'15%',
      }, {
        title: '标准错误码',
        dataIndex: 'standardErrorCode',
        key: 'standardErrorCode',
        width:'10%',
      }, {
        title: '标准错误信息',
        dataIndex: 'standardErrorCodeDesc',
        key: 'standardErrorCodeDesc',
        width:'15%',
      }, {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '10%',
        render:(record) => {
          const { id } = record;
          return (
            <div className={styles.options}>
              <Button size='small' type="primary" onClick={() => dispatch({ type:'codeMap/pushRouter',payload:{ pathname:`${INDEX_CODE_MAP}/editMap`, search:{ id } }})}>编辑</Button>
              <Popconfirm placement="topRight" title="请确认是否删除?" onConfirm={this.deleteCode.bind(this,id)} okText="确认" cancelText="取消">
                <Button size="small" type="danger">删除</Button>
              </Popconfirm>
            </div>
          )
        }
      }
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      rowKey:'id',
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(cur, currentSize) {
          dispatch({
            type: 'codeMap/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'codeMap/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
      },
    };

    return (
      <div className={styles.content}>
        <FilterPage {...filterProps} />
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'codeMap/pushRouter',payload:{ pathname:`${INDEX_CODE_MAP}/addMap`} })}>新增</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
