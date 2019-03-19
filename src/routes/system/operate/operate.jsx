import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Input, Table, Alert, DatePicker, LocaleProvider, Icon, Select, Button } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './operate.less'
import moment from 'moment'
import Modal from '@components/modal/modal'
import { _jsonParse } from '@utils/tools'
import { ENUM_OPERATE_LOGS_STATUS, ENUM_LIST } from '@utils/enums'
const { RangePicker } = DatePicker;
const { Option } = Select;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {operate:state.operate}
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
    dispatch({ type: 'operate/save', payload: { filter:submitData } });
    dispatch({ type: 'operate/queryBaseData', payload: { submitData, currentPage:1 } });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'operate/save', payload: { filter:{} } });
  }

  showModal = (record) => {
    const { dispatch } = this.props
    dispatch({ type:'operate/save', payload:{ record } })
    this.onRefModal && this.onRefModal.changeVisible(true)
  }

  render() {
    const { loading, filter, pagination,teamList,record } = this.props.operate;
    const { dispatch } = this.props;
    const modalDom = (record) => {
      return (record)?<Button onClick={ this.showModal.bind(this,record) } type="primary" size='small'>详情<Icon type="info-circle" style={{ color: 'white' }} /></Button>:'没有信息'
    }
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '操作时间范围',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
        },
      },
      {
        key: 'moduleType',
        label: '业务纬度',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: ENUM_LIST(ENUM_OPERATE_LOGS_STATUS,true).map((v,n)=>{
          return <Option key={ n } value={ v.code }>{ v.description }</Option>
        }),
        fieldAdapter: {
          placeholder: '请选择业务纬度',
          component: Select,
        },
      },
      {
        key: 'indexId',
        label: '业务Id',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写业务Id',
          component: Input,
        },
      },
      {
        key: 'moduleName',
        label: '操作模块',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写操作模块',
          component: Input,
        },
      },
      {
        key: 'stepName',
        label: '操作内容',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写操作内容',
          component: Input,
        },
      },
    ];

    /* table列表*/
    const columns = [
      { title:'操作时间', dataIndex: 'operationTime', key: 'operationTime', width:'20%', render: text => {
          return (
            <p>{text?moment(text).format('YYYY-MM-DD HH:mm:ss'):'暂无'}</p>
          )
        }
      },
      { title:'操作人员', dataIndex: 'operator', key: 'operator', width:'10%', },
      { title:'操作模块', dataIndex: 'desc', key: 'desc', width: '20%', },
      { title:'设备Id', dataIndex: 'deviceId', key: 'deviceId', width:'10%', },
      { title:'未来酒店Id', dataIndex: 'fhHid', key: 'fhHid', width: '10%', },
      { title:'操作内容', dataIndex: 'optStep', key: 'optStep', width:'20%', },
      { title:'操作详情', dataIndex: 'x', key: 'x', width:'10%', render:(text, record) => {
        return modalDom(record)
      }},
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        showQuickJumper:false,
        showTotal: total => '',
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'operate/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'operate/queryBaseData',
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
        <FilterPage {...filterProps} />
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>

        <Modal
            title="详情"
            ref={ ref => this.onRefModal = ref }
          >
            <div>
              <Alert
                style={{ marginBottom:'10px' }}
                message="入参"
                description={ record && record.param.toString() }
                type="success"
              />
              <Alert
                  message="出参"
                  description={ record && record.result.toString() }
                  type="info"
                />
            </div>
        </Modal>
      </div>
    )
  }
}
