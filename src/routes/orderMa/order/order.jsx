import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, LocaleProvider, Icon, Select, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './order.less'
import moment from 'moment'
import Decrypt from '@components/HOC/decrypt/decrypt'
import { ENUM_ERROR_FAIL, ENUM_ERROR_ABANDON, ENUM_LIST } from '@utils/enums'
const { RangePicker } = DatePicker;
const { Option } = Select;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {order:state.order}
}
@connect(mapStateToProps)
@Decrypt('order')
export default class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nowErrorList:[]
    }
  }

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'order/save',payload:{ isShowExport:false } })
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
    dispatch({ type: 'order/save', payload: { filter:submitData } });
    dispatch({ type: 'order/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'order/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'order/exportOrderList' })
  }

  selectState = (v) => {
    console.log(v)
    if(v === 0) {//失败
      this.setState({
        nowErrorList:ENUM_ERROR_FAIL
      })
    } else if(v === 2) {//放弃
      this.setState({
        nowErrorList:ENUM_ERROR_ABANDON
      })
    } else {
      this.setState({
        nowErrorList:[]
      })
    }
  }

  render() {
    const { nowErrorList } = this.state
    const { loading, filter, pagination,teamList,isShowExport } = this.props.order;
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
        key: 'pmsOrderId',
        label: 'pms订单号',
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
        key: 'checkInOrderId',
        label: '入住单Id',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写入住单Id',
          component: Input,
        },
      }, 
      {
        key: 'state',
        label: '办理结果',//1:办理入住成功（成功是指吐卡成功）、2:办理入住失败、3:已结算、0:放弃
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value={ '' }>全部</Option>,
          <Option key="2" value={ 1 }>成功</Option>,
          <Option key="3" value={ 0 }>失败</Option>,
          <Option key="4" value={ 2 }>放弃</Option>,
        ],
        fieldAdapter: {
          component: Select,
          onSelect:this.selectState,
        },
      },
      {
        key: 'failureReason',
        label: '失败原因',
        span: 8,
        formItemLayout,
        isShow:nowErrorList.length == 0?true:false,
        fieldOption: { initialValue: '' },
        option: ENUM_LIST(nowErrorList,true).map((v,n)=>{
          return <Option key={ n } value={ v.code }>{ v.description }</Option>
        }),
        fieldAdapter: {
          component: Select,
        },
      },
      {
        key: 'isNewSigned',
        label: '是否新签约',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key={ 1 } value={ '' }>请选择</Option>,
          <Option key={ 2 } value={ 1 }>是</Option>,
          <Option key={ 3 } value={ 0 }>否</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      { title:'入住单id', dataIndex: 'checkInOrderId', key: 'checkInOrderId', fixed: 'left',
      width: 100},
      { title: '办理入住日期', dataIndex: 'checkinDate', key: 'checkinDate',fixed: 'left',
      width: 100, render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName', fixed: 'left',
      width: 100},
      { title:'入住人姓名', dataIndex: 'name', key: 'name', fixed: 'left',
      width: 100},
      { title:'入住人数', dataIndex: 'guestNumber', key: 'guestNumber'},
      { title:'预订天数', dataIndex: 'bookRoomDays', key: 'bookRoomDays'},
      { title:'结算天数', dataIndex: 'settleRoomDays', key: 'settleRoomDays'},
      { title:'办理结果', dataIndex: 'success', key: 'success'},
      { title:'失败/放弃原因', dataIndex: 'failureReason', key: 'failureReason', render: text => {
        return toolTipDom(text)
      }},
      { title:'pms订单号', dataIndex: 'pmsOrderId', key: 'pmsOrderId'}, 
      { title:'外部交易单号', dataIndex: 'tid', key: 'tid'}, 
      { title:'预订总房费', dataIndex: 'bookingTotalRoomPrice', key: 'bookingTotalRoomPrice',render:text => {
        return priceDom(text)
      }},
      { title:'冻结金额', dataIndex: 'freezingAmount', key: 'freezingAmount',render:text => {
        return priceDom(text)
      }},
      { title:'结算金额', dataIndex: 'settleAmount', key: 'settleAmount',render:text => {
        return priceDom(text)
      }},
      { title:'支付类型', dataIndex: 'payType', key: 'payType' },
      { title:'支付状态', dataIndex: 'payStatus', key: 'payStatus' },
      { title:'是否新签约', dataIndex: 'isNewSigned', key: 'isNewSigned' },
      { title:'PMS', dataIndex: 'pmsName', key: 'pmsName' },
      { title:'标准酒店id', dataIndex: 'fhHid', key: 'fhHid' },
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
            type: 'order/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'order/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
      },
      scroll:{ x: 2100 }
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
