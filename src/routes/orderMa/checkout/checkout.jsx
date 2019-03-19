import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, LocaleProvider, Icon, Select, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './checkout.less'
import moment from 'moment'
const { RangePicker } = DatePicker;
const { Option } = Select;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {checkout:state.checkout}
}
@connect(mapStateToProps)
export default class Day extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'checkout/save',payload:{ isShowExport:false } })
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
    dispatch({ type: 'checkout/save', payload: { filter:submitData } });
    dispatch({ type: 'checkout/getCheckoutList', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'checkout/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'checkout/exportPeopleList' })
  }

  render() {
    const { loading, filter, pagination,teamList,isShowExport } = this.props.checkout;
    const { dispatch } = this.props;
    const toolTipDom = (text,content) => (
      <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>{ content || '详情' }<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '离店日期',
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
        key: 'pmsOrderId',
        label: 'PMS订单号',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写PMS订单号',
          component: Input,
        },
      }, 
      {
        key: 'name',
        label: '姓名',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写姓名',
          component: Input,
        },
      }, 
      {
        key: 'isSuccess',
        label: '离店结果',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="1">成功</Option>,
          <Option key="3" value="0">失败</Option>,
          <Option key="4" value="2">放弃</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
      {
        key: 'walkOutType',
        label: '离店类型',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="2">信用住</Option>,
          <Option key="3" value="1">非信用住</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      { title: '办理离店日期', dataIndex: 'checkOutDate', key: 'checkOutDate', render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      { title:'pms订单号', dataIndex: 'pmsOrderId', key: 'pmsOrderId' },
      { title:'姓名', dataIndex: 'name', key: 'name'  },
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName' },
      { title:'酒店id', dataIndex: 'fhHid', key: 'fhHid' },
      { title:'房号', dataIndex: 'roomNumber', key: 'roomNumber' }, 
      { title:'退房类型', dataIndex: 'checkOutType', key: 'checkOutType' }, 
      { title:'是否办理成功', dataIndex: 'isSuccess', key: 'isSuccess' }, 
      { title:'是否psb上传成功', dataIndex: 'psbStatus', key: 'psbStatus' }, 
      { title:'办理时长', dataIndex: 'dealDuration', key: 'dealDuration' }, 
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, onReset:this.onReset };
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
            type: 'checkout/getCheckoutList',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'checkout/getCheckoutList',
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
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
