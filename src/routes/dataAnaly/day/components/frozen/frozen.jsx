import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Popconfirm, DatePicker, LocaleProvider, Select } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './frozen.less'
import TitleTab from './titleTab'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {day:state.day}
}
@connect(mapStateToProps)
export default class Frozen extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'day/save',payload:{ isShowExport:false } })
    Object.keys(fields).map((key) => {
      if (key === 'date' && fields[key] && fields[key].length > 0) {
        submitData = {
          ...submitData,
          startTime: fields[key][0].format('YYYY-MM-DD'),
          endTime: fields[key][1].format('YYYY-MM-DD'),
        }
      } else if((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
      
    });
    dispatch({ type: 'day/save', payload: { filter:submitData } });
    dispatch({ type: 'day/queryBaseData', payload: { ...submitData, queryType:2 } });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'day/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'day/exportDayList' })
  }

  render() {
    const { loading, filter, pagination,teamList, isShowExport, dailySummaryVO } = this.props.day;
    const { dispatch } = this.props;
    const priceDom = (num) => {
      return num?<span className={ styles.price }>{ num=='0.00'?0:num }</span>:<span className={ styles.price }>0</span>
    }
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '办理日期范围',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: [ moment().subtract(1,'days'), moment().subtract(1,'days') ] },
        fieldAdapter: {
          format: "YYYY-MM-DD",
          component: RangePicker,
          disabledDate : (current) => {
            return (current && current > moment().endOf('day')) || (current && current < moment().subtract(365,'day'));
          }
        },
      }, 
      {
        key: 'hotelName',
        label: '酒店名称',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写酒店名称',
          component: Input,
        },
      }, 
      {
        key: 'queryCondition',
        label: '查询条件',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="0">明细</Option>,
          <Option key="3" value="1">汇总</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      { title: '办理日期', dataIndex: 'checkInDate', key: 'checkInDate',
      width: '20%', }, 
      {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
        width: '20%',
      }, 
      {
        title: '总冻结金额',
        dataIndex: 'totalFrozenAmount',
        key: 'totalFrozenAmount',
        width: '10%',
      }, 
      {
        title: '预授权冻结金额',
        dataIndex: 'totalPreFrozenAmount',
        key: 'totalPreFrozenAmount',
        width: '10%',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '线下信用住冻结金额',
        dataIndex: 'totalOfflineFrozenAmount',
        key: 'totalOfflineFrozenAmount',
        width: '10%',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '线上信用住冻结金额',
        dataIndex: 'totalOnlineFrozenAmount',
        key: 'totalOnlineFrozenAmount',
        width: '10%',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '成功预订总房费',
        dataIndex: 'bookingSuccTotalRoomPrice',
        key: 'bookingSuccTotalRoomPrice',
        width: '10%',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '预订总房费',
        dataIndex: 'bookingTotalRoomPrice',
        key: 'bookingTotalRoomPrice',
        width: '10%',
        render:text => {
          return text || 0
        }
      }, 
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset:this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(cur, currentSize) {
          dispatch({
            type: 'day/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
              queryType:2
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'day/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
              queryType:2
            },
          })
        },
      },
    };
    return (
      <div className={styles.content}>
        <FilterPage {...filterProps} />
        { dailySummaryVO&& <TitleTab data={ dailySummaryVO }/> }
        {
          isShowExport?(
            <Popconfirm placement="topLeft" className={ styles.export } title="确认是否导出?" onConfirm={this.exportData} okText="确认" cancelText="取消">
              <Button type={ 'primary' }>导出数据</Button>
            </Popconfirm>
          ):(
            <Button className={ styles.export } disabled={ true} type={ 'default' }>导出数据</Button>
          )
        }
        {!isShowExport && <span>（只能导出办理日期一年内数据）</span> } 
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
