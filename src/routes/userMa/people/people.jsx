import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, LocaleProvider, Icon, Select, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './people.less'
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
  return {people:state.people}
}
@connect(mapStateToProps)
@Decrypt('people')
export default class People extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'people/save',payload:{ isShowExport:false } })
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
    dispatch({ type: 'people/save', payload: { filter:submitData } });
    dispatch({ type: 'people/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'people/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'people/exportPeopleList' })
  }

  render() {
    const { loading, filter, pagination,teamList,isShowExport } = this.props.people;
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
        key: 'isSuccess',
        label: '是否办理成功',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="0">失败</Option>,
          <Option key="3" value="1">成功</Option>,
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
      { title: '办理入住日期', dataIndex: 'checkinDate', key: 'checkinDate', fixed: 'left',
      width: 100, render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName', fixed: 'left',
      width: 100, },
      { title:'姓名', dataIndex: 'name', key: 'name' }, 
      { title:'入住身份', dataIndex: 'mainGuestFlag', key: 'mainGuestFlag' },
      { title:'是否办理成功', dataIndex: 'isSuccess', key: 'isSuccess' },
      { title:'是否checkin成功', dataIndex: 'isCheckInSuccess', key: 'isCheckInSuccess' },
      { title:'是否上传PSB成功', dataIndex: 'uploadPsbSuccess', key: 'uploadPsbSuccess' },
      { title:'手机号', dataIndex: 'phone', key: 'phone', render: text => {
        return this.modalDom(text)
      }},
      { title:'身份证号', dataIndex: 'idNo', key: 'idNo', render: text => {
        return this.modalDom(text)
      }},
      { title:'城市', dataIndex: 'city', key: 'city', render:text=>{
        return toolTipDom(text)
      } },
      { title:'年龄', dataIndex: 'age', key: 'age', render:text=>{
        return toolTipDom(text)
      }  },
      { title:'性别', dataIndex: 'sex', key: 'sex', render:text=>{
        return toolTipDom(text)
      }  },
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset:this.onReset  };
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
            type: 'people/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'people/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
      },
      scroll:{ x: 1500 }
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
