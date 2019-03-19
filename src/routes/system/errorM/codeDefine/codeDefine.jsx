import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, Select, LocaleProvider, Icon, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './codeDefine.less'
import { INDEX_CODE_DEFINE } from '@utils/pathIndex'

const Option = Select.Option;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return { codeDefine:state.codeDefine, common:state.common }
}
@connect(mapStateToProps)
export default class codeDefine extends Component {

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
    dispatch({ type: 'codeDefine/save', payload: { filter:submitData } });
    dispatch({ type: 'codeDefine/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'codeDefine/save', payload: { filter:{} } });
  }

  changeStatus = (id, status) => {
    const { dispatch } = this.props;
    dispatch({ type:'codeDefine/updateCode', payload:{ id, status } })
  }

  //获取配置类型
  getPartsList = () => {
    const { typeLists } = this.props.common;
    if(typeLists && typeLists.typeList) {
        const partsListSe =  [].concat([{ code:'', description:'全部' }],typeLists.typeList)
        return partsListSe.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.codeDefine;
    const { dispatch } = this.props;
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'standardErrorCode',
        label: '错误码',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写错误码',
          component: Input,
        },
      }, 
      {
        key: 'standardErrorCodeDesc',
        label: '错误描述',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写错误描述',
          component: Input,
        },
      }, 
      {
        key: 'status',
        label: '状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="1">可用</Option>,
          <Option key="3" value="0">不可用</Option>
        ],
        fieldAdapter: {
          component: Select,
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
      }, {
        title: '错误名称',
        dataIndex: 'standardErrorCodeName',
        key: 'standardErrorCodeName',
        width:'20%',
      }, {
        title: '错误码',
        dataIndex: 'standardErrorCode',
        key: 'standardErrorCode',
        width:'20%',
      }, {
        title: '错误描述',
        dataIndex: 'standardErrorCodeDesc',
        key: 'standardErrorCodeDesc',
        width:'20%',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width:'10%',
        render: text => {
          if(text === 1) return <span>可用</span>
          if(text === 0) return <span>不可用</span>
        }
      }, {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '20%',
        render:(record) => {
          const { id, status } = record;
          return (
            <div className={styles.options}>
              <Button size='small' type="primary" onClick={() => dispatch({ type:'codeDefine/pushRouter',payload:{ pathname:`${INDEX_CODE_DEFINE}/editDefine`, search:{ id } }})}>编辑</Button>
              {
                status === 0? (//不可用
                  <Popconfirm placement="topRight" title="请确认是否启用?" onConfirm={this.changeStatus.bind(this,id,1)} okText="确认" cancelText="取消">
                    <Button size="small" type="primary">启用</Button>
                  </Popconfirm>
                ):(
                  <Popconfirm placement="topRight" title="请确认是否禁用?" onConfirm={this.changeStatus.bind(this,id,0)} okText="确认" cancelText="取消">
                    <Button size="small" type="danger">禁用</Button>
                  </Popconfirm>
                )
              }
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
            type: 'codeDefine/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'codeDefine/queryBaseData',
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
          <Button type="primary" onClick={() => dispatch({type:'codeDefine/pushRouter',payload:{ pathname:`${INDEX_CODE_DEFINE}/addDefine`} })}>新增</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
