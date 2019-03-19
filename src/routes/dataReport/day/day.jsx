import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Popconfirm, DatePicker, LocaleProvider, Select } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './day.less'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {dayOld:state.dayOld}
}
@connect(mapStateToProps)
export default class DayOld extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'dayOld/save',payload:{ isShowExport:false } })
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
    dispatch({ type: 'dayOld/save', payload: { filter:submitData } });
    dispatch({ type: 'dayOld/queryBaseData', payload: { ...submitData, queryType:4 } });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'dayOld/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'dayOld/exportDayList' })
  }

  render() {
    const { loading, filter, pagination,teamList, isShowExport, allLine, allLine2 } = this.props.dayOld;
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
      { title: '办理日期', dataIndex: 'checkinDate', key: 'checkinDate', fixed: 'left',
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
        title: '总办理人数',
        dataIndex: 'handleTotalNumber',
        key: 'handleTotalNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '办理成功人数',
        dataIndex: 'handleSuccPersonNumber',
        key: 'handleSuccPersonNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '办理失败人数',
        dataIndex: 'handleFailPersonNumber',
        key: 'handleFailPersonNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '放弃办理人数',
        dataIndex: 'buyerAbandonNum',
        key: 'buyerAbandonNum',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '上传公安成功的人数',
        dataIndex: 'uploadSuccPersonNumber',
        key: 'uploadSuccPersonNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title: '总办理订单数',
        dataIndex: 'totalOrderNumber',
        key: 'totalOrderNumber',
        render:text => {
          return text || 0
        }
      }, 
      {
        title:'成功办理订单数',
        dataIndex: 'handleSuccNumber',
        key: 'handleSuccNumber',
        render:text => {
          return text || 0
        }
      },
      {
        title:'成功预授权订单数',
        dataIndex: 'succPreAuthOrderNum',
        key: 'succPreAuthOrderNum',
        render:text => {
          return priceDom(text)
        }
      },
      {
        title:'成功线下信用住订单数',
        dataIndex: 'successOffLineCreditOrderNum',
        key: 'successOffLineCreditOrderNum',
        render:text => {
          return text || 0
        }
      },
      {
        title:'成功飞猪订单数',
        dataIndex: 'fliggySuccessOrderNum',
        key: 'fliggySuccessOrderNum',
        render:text => {
          return text || 0
        }
      },
      {
        title:'新用户订单数',
        dataIndex: 'newUserOrderNumber',
        key: 'newUserOrderNumber',
        render:text => {
          return text || 0
        }
      },
      {
        title:'成功总预订金额',
        dataIndex: 'bookTotalPrice',
        key: 'bookTotalPrice',
        render:text => {
          return priceDom(text)
        }
      },
      {
        title:'总冻结金额',
        dataIndex: 'totalFrozenAmount',
        key: 'totalFrozenAmount',
        render:text => {
          return priceDom(text)
        }
      },
      
      {
        title:'成功总间夜数',
        dataIndex: 'nights',
        key: 'nights',
        render:text => {
          return text || 0
        }
      },
      {
        title:'总结账订单数',
        dataIndex: 'checkOutNumber',
        key: 'checkOutNumber',
        render:text => {
          return text || 0
        }
      },
      {
        title:'预授权结账订单数',
        dataIndex: 'settlePreAuthOrderNum',
        key: 'settlePreAuthOrderNum',
        render:text => {
          return text || 0
        }
      },
      {
        title:'线下信用住结账订单数',
        dataIndex: 'fliggyOfflineSetterNumber',
        key: 'fliggyOfflineSetterNumber',
        render:text => {
          return text || 0
        }
      },
      {
        title:'飞猪结账订单数',
        dataIndex: 'fliggyCheckOutNum',
        key: 'fliggyCheckOutNum',
        render:text => {
          return text || 0
        }
      },
      {
        title:'总结账间夜数',
        dataIndex: 'totalSettleRoomNights',
        key: 'totalSettleRoomNights',
        render:text => {
          return text || 0
        }
      },
      {
        title:'非飞猪总结账间夜数',
        dataIndex: 'unfliggySettleRoomNights',
        key: 'unfliggySettleRoomNights',
        render:text => {
          return text || 0
        }
      },
      {
        title:'总支付GMV',
        dataIndex: 'totalPayGmv',
        key: 'totalPayGmv',
        render:text => {
          return priceDom(text)
        }
      },
      {
        title:'预授权总GMV',
        dataIndex: 'preAuthGmv',
        key: 'preAuthGmv',
        render:text => {
          return priceDom(text)
        }
      },
      {
        title:'线下信用住总GMV',
        dataIndex: 'offLineCreditGmv',
        key: 'offLineCreditGmv',
        render:text => {
          return priceDom(text)
        }
      },
      {
        title:'飞猪线上信用住GMV',
        dataIndex: 'fliggyPayGmv',
        key: 'fliggyPayGmv',
        render:text => {
          return priceDom(text)
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
            type: 'dayOld/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
              queryType:4
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'dayOld/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
              queryType:4
            },
          })
        },
      },
      scroll:{ x: 3600 }
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
        {
          allLine2 && <div className={ styles.allLine }>
          总成功率{ allLine2.successRate }，总办理入住单数：{ allLine2.totalHandlePersonNumber }，总办理成功入住单数：{ allLine2.totalHandleSuccessPersonNumber }，总办理失败入住单数：{ allLine2.totalHandleFailPersonNumber }，总放弃入住单数：{ allLine2.totalHandleAbandonPersonNumber } 
          </div>
        }
        {
          allLine && <div className={ styles.allLine }>
          总办理人数：{ allLine.totalHandlePersonNumber }，总成功办理人数：{ allLine.totalHandleSuccessPersonNumber }，总办理失败人数：{ allLine.totalHandleFailPersonNumber }，总放弃办理人数：{ allLine.totalHandleAbandonPersonNumber } 
          </div>
        }
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
