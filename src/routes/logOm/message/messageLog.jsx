import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Input, Table, DatePicker, LocaleProvider, Button, Tooltip, Icon } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './messageLog.less'
import moment from 'moment'
import Decrypt from '@components/HOC/decrypt/decrypt'
import { _jsonParse } from '@utils/tools'
const { RangePicker } = DatePicker;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {messageLog:state.messageLog}
}
@connect(mapStateToProps)
@Decrypt('messageLog')
export default class Day extends Component {

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
    const startTimes = new Date(submitData.startTime).getTime()
    const endTimes = new Date(submitData.endTime).getTime()
    if(startTimes == endTimes) {
      message.error('起始时间不得等于终止时间')
      return;
    }
    dispatch({ type: 'messageLog/save', payload: { filter:submitData } });
    dispatch({ type: 'messageLog/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'messageLog/save', payload: { filter:{} } });
  }

  render() {
    const { loading, filter, pagination, teamList } = this.props.messageLog;
    const { dispatch } = this.props
    const toolTipDom = (text) => (
      <Tooltip className={ styles.tooltip } title={ text?<div className={styles.toolTip}>{text}</div>:'没有信息' }>
        <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '发送时间',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
          disabledDate : (current) => {
            return (current && current > moment().endOf('day')) || (current && current < moment().subtract(365,'day'));
          }
        },
      },
      {
        key: 'phoneNumber',
        label: '手机号码',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写手机号码',
          component: Input,
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
    ];

    /* table列表*/
    const columns = [
      { title:'创建时间', dataIndex: 'createTime', key: 'createTime', width:'20%',
      render: text => {
        return (
          <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
        )
      }},
      { title:'手机号码', dataIndex: 'guestPhone', key: 'guestPhone', width:'20%',
        render:text => {
          return (
            this.modalDom(text)
          )
        }},
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName', width:'20%'},
      { title:'短信内容', dataIndex: 'messageBody', key: 'messageBody', width:'20%',
        render:text => {
          return (
            toolTipDom(text)
          )
        }},
      { title:'发送状态', dataIndex: 'status', key: 'status', width:'20%',
        render:text => {
          return text?'成功':'失败'
        }},
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'messageLog/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'messageLog/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
      },
    };

    return (
      <div className={styles.content}>
        <FilterPage {...filterProps} />
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
