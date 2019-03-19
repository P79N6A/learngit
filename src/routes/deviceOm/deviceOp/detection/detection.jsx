import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Row, Col, Table, DatePicker, LocaleProvider, Button, Divider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './detection.less'
import moment from 'moment'
import { _jsonParse } from '@utils/tools'
const { RangePicker } = DatePicker;
let timeCallBack = null
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {detection:state.detection}
}
@connect(mapStateToProps)
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
    dispatch({ type: 'detection/save', payload: { filter:submitData } });
    dispatch({ type: 'detection/queryAppDetection', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'detection/save', payload: { filter:{} } });
  }

  sendAppDetectionCommand = () => {
    const { dispatch } = this.props
    let { isSend } = this.props.detection
    if(isSend) return
    dispatch({ type:'detection/sendAppDetectionCommand' })
    //60倒计时
    clearInterval(timeCallBack)
    this.timeBack()
  }

  timeBack() {
    const { dispatch } = this.props
    dispatch({ type:'detection/save', payload:{ isSend:true } })
    timeCallBack = setInterval(() => {
      let { sendTime } = this.props.detection
      sendTime--
      if(sendTime<=0) {
        clearInterval(timeCallBack)
        dispatch({ type:'detection/save', payload:{ sendTime:60,isSend:false } })
        return;
      } else {
        dispatch({ type:'detection/save', payload:{ sendTime:sendTime } })
      }
      localStorage.setItem('sendTime',sendTime)
    }, 1000);
  }
  
  render() {
    const { loading, filter, pagination, teamList, isSend } = this.props.detection;
    let { sendTime } = this.props.detection;
    const { dispatch } = this.props
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '日期',
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
    ];

    /* table列表*/
    const columns = [
      {
        title: '内容',
        dataIndex: 'x',
        key: 'x',
        width:'30%',
        render:(text, record) => {
            return (
                Object.keys(record).map((v,n)=>{
                    return <Row key={ n } className={ styles.row }>
                                <Col span={ 3 }>{ v }</Col>
                                <Col span={ 21 }>{ record[v] }</Col>
                            </Row>
                  })
              )
          }
      },
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      columns,
      rowKey:'time',
      bordered: true,
      pagination: {
        ...pagination,
        showQuickJumper:false,
        showTotal: total => '',
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'detection/queryAppDetection',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'detection/queryAppDetection',
            payload: {
              ...filter,
              currentPage:1,
              currentSize,
            },
          })
        },
      },
    };

    return (
      <div className={styles.content}>
        <h3>远程监测</h3>
        <Divider />
        <Button disabled={ isSend?true:false } onClick={ this.sendAppDetectionCommand } type={ isSend?'default':'primary' }>
          {isSend?`${sendTime} s后可再次点击`:'开始远程监测'}
        </Button>
        <FilterPage {...filterProps} />
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
