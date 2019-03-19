import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Table, Form, Tooltip, LocaleProvider, Icon, Popconfirm, Input, Select } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './psbUpload.less'
import moment from 'moment'
import Decrypt from '@components/HOC/decrypt/decrypt'
const { Option } = Select
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return { psbUpload:state.psbUpload }
}
@connect(mapStateToProps)
@Form.create()
@Decrypt('psbUpload')
export default class psbUpload extends Component {
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
    dispatch({ type: 'psbUpload/save', payload: { filter:submitData } });
    dispatch({ type: 'psbUpload/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'psbUpload/save', payload: { filter:{} } });
  }

  uploadPsb = (id,uploadInfo) => {
    const { dispatch } = this.props
    dispatch({ type:'psbUpload/uploadPsb', payload:{ id, uploadInfo } })
  }

  cancelPsb = (id,checkinOrderId) => {
    const { dispatch } = this.props
    dispatch({ type:'psbUpload/cancelUploadPSB', payload:{ id, checkinOrderId } })
  }

  render() {
    const { loading, filter, pagination, teamList } = this.props.psbUpload;
    const { dispatch } = this.props;
    const toolTipDom = (text) => (
      <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )
    /* 搜索表单配置项*/
    const filterItems = [
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
        key: 'credId',
        label: '身份证',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写身份证',
          component: Input,
        },
      }, 
      {
        key: 'phone',
        label: '联系电话',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写联系电话',
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
        key: 'psbStatus',
        label: '状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key={1} value={''}>全部</Option>,
          <Option key={2} value={0}>上传中</Option>,
          <Option key={3} value={1}>停止上传</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      { title:'上传时间', dataIndex: 'firstUploadDate', key: 'firstUploadDate', width:'20%', render: text => {
        return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      },  {
        title: '客人姓名',
        dataIndex: 'guestName',
        key: 'guestName',
        width:'15%',
      }, {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        width:'10%',
        render:text => {
          return (
            this.modalDom(text)
          )
        }
      }, {
        title: '身份证号码',
        dataIndex: 'credId',
        key: 'credId',
        width:'10%',
        render:text => {
          return (
            this.modalDom(text)
          )
        }
      }, {
        title: '入住酒店',
        dataIndex: 'hotelName',
        key: 'hotelName',
        width:'15%',
      }, {
        title: '状态',
        dataIndex: 'psbStatusDesc',
        key: 'psbStatusDesc',
        width:'10%',
      }, {
        title: '失败原因',
        dataIndex: 'errorMsg',
        key: 'errorMsg',
        width:'10%',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      }, {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '10%',
        render:(record) => {
          const { id,uploadInfo, checkinOrderId } = record;
          return (
            <div className={styles.options}>
              <Popconfirm placement="topRight" title="请确认是否上传?" onConfirm={this.uploadPsb.bind(this,id,uploadInfo)} okText="确认" cancelText="取消">
                <Button size="small" type="primary">上传</Button>
              </Popconfirm>
              <Popconfirm placement="topRight" title="请确认是否取消轮询?" onConfirm={this.cancelPsb.bind(this,id,checkinOrderId)} okText="确认" cancelText="取消">
                <Button size="small" type="primary">取消</Button>
              </Popconfirm>
            </div>
          )
        }
      }
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };
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
            type: 'psbUpload/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'psbUpload/queryBaseData',
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
