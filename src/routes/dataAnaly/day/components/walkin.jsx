import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Popconfirm, DatePicker, LocaleProvider, Select } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './walkin.less'
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
export default class Walkin extends Component {

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
    dispatch({ type: 'day/queryBaseData', payload: { ...submitData, queryType:1 } });
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
      { title: '办理日期', dataIndex: 'checkInDate', key: 'checkInDate', fixed: 'left',
      width: 100, }, 
      {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
        fixed: 'left',
        width: 100,
      }, 
      {
        title: '成功率',
        dataIndex: 'cardSuccessRate',
        key: 'cardSuccessRate',
        fixed: 'left',
        width: 100,
      }, 
      {
        title: '总人数',
        dataIndex: 'handleTotalGuestNumber',
        key: 'handleTotalGuestNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '总成功人数',
        dataIndex: 'handleSuccGuestNumber',
        key: 'handleSuccGuestNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '总入住单数',
        dataIndex: 'totalOrderNumber',
        key: 'totalOrderNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '成功入住单数',
        children:[
          {
            title: '总计',
            dataIndex: 'handleSuccNumber',
            key: 'handleSuccNumber',
            width: 100,
          },
          {
            title: '预授权',
            dataIndex: 'succPreAuthOrderNum',
            key: 'succPreAuthOrderNum',
            width: 100,
          },
          {
            title: '线下信用住',
            children:[
              {
                title: '新签约',
                dataIndex: 'successNewSignOffLineCreditOrderNum',
                key: 'successNewSignOffLineCreditOrderNum',
                width: 100,
              },
              {
                title: '已签约',
                dataIndex: 'successAlreadySignOffLineCreditOrderNum',
                key: 'successAlreadySignOffLineCreditOrderNum',
                width: 100,
              },
            ]
          },
          {
            title: '线上信用住',
            dataIndex: 'fliggySuccessOrderNum',
            key: 'fliggySuccessOrderNum',
            width: 100,
          }
        ]
      }, 
      {
        title:'失败入住单数',
        children:[
          {
            title: '总计',
            dataIndex: 'handleFailNumber',
            key: 'handleFailNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: 'PSB上传检查',
            dataIndex: 'handleFailPsbCheckNumber',
            key: 'handleFailPsbCheckNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '扫脸核身',
            dataIndex: 'handleFailScanFaceNumber',
            key: 'handleFailScanFaceNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '查询订单',
            dataIndex: 'handleFailQueryPmsOrderNumber',
            key: 'handleFailQueryPmsOrderNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '确认信息',
            dataIndex: 'handleFailConfirmNumber',
            key: 'handleFailConfirmNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '添加同住人',
            dataIndex: 'handleFailAddRoommateNumber',
            key: 'handleFailAddRoommateNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '交纳押金',
            dataIndex: 'handleFailPayDepositNumber',
            key: 'handleFailPayDepositNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '在线选房',
            dataIndex: 'handleFailOnlineRoomSelectionNumber',
            key: 'handleFailOnlineRoomSelectionNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '预约入住',
            dataIndex: 'handleFailPreCheckInNumber',
            key: 'handleFailPreCheckInNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: 'checkin',
            dataIndex: 'handleFailHandleCheckInNumber',
            key: 'handleFailHandleCheckInNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '取卡',
            dataIndex: 'handleFailCardAcquisitionNumber',
            key: 'handleFailCardAcquisitionNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '网络异常',
            dataIndex: 'handleFailNetWorkExceptionNumber',
            key: 'handleFailNetWorkExceptionNumber',
            render:text => {
              return text || 0
            }
          }, 
        ]
      },
      {
        title:'放弃入住单数',
        children:[
          {
            title: '总计',
            dataIndex: 'handleAbandonNumber',
            key: 'handleAbandonNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: 'PMS无订单',
            dataIndex: 'handleAbandonPmsNotOrderNumber',
            key: 'handleAbandonPmsNotOrderNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '预约入住未取卡',
            dataIndex: 'handleAbandonPreNotGetCardNumber',
            key: 'handleAbandonPreNotGetCardNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '未退宿',
            dataIndex: 'handleAbandonHaveStayInfoNumber',
            key: 'handleAbandonHaveStayInfoNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '主动退出',
            dataIndex: 'handleAbandonActiveNumber',
            key: 'handleAbandonActiveNumber',
            render:text => {
              return text || 0
            }
          }, 
          {
            title: '超时退出',
            dataIndex: 'handleAbandonTimeOutNumber',
            key: 'handleAbandonTimeOutNumber',
            render:text => {
              return text || 0
            }
          }, 
        ]
      },
      {
        title: '上传psb失败人数',
        dataIndex: 'psbUploadFailGuestNumber',
        key: 'psbUploadFailGuestNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '开始办理失败',
        dataIndex: 'handleFailStartHandleNumber',
        key: 'handleFailStartHandleNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '读身份证失败',
        dataIndex: 'handleFailReadIdCardNumber',
        key: 'handleFailReadIdCardNumber',
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
              queryType:1
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
              queryType:1
            },
          })
        },
      },
      scroll:{ x: 3000 }
    };
    return (
      <div className={styles.content}>
        <FilterPage {...filterProps} />
        { dailySummaryVO && <TitleTab data={ dailySummaryVO }/> }
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
