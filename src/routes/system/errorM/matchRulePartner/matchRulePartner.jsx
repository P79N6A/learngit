import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, DatePicker, Select, LocaleProvider, Icon, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './matchRulePartner.less'
import { INDEX_MATCH_RULE_PARTNER } from '@utils/pathIndex'
import moment from 'moment'
const { RangePicker } = DatePicker;
const Option = Select.Option;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return { matchRulePartner:state.matchRulePartner }
}
@connect(mapStateToProps)
export default class matchRulePartner extends Component {

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
    dispatch({ type: 'matchRulePartner/save', payload: { filter:submitData } });
    dispatch({ type: 'matchRulePartner/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'matchRulePartner/save', payload: { filter:{} } });
  }

  deleteMatch = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'matchRulePartner/deleteMatchRulePartner', payload:{ id } })
  }
  changeStatus = (id,status) => {
    const { dispatch } = this.props;
    dispatch({ type:'matchRulePartner/updateMatchRulePartner', payload:{ id, status } })
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.matchRulePartner;
    const { dispatch } = this.props;
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '创建范围',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
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
    ];

    /* table列表*/
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:'16%',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, {
        title: '规则类型',
        dataIndex: 'matchRuleType',
        key: 'matchRuleType',
        width:'11%',
      }, {
        title: '合作伙伴',
        dataIndex: 'partnerName',
        key: 'partnerName',
        width:'11%',
      }, 
      {
        title: '合作伙伴产品名称',
        dataIndex: 'productName',
        key: 'productName',
        width:'10%',
      }, 
      {
        title: '匹配关键字',
        dataIndex: 'matchKeywords',
        key: 'matchKeywords',
        width:'16%',
      }, {
        title: '标准错误码',
        dataIndex: 'standardErrorCode',
        key: 'standardErrorCode',
        width:'8%',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width:'8%',
        render: text => {
          if(text === 1) return <span>可用</span>
          if(text === 0) return <span>不可用</span>
        }
      }, {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '16%',
        render:(record) => {
          const { id, status } = record;
          return (
            <div className={styles.options}>
              <Button size='small' type="primary" onClick={() => dispatch({ type:'matchRulePartner/pushRouter',payload:{ pathname:`${INDEX_MATCH_RULE_PARTNER}/editMatchPartner`, search:{ id } }})}>编辑</Button>
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
              <Popconfirm placement="topRight" title="请确认是否删除?" onConfirm={this.deleteMatch.bind(this,id)} okText="确认" cancelText="取消">
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
            type: 'matchRulePartner/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'matchRulePartner/queryBaseData',
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
          <Button type="primary" onClick={() => dispatch({type:'matchRulePartner/pushRouter',payload:{ pathname:`${INDEX_MATCH_RULE_PARTNER}/addMatchPartner`} })}>新增</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
