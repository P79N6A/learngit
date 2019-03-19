import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, DatePicker, Select, LocaleProvider, Icon, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './matchRule.less'
import { INDEX_MATCH_RULE } from '@utils/pathIndex'
import moment from 'moment'
const { RangePicker } = DatePicker;
const Option = Select.Option;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return { matchRule:state.matchRule }
}
@connect(mapStateToProps)
export default class matchRule extends Component {

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
    dispatch({ type: 'matchRule/save', payload: { filter:submitData } });
    dispatch({ type: 'matchRule/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'matchRule/save', payload: { filter:{} } });
  }

  deleteMatch = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'matchRule/deleteMatchRule', payload:{ id } })
  }

  changeStatus = (id,status) => {
    const { dispatch } = this.props;
    dispatch({ type:'matchRule/forbindMatchRule', payload:{ id,status } })
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.matchRule;
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
        key: 'matchRuleType',
        label: '规则类型',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写规则类型',
          component: Input,
        },
      }, 
      {
        key: 'matchRuleDesc',
        label: '规则描述',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写规则描述',
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
    ];

    /* table列表*/
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:'20%',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, {
        title: '规则类型',
        dataIndex: 'matchRuleType',
        key: 'matchRuleType',
        width:'20%',
      }, {
        title: '规则描述',
        dataIndex: 'matchRuleDesc',
        key: 'matchRuleDesc',
        width:'20%',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width:'20%',
        render: text => {
          if(text === 1) return <span>可用</span>
          if(text === 0) return <span>不可用</span>
        }
      },
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
            type: 'matchRule/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'matchRule/queryBaseData',
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
        {/* <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'matchRule/pushRouter',payload:{ pathname:`${INDEX_MATCH_RULE}/addMatch`} })}>新增</Button>
        </div> */}
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
