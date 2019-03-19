import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, InputNumber, DatePicker, LocaleProvider, Icon, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './behavior.less'
import { INDEX_REPORT_BEHAVIOR_DETAIL } from '@utils/pathIndex';
import moment from 'moment'
import Decrypt from '@components/HOC/decrypt/decrypt'
const { RangePicker } = DatePicker;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {behavior:state.behavior}
}
@connect(mapStateToProps)
@Decrypt('behavior')
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
    dispatch({ type: 'behavior/save', payload: { filter:submitData } });
    dispatch({ type: 'behavior/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'behavior/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'behavior/exportBehaviorList' })
  }

  goInfo = (id) => {
    const { dispatch } = this.props
    dispatch({ type:'behavior/pushRouter',payload:{ pathname:INDEX_REPORT_BEHAVIOR_DETAIL, search:{ id } }})
  }

  render() {
    const { loading, filter, pagination,teamList,isShowExport } = this.props.behavior;
    const { dispatch } = this.props;
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '办理入住时间',
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
        key: 'guestName',
        label: '姓名',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写姓名',
          component: Input,
        },
      }, 
      {
        key: 'cikCheckinOrderId',
        label: '入住单id',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写入住单id',
          component: Input,
        },
      }, 
      {
        key: 'startOperateNumber',
        label: 'trace起始值',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        fieldAdapter: {
          min:0,
          component: InputNumber,
        },
      }, 
      {
        key: 'endOperateNumber',
        label: 'trace结束值',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        fieldAdapter: {
          min:0,
          component: InputNumber,
        },
      }, 
      
    ];

    /* table列表*/
    const columns = [
      { title:'入住单号', dataIndex: 'id', key: 'id', fixed: 'left', width: 100,},
      { title: '办理入住时间', dataIndex: 'createTime', key: 'createTime',fixed: 'left',
      width: 100,  render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      { title:'姓名', dataIndex: 'guestName', key: 'guestName', fixed: 'left', width: 100,},
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName'}, 
      { title:'是否办理成功', dataIndex: 'isMakeCardSuccess', key: 'isMakeCardSuccess', render: text=>{
        return text?'是':'否'
      }}, 
      { title:'是否checkin成功', dataIndex: 'isCheckinSuccess', key: 'isCheckinSuccess', render: text=>{
        return text?'是':'否'
      }}, 
      { title:'扫身份证时长（秒）', dataIndex: 'idCardTime', key: 'idCardTime'},
      { title:'刷脸时长（秒）', dataIndex: 'scanFaceTime', key: 'scanFaceTime'},
      { title:'用户查询订单时长（秒）', dataIndex: 'queryOrderStayTime', key: 'queryOrderStayTime'},
      { title:'系统查询订单时长（秒）', dataIndex: 'queryOrderTime', key: 'queryOrderTime'},
      { title:'支付时长（秒）', dataIndex: 'payTime', key: 'payTime'},
      { title:'预约时长（秒）', dataIndex: 'reservationTime', key: 'reservationTime'},
      { title:'添加同住人时长（秒）', dataIndex: 'addPartnerTime', key: 'addPartnerTime'},
      { title:'选房时长（秒）', dataIndex: 'selectRoomTime', key: 'selectRoomTime'},
      { title:'选房特征', dataIndex: 'roomType', key: 'roomType'},
      { title:'办理入住总时长（秒）', dataIndex: 'totalTime', key: 'totalTime'},
      { title:'办理入住净时长（秒）', dataIndex: 'relativeTime', key: 'relativeTime'},
      { title:'办理入住次数', dataIndex: 'handleNumber', key: 'handleNumber'},
      {
        title:'操作',
        dataIndex: 'x',
        key: 'x',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          const { id } = record
          return (
              <Button size="small" onClick={ this.goInfo.bind(this,id) } type='primary'>详情</Button>
          )
        }
      },
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset:this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      rowKey:'id',
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'behavior/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'behavior/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
      },
      scroll:{ x: 2000 }
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
        {!isShowExport && <span>（只能导出办理日期一年内数据，每次只能导出500条）</span> } 
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
