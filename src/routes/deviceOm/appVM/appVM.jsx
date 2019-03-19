import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Select, Table, Tooltip, DatePicker, LocaleProvider, Icon, Popconfirm, message } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './appVM.less'
import moment from 'moment'
import Modal from '@components/modal/modal'
import { INDEX_DEVICE_APPVM } from '@utils/pathIndex'
const { RangePicker } = DatePicker;
const { Option } = Select;
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {appVM:state.appVM}
}
@connect(mapStateToProps)
export default class AppVM extends Component {
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
    dispatch({ type: 'appVM/save', payload: { filter:submitData } });
    dispatch({ type: 'appVM/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'appVM/save', payload: { filter:{} } });
  }

  checkDevice = (text) => {
    const { deviceTypes } = this.props.appVM
    let result = ''
    if(deviceTypes) {
      deviceTypes.map(v=>{
        if(v.code == text) result = v.description
      })
    }
    return result
  }
  abandon = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'appVM/abandon', payload:{ id } })
  }

  getDeviceType = () => {
    const { deviceTypes } = this.props.appVM;
    if(deviceTypes) {
        const deviceTypes_ =  [].concat([{ code:'', description:'全部' }],deviceTypes)
        return deviceTypes_.map((v,n)=> <Option key={ n } data-partnerType={ v.partnerType } value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  getDevicePro = () => {
    const { productList } = this.props.appVM;
    if(productList) {
        const productList_ =  [].concat([{ code:'', description:'全部' }],productList)
        return productList_.map((v,n)=> <Option key={ n } value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  selectType = (code, v) => {
    const { dispatch } = this.props
    const { resetFields } = this.filterForm.props.form
    if(v.props['data-partnerType']) {//有值，展示产品列表
        resetFields('productId')
        dispatch({ type:'appVM/getPartnerProductList', payload:{ partnerType:v.props['data-partnerType'] } })
    } else {
        dispatch({ type:'appVM/save', payload:{ isShowPro:false } })
    }
  }

  showOss = (ossKey,deviceId) => {
    const { dispatch } = this.props
    this.onRefModal.changeVisible(true)
    dispatch({ type:'appVM/getOssTempUrl', payload:{ ossKey, deviceId } })
  }

  render() {
    const { loading, filter, pagination, teamList, isShowPro, ossUrl } = this.props.appVM;
    const { dispatch } = this.props;
    const toolTipDom = (text) => (
      <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )

    const modalDom = (record) => {
      return record.ossKey?(
        <Button type="primary" size='small' onClick={this.showOss.bind(this,record.ossKey, record.deviceId)}>获取<Icon type="info-circle" style={{ color: 'white' }} /></Button>
      ):'没有信息'
  }
    

    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '时间范围',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
        },
      },
      {
        key: 'deviceType',
        label: '设备类型',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getDeviceType(),
        fieldAdapter: {
          component: Select,
          onSelect:this.selectType,
        },
      },
      {
        key: 'productId',
        label: '产品',
        span: 8,
        isShow:isShowPro?'show':'hidden',
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getDevicePro(),
        fieldAdapter: {
          component: Select,
        },
      },
      {
        key: 'versionName',
        label: '版本名称',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写操作模块',
          component: Input,
        },
      },
      {
        key: 'status',
        label: '状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="0">废弃</Option>,
          <Option key="3" value="1">全量更新状态</Option>,
          <Option key="4" value="2">灰度更新状态</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:'8%',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      {
        title: '通用设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
        width:'8%',
        render:text => {
          return this.checkDevice(text)
        }
      }, 
      {
        title: '版本名称',
        dataIndex: 'versionName',
        key: 'versionName',
        width:'8%',
      }, 
      {
        title: '合作伙伴产品',
        dataIndex: 'productName',
        key: 'productName',
        width:'8%',
      }, 
      {
        title: '版本号',
        dataIndex: 'versionCode',
        key: 'versionCode',
        width:'5%',
      }, 
      {
        title:'下载地址',
        dataIndex: 'downloadUrl',
        key: 'downloadUrl',
        width:'10%',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      },
      {
        title:'md5',
        dataIndex: 'md5',
        key: 'md5',
        width:'5%',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      },
      {
        title:'oss地址',
        dataIndex: 'ossKey',
        key: 'ossKey',
        width:'7%',
        render:( text, record ) => {
          return (
            modalDom(record)
          )
        }
      },
      {
        title:'描述',
        dataIndex: 'description',
        key: 'description',
        width:'7%',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      },
      {
        title:'操作人',
        dataIndex: 'operator',
        key: 'operator',
        width:'8%',
      },
      {
        title:'版本状态',
        dataIndex: 'status',
        key: 'status',
        width:'8%',
        render:text => {
          if(text === 0) return <span>废弃</span>
          if(text === 1) return <span>全量更新状态</span>
          if(text === 2) return <span>灰度更新状态</span>
        }
      },
      {
        title:'操作',
        dataIndex: '',
        key: 'x',
        width:'15%',
        render:(record) => {
          const { id, status } = record;
          return (
            <div className={styles.options}>
              <Button size='small' type="primary" onClick={() => dispatch({ type:'appVM/pushRouter',payload:{ pathname:`${INDEX_DEVICE_APPVM}/editVersion`, search:{ id } }})}>编辑</Button>
              {status != 0 && (
                <Popconfirm placement="topRight" title="请确认是否废弃?" onConfirm={this.abandon.bind(this,id)} okText="确认" cancelText="取消">
                <Button size="small" type="danger">废弃</Button>
              </Popconfirm>
              )}
            </div>
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
      rowKey:'id',
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(cur, currentSize) {
          dispatch({
            type: 'appVM/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'appVM/queryBaseData',
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
        <FilterPage {...filterProps} wrappedComponentRef={ ref => this.filterForm = ref }/>
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'appVM/pushRouter',payload:{ pathname:`${INDEX_DEVICE_APPVM}/addVersion`} })}>发布新版本</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
        <Modal
            title="oss地址"
            ref={ ref => this.onRefModal = ref }
        >
        { ossUrl }
        </Modal>
      </div>
    )
  }
}
