import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, LocaleProvider, Icon, Select, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './order.less'
import moment from 'moment'
import Decrypt from '@components/HOC/decrypt/decrypt'
const { RangePicker } = DatePicker;
const { Option } = Select;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {orderOld:state.orderOld}
}
@connect(mapStateToProps)
@Decrypt('orderOld')
export default class Order extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'orderOld/save',payload:{ isShowExport:false } })
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
    dispatch({ type: 'orderOld/save', payload: { filter:submitData } });
    dispatch({ type: 'orderOld/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'orderOld/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'orderOld/exportOrderList' })
  }

  render() {
    const { loading, filter, pagination,teamList,isShowExport } = this.props.orderOld;
    const { dispatch } = this.props;
    const toolTipDom = (text) => (
      <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )
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
        key: 'tid',
        label: '订单号',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写订单号',
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
        key: 'phone',
        label: '手机号码',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写手机号码',
          component: Input,
        },
      }, 
      {
        key: 'state',
        label: '订单状态',//1:办理入住成功（成功是指吐卡成功）、2:办理入住失败、3:已结算、0:放弃
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="1">办理入住成功</Option>,
          <Option key="3" value="0">办理入住失败</Option>,
          <Option key="5" value="2">放弃</Option>,
          <Option key="6" value="3">结算</Option>,
        ],
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      { title: '办理入住日期', dataIndex: 'checkinDate', key: 'checkinDate',fixed: 'left',
      width: 100, render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName', fixed: 'left',
      width: 100},
      { title:'酒店订单号', dataIndex: 'pmsOrderId', key: 'pmsOrderId'}, 
      { title:'外部订单号', dataIndex: 'tid', key: 'tid'}, 
      { title:'订单状态', dataIndex: 'state', key: 'state' },
      { title:'预订总房费', dataIndex: 'bookTotalPrice', key: 'bookTotalPrice',render:text => {
        return priceDom(text)
      }},
      { title:'冻结金额', dataIndex: 'freezingAmount', key: 'freezingAmount',render:text => {
        return priceDom(text)
      }},
      { title:'结算总房费', dataIndex: 'settleTotalRoomPrice', key: 'settleTotalRoomPrice',render:text => {
        return priceDom(text)
      }},
      { title:'结算总杂费', dataIndex: 'settleTotalExtraPrice', key: 'settleTotalExtraPrice',render:text => {
        return priceDom(text)
      }},
      { title:'预定间夜', dataIndex: 'bookRoomNight', key: 'bookRoomNight', render:text => {
        return text?text:0
      }},
      { title:'结算间夜', dataIndex: 'settleRoomNight', key: 'settleRoomNight', render:text => {
        return text?text:0
      }},
      { title:'入住天数', dataIndex: 'stayDays', key: 'stayDays', render:text => {
        return text?text:0
      }},
      { title:'同住人人数', dataIndex: 'roommateNumber', key: 'roommateNumber',render:text => {
        return text || 0
      }},
      { title:'主入住人姓名', dataIndex: 'name', key: 'name' },
      { title:'是否新签约', dataIndex: 'isNewSigned', key: 'isNewSigned' },
      { title:'是否是飞猪信用住订单', dataIndex: 'isFliggyOrder', key: 'isFliggyOrder' },
      { title:'支付类型', dataIndex: 'payType', key: 'payType' },
      { title:'支付状态', dataIndex: 'payStatus', key: 'payStatus' },
      { title:'PMS', dataIndex: 'pmsName', key: 'pmsName',},
      { title:'手机号', dataIndex: 'phone', key: 'phone', render: text => {
        return this.modalDom(text)
      }},
      { title:'入住人省份', dataIndex: 'buyerProvince', key: 'buyerProvince',  },
      { title:'入住人城市', dataIndex: 'buyerCity', key: 'buyerCity',  },
      { title:'入住人出生年份', dataIndex: 'buyerBornYear', key: 'buyerBornYear' }, 
      { title:'标准酒店ID', dataIndex: 'fhHid', key: 'fhHid',  },
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
            type: 'orderOld/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'orderOld/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
      },
      scroll:{ x: 2800 }
    };

    return (
      <div className={styles.content}>
        <FilterPage {...filterProps} />
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
