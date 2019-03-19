import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, LocaleProvider, Icon, Select, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/workOrder'
import styles from './implement.less'
import { ENUM_ORDER_STATUS, ENUM_LIST } from '@utils/enums'
import { INDEX_WORKORDER_IMPLEMENT } from '@utils/pathIndex';
import moment from 'moment'
const { RangePicker } = DatePicker;
const { Option } = Select;
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {implement:state.implement}
}
@connect(mapStateToProps)
export default class Day extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'implement/save',payload:{ isShowExport:false } })
    
    Object.keys(fields).map((key) => {
      if (['gmtCreate','orderExpectTime','orderFinishTime','onlineTime'].includes(key) && fields[key] && fields[key].length > 0) {
        submitData = {
          ...submitData,
          [`${key}Start`]: fields[key][0].format('YYYY-MM-DD'),
          [`${key}End`]: fields[key][1].format('YYYY-MM-DD'),
        }
      } else if((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
      
    });
    dispatch({ type: 'implement/save', payload: { filter:submitData } });
    dispatch({ type: 'implement/getimplementList', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'implement/save', payload: { filter:{} } });
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.implement;
    const { dispatch } = this.props;
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'orderId',
        label: '工单号',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写工单号',
          component: Input,
        },
      }, 
      {
        key: 'orderStatus',
        label: '工单状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: ENUM_LIST(ENUM_ORDER_STATUS,true).map((v,n)=>{
            return <Option key={ n } value={ v.code }>{ v.description }</Option>
          }),
        fieldAdapter: {
          component: Select,
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
        key: 'deviceName',
        label: '设备',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写设备',
          component: Input,
        },
      },
      {
        key: 'cardCreater',
        label: '制卡写卡器',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写制卡写卡器',
          component: Input,
        },
      },
      {
        key: 'cardReader',
        label: '读卡器',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写读卡器',
          component: Input,
        },
      },
      {
        key: 'cardProvider',
        label: '发卡器',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写发卡器',
          component: Input,
        },
      },
      {
        key: 'tourismSystem',
        label: '旅业系统',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写旅业系统',
          component: Input,
        },
      },
      {
        key: 'pms',
        label: 'PMS',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写PMS',
          component: Input,
        },
      },
      {
        key: 'creator',
        label: '创建人',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写创建人',
          component: Input,
        },
      },
      {
        key: 'gmtCreate',
        label: '创建时间',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          format: "YYYY-MM-DD",
          component: RangePicker,
        },
      }, 
      {
        key: 'orderExpectTime',
        label: '要求实施完成日期',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          format: "YYYY-MM-DD",
          component: RangePicker,
        },
      }, 
      {
        key: 'orderFinishTime',
        label: '实际实施完成日期',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          format: "YYYY-MM-DD",
          component: RangePicker,
        },
      }, 
      {
        key: 'onlineTime',
        label: '上线日期',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          format: "YYYY-MM-DD",
          component: RangePicker,
        },
      }, 
    ];

    /* table列表*/
    const columns = [
      { title:'工单号', dataIndex: 'orderId', key: 'orderId', fixed: 'left',
      width: 100, render:text=> {
        return <Button type="primary" size="small" onClick={() => dispatch({ type:'implement/pushRouter',payload:{ pathname:`${INDEX_WORKORDER_IMPLEMENT}/detail`, search:{ orderId:text} }})} >{ text }</Button>
      }},
      { title:'工单状态', dataIndex: 'orderStatusDesc', key: 'orderStatusDesc', fixed: 'left',
      width: 100 },
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName' },
      { title:'酒店ID', dataIndex: 'hotelId', key: 'hotelId' },
      { title:'设备', dataIndex: 'deviceName', key: 'deviceName' },
      { title:'制卡写卡器', dataIndex: 'cardCreater', key: 'cardCreater' },
      { title:'读卡器', dataIndex: 'cardReader', key: 'cardReader' },
      { title:'发卡器', dataIndex: 'cardProvider', key: 'cardProvider' },
      { title:'旅业系统', dataIndex: 'tourismSystem', key: 'tourismSystem' },
      { title:'PMS', dataIndex: 'pms', key: 'pms' },
      { title: '要求实施完成时间', dataIndex: 'orderExpectTime', key: 'orderExpectTime', render: text => {
          return (
            text?<p>{moment(text).format('YYYY-MM-DD')}</p>:'暂无'
          )
        }
      }, 
      { title: '实际实施完成时间', dataIndex: 'orderFinishTime', key: 'orderFinishTime', render: text => {
          return (
            text?<p>{moment(text).format('YYYY-MM-DD')}</p>:'暂无'
          )
        }
      }, 
      { title:'创建人', dataIndex: 'creator', key: 'creator' },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', render: text => {
          return (
            text?<p>{moment(text).format('YYYY-MM-DD')}</p>:'暂无'
          )
        }
      }, 
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onReset:this.onReset, onFilterSubmit: this.onFilterSubmit, filter };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      rowKey:'orderId',
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'implement/getimplementList',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'implement/getimplementList',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
      },
      scroll:{ x: 2500 }
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
