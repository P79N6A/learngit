import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, LocaleProvider, Icon, Select, message } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import { INDEX_LOGOM_DAY } from '@utils/pathIndex'
import styles from './dayLog.less'
import moment from 'moment'
import { _jsonParse } from '@utils/tools'
import { ENUM_OBJ } from '@utils/enums'
import Decrypt from '@components/HOC/decrypt/decrypt'
const { Option } = Select;
const { RangePicker } = DatePicker;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {dayLog:state.dayLog}
}
@connect(mapStateToProps)
@Decrypt('dayLog')
export default class Day extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    Object.keys(fields).map((key) => {
      if (key === 'date' && fields[key] && fields[key].length > 0) {
        submitData = {
          ...submitData,
          checkInStartTime: fields[key][0].format('YYYY-MM-DD HH:mm:ss'),
          checkInEndTime: fields[key][1].format('YYYY-MM-DD HH:mm:ss'),
        }
      } else if((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }

    });
    const checkInStartTimes = new Date(submitData.checkInStartTime).getTime()
    const checkInEndTimes = new Date(submitData.checkInEndTime).getTime()
    if(checkInStartTimes == checkInEndTimes) {
      message.error('起始时间不得等于终止时间')
      return;
    }
    dispatch({ type: 'dayLog/save', payload: { filter:submitData } });
    dispatch({ type: 'dayLog/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'dayLog/save', payload: { filter:{} } });
  }

  //步骤类表
  getStepList = () => {
    const { checkinStep } = this.props.dayLog;
    if(checkinStep) {
        const checkinStepSe =  [].concat([{ code:'', description:'全部' }],checkinStep)
        return checkinStepSe.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  //状态列表
  getStatusList = () => {
    const { checkinStatus } = this.props.dayLog;
    if(checkinStatus) {
        const checkinStatusSe =  [].concat([{ code:'', description:'全部' }],checkinStatus)
        return checkinStatusSe.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  render() {
    const { loading, filter, pagination, teamList, checkinStep, checkinStatus } = this.props.dayLog;
    const { dispatch } = this.props;
    const toolTipDom = (text) => (
      <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '入住时间范围',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
        },
      },
      {
        key: 'name',
        label: '入住人姓名',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写入住人姓名',
          component: Input,
        },
      },
      {
        key: 'phone',
        label: '入住人电话',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写入住人电话',
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
      {
        key: 'checkInStep',
        label: '入住单步骤',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getStepList(),
        fieldAdapter: {
          component: Select,
        },
      },
      {
        key: 'checkInStatus',
        label: '入住单状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getStatusList(),
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '办理入住日期',
        dataIndex: 'checkinDate',
        key: 'checkinDate',
        width:'10%',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD')}</p>
          )
        }
      },
      {
        title: '入住人姓名',
        dataIndex: 'name',
        key: 'name',
        width:'10%',
      },
      {
        title: '入住人身份证',
        dataIndex: 'guestIdCard',
        key: 'guestIdCard',
        width:'6%',
        render:text => {
          return (
            this.modalDom(text)
          )
        }
      },
      {
        title: '入住人电话',
        dataIndex: 'guestPhone',
        key: 'guestPhone',
        width:'6%',
        render:text => {
          return (
            this.modalDom(text)
          )
        }
      },
      {
        title:'酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
        width:'10%',
      },
      {
        title:'入住单步骤',
        dataIndex: 'checkinStep',
        key: 'checkinStep',
        width:'10%',
        render:text => {
          return ENUM_OBJ(checkinStep)[text]
        }
      },
      {
        title:'入住单状态',
        dataIndex: 'checkinStatus',
        key: 'checkinStatus',
        width:'10%',
        render:text => {
          return ENUM_OBJ(checkinStatus)[text]
        }
      },
      {
        title:'入住天数',
        dataIndex: 'nightNumber',
        key: 'nightNumber',
        width:'5%',
        render:text => {
          return text || 0
        }
      },
      {
        title:'是否办理成功',
        dataIndex: 'status',
        key: 'status',
        width:'10%',
        render:text => {
          if(text) {
            return <span>是</span>
          } else {
            return <span>否</span>
          }
        }
      },
      {
        title:'失败原因',
        dataIndex: 'errorMsg',
        key: 'errorMsg',
        width:'5%',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      },
      {
        title:'入住单流水id',
        dataIndex: 'id',
        key: 'id',
        width:'5%',
        render: (text, record) => {
          const { testFlag } = record
          return (
              testFlag?null:
              <Button onClick={() => dispatch({ type:'dayLog/pushRouter',payload:{ pathname:`${INDEX_LOGOM_DAY}/detail`, search:{ id:text } }})} type='primary'>详情</Button>
          )
        }
      },
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, dataArr:[{ dateName:'date',areaName:['checkInStartTime','checkInEndTime'] }], filter, onReset: this.onReset };
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
            type: 'dayLog/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'dayLog/queryBaseData',
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
