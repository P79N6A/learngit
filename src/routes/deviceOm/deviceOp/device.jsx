import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, Select, LocaleProvider, Icon, DatePicker} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import ModalVersion from '@components/modal/modal'
import ConfirmButton from '@components/confirmButton/confirmButton'
import DeviceForm from './components/deviceForm'
import DriveForm from './components/driveForm'
import DebugForm from './components/debugForm'
import PreRegister from './components/preRegister'
import { INDEX_DEVICE_OP, INDEX_DEVICE_TEM_PARAM, INDEX_DEVICE_BATCH, INDEX_WORKORDER_IMPLEMENT } from '@utils/pathIndex'
import BeforeInit from '@components/HOC/beforeInit/beforeInit'
import styles from './device.less'
import moment from 'moment'
import Modal from '@components/modal/modal'
import { ENUM_DEVICE_STATUS, ENUM_LIST } from '@utils/enums'
const { RangePicker } = DatePicker;
const { Option } = Select;
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
let nowDeviceId = null

function mapStateToProps(state) {
  return { device:state.device }
}
@connect(mapStateToProps)
@BeforeInit({ name:'device', isInitData:false})
export default class Device extends Component {
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
      } else if ((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
    });
    dispatch({ type: 'device/save', payload: { filter:submitData } });
    dispatch({ type: 'device/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'device/save', payload: { filter:{} } });
  }

  //禁用
  confirmForbid = (deviceId) => {
    const { dispatch } = this.props;
    dispatch({ type:'device/forbid', payload:{ deviceId } })
  }
  //推送配置
  action_pushConf = (deviceId) => {
    const { dispatch } = this.props;
    dispatch({ type:'device/action_pushConf', payload:{ deviceId } })
  }
  //解锁
  action_unlockDevice = (deviceId) => {
    const { dispatch } = this.props;
    dispatch({ type:'device/action_unlockDevice', payload:{ deviceId } })
  }
  //锁定
  action_lockDevice = (deviceId) => {
    const { dispatch } = this.props;
    dispatch({ type:'device/action_lockDevice', payload:{ deviceId } })
  }

  //驱动升级选择类型
  codeChange = (v) => {
    const { dispatch } = this.props
    dispatch({ type:'device/action_versionInfo', payload:{ code:v } })
  }

  //驱动升级选择品牌
  brandChange = (v) => {
    const { brandVersion } = this.props.device
    const { dispatch } = this.props
    for (let i = 0; i < brandVersion.length; i++) {
      const obj = brandVersion[i];
      if(obj.brand === v) {
        dispatch({ type: 'device/save', payload:{ driveVersion:obj.version } })
        break
      }
    }
  }


  //将子组件modal赋值给父组件
  onRefVersion = (ref) => {
    this.modalVersion = ref
  }
  //将子组件modal赋值给父组件
  onRefDebug = (ref) => {
    this.modalDebug = ref
  }
  //将子组件modal赋值给父组件
  onRefLevelUp = (ref) => {
    this.modalLevelUp = ref
  }

  //展示驱动升级框
  showLevelDrive = (deviceId) => {
    nowDeviceId = deviceId
    this.modalVersion.changeVisible(true)
  }
  //展示debug
  showDebug = (deviceId) => {
    nowDeviceId = deviceId
    const { dispatch } = this.props
    dispatch({ type:'device/action_getIsDebug', payload:{ deviceId } })
    this.modalDebug.changeVisible(true)
  }
  //展示设备注册
  showRegister = (deviceId) => {
    nowDeviceId = deviceId
    const { dispatch } = this.props
    dispatch({ type:'device/getSimpleDeviceModelConfig', payload:{ deviceId, partnerType:9  } })
    this.deviceRegisterModal.changeVisible(true)
  }
  //关闭设备注册
  cancelRegister = () => {
    const { form } = this.deviceRegisterForm.props;
    const { resetFields } = form;
    resetFields()
    this.deviceRegisterModal.changeVisible(false)
  }
  //设置设备注册确定按钮
  handleRegister = () => {
    const { dispatch } = this.props;
    const { form } = this.deviceRegisterForm.props;
    const { validateFields, resetFields } = form;
    validateFields((err, values) => {
        if (!err) {
          const configDOList = []
          Object.keys(values).map(key=>{
            configDOList.push({
              key,
              value:values[key]
            })
          })
          dispatch({ type: 'device/addSimpleDeviceModelConfig', payload:{ deviceId:nowDeviceId, partnerType:9, configDOList }, callback:()=>resetFields() })
        }
    })
  }
  //展示appapk升级框
  showLevelDevice = (deviceId) => {
    nowDeviceId = deviceId
    this.modalLevelUp.changeVisible(true)
  }

  //驱动升级确定按钮
  handleOk = () => {
    const { dispatch } = this.props;
    const { form } = this.driveRefForm.props;
    const { validateFields } = form;
    validateFields((err, values) => {
        if (!err) {
          dispatch({ type: 'device/action_updateDriver', payload:{ deviceId:nowDeviceId, ...values } })
        }
    })
  }
  //设置debug确定按钮
  handleDebug = () => {
    const { dispatch } = this.props;
    const { form } = this.debugRefForm.props;
    const { validateFields, resetFields } = form;
    validateFields((err, values) => {
        if (!err) {
          dispatch({ type: 'device/action_updateIsDebug', payload:{ deviceId:nowDeviceId, ...values } })
        }
    })
    resetFields()
  }
  //设置debug取消按钮
  cancelDebug = () => {
    //初始化单选框
    const { form } = this.debugRefForm.props;
    const { resetFields } = form;
    resetFields()
  }

  //升级确定按钮
  handleOkLevelUp = () => {
    const { dispatch } = this.props;
    const { form } = this.deviceRefForm.props;
    const { validateFields } = form;
    validateFields((err, values) => {
        if (!err) {
          dispatch({ type: 'device/action_updateApp', payload:{ deviceId:nowDeviceId, ...values } })
        }
    })
  }

  //展示激活码
  showActiveModal = (activeCode) => {
    const { dispatch } = this.props
    dispatch({ type:'device/save', payload:{ activeCode } })
    this.activeCodeModal.changeVisible(true)
  }

  render() {
    const { activeCode, loading, filter, pagination,teamList,deviceTypes, driveTypes, brandVersion, driveVersion, debugInfo, deviceRegisterInfo } = this.props.device;
    const { dispatch } = this.props;
    const toolTipDom = (text) => (
      <Tooltip title={ (text && !text.includes('<p></p>') && !text.includes('<p>&nbsp;</p>'))?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )

    const modalDom = (text) => {
      return (text && text != 'null')?<Button onClick={ this.showActiveModal.bind(this,text) } type="primary" size='small'>详情<Icon type="info-circle" style={{ color: 'white' }} /></Button>:'没有信息'
    }

    /**列表按钮 */

    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '绑定时间',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
        },
      }, 
      {
        key: 'deviceId',
        label: '设备绑定ID',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写设备绑定ID',
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
        key: 'psbHotelCode',
        label: '旅馆代码',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写旅馆代码',
          component: Input,
        },
      }, 
      {
        key: 'deviceStatus',
        label: '绑定状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: ENUM_LIST(ENUM_DEVICE_STATUS,true).map((v,n)=>{
          return <Option key={ n } value={ v.code }>{ v.description }</Option>
        }),
        fieldAdapter: {
          placeholder: '请选择绑定状态',
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '绑定时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:'12%',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, {
        title: '设备绑定ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        width:'10%',
      }, {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
        width:'10%',
      }, {
        title: '绑定状态',
        dataIndex: 'deviceStatus',
        key: 'deviceStatus',
        width:'8%',
        render:text => {
          return <span>{ ENUM_DEVICE_STATUS[text] }</span>
        }
      }, 
      {
        title: '设备描述',
        dataIndex: 'deviceDesc',
        key: 'deviceDesc',
        width:'8%',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      }, 
      {
        title: '工单号',
        dataIndex: 'workOrderId',
        key: 'workOrderId',
        width:'6%',
        render:text => {
          return text?<Button size="small" type="primary" onClick={() => dispatch({ type: 'device/pushRouter',payload:{ pathname:`${INDEX_WORKORDER_IMPLEMENT}/detail`, search:{ orderId:text } }})}>{ text }</Button>:'暂无'
        }
      }, 
      {
        title: '工单状态',
        dataIndex: 'workOrderStatusDesc',
        key: 'workOrderStatusDesc',
        width:'6%',
      }, 
      {
        title: '激活码',
        dataIndex: 'activeCode',
        key: 'activeCode',
        width:'8%',
        render:text => {
          return modalDom(text)
        }
      }, 
      {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '32%',
        render:(record) => {
          const { deviceStatus, deviceId, testFlag } = record;
          return (
              <div className={styles.options}>
                <ConfirmButton isTestFlag={ testFlag } needPop={ false } onClick={() => dispatch({ type:'device/paramConfig', payload:{ deviceId } })} content='参数设置' type='default' />
                <ConfirmButton isTestFlag={ testFlag } needPop={ false } onClick={() => dispatch({ type:'device/pushRouter',payload:{ pathname:INDEX_DEVICE_TEM_PARAM, search:{ deviceId } }})} content='模板设置' type='default' />
                {
                  deviceStatus === 1 && 
                  (
                    <ConfirmButton isTestFlag={ testFlag } needPop={ true } onClick={ this.confirmForbid.bind(this,deviceId) } content='禁用' type='danger' />
                  )
                }
                <ConfirmButton isTestFlag={ testFlag } needPop={ true } onClick={this.action_pushConf.bind(this,deviceId)} content='推送配置' type='default' />
                <ConfirmButton isTestFlag={ testFlag } needPop={ false } onClick={this.showLevelDevice.bind(this,deviceId)} content='升级' type='default' />
                <ConfirmButton isTestFlag={ testFlag } needPop={ false } onClick={this.showDebug.bind(this,deviceId)} content='设置debug信息' type='default' />
                {
                  deviceStatus === 2 && <ConfirmButton isTestFlag={ testFlag } needPop={ true } onClick={this.action_unlockDevice.bind(this, deviceId)} content='解锁' type='default' />
                }
                { 
                  deviceStatus === 1 && <ConfirmButton isTestFlag={ testFlag } needPop={ true } onClick={this.action_lockDevice.bind(this, deviceId)} content='锁定' type='default' /> 
                }
                <ConfirmButton isTestFlag={ testFlag } needPop={ false } onClick={() => dispatch({ type:'device/pushRouter',payload:{ pathname:'/deviceOm/deviceOp/logCollect', search:{ deviceId } }})} content='日志采集' type='default' />
                <ConfirmButton isTestFlag={ testFlag } needPop={ false } onClick={() => dispatch({ type:'device/pushRouter',payload:{ pathname:'/deviceOm/deviceOp/detection', search:{ deviceId } }})} content='远程监测' type='default' />
                <Button size="small" type='primary' onClick={ () => dispatch({ type:'device/pushRouter',payload:{ pathname:'/deviceOm/deviceOp/mockSet', search:{deviceId } } }) }>设置mock</Button>
                <Button size="small" type='primary' onClick={ this.showRegister.bind(this,deviceId) }>设备注册</Button>
              </div>
          )
        }
      }
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
        onChange(cur, currentSize) {
          dispatch({
            type: 'device/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'device/queryBaseData',
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
        <FilterPage ref={ ref => this.filterRef = ref } {...filterProps} />
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'device/pushRouter',payload:{ pathname:`${INDEX_DEVICE_OP}/template`} })}>模板维护</Button>
          <Button type="primary" onClick={() => dispatch({type:'device/pushRouter',payload:{ pathname:INDEX_DEVICE_BATCH }})}>批量操作</Button>
        </div>
        <ModalVersion
            title="升级"
            ref={ this.onRefLevelUp }
            onOk={ this.handleOkLevelUp }
          >
          <DeviceForm wrappedComponentRef={(form) => this.deviceRefForm = form} deviceTypes={ deviceTypes }/>
        </ModalVersion>
        <ModalVersion
            title="驱动升级"
            ref={ this.onRefVersion }
            onOk={ this.handleOk }
          >
          <DriveForm 
            wrappedComponentRef={(form) => this.driveRefForm = form}
            driveTypes={ driveTypes } 
            brandVersion={ brandVersion } 
            driveVersion={ driveVersion } 
            codeChange={ this.codeChange } 
            brandChange={ this.brandChange }/>
        </ModalVersion>
        <ModalVersion
            title="设置debug"
            ref={ this.onRefDebug }
            onOk={ this.handleDebug }
            onCancel={ this.cancelDebug }
          >
          <DebugForm 
            wrappedComponentRef={(form) => this.debugRefForm = form}
            debugInfo={ debugInfo } />
        </ModalVersion>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>

        <Modal
            title="激活码"
            ref={ ref => this.activeCodeModal = ref }
          >
          { activeCode }
        </Modal>

        <Modal
            title="设备注册"
            ref={ ref => this.deviceRegisterModal = ref }
            onOk={ this.handleRegister }
            onCancel={this.cancelRegister}
          >
          <PreRegister
            wrappedComponentRef={(form) => this.deviceRegisterForm = form}
            data = { deviceRegisterInfo }
           />
        </Modal>
      </div>
    )
  }
}
