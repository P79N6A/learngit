import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Popconfirm,List, Select, LocaleProvider,Icon, Row, Col, Tag, message, Alert} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick, unionWith } from 'lodash'
import FilterPage from '@components/filter/index'
import UseModal from '@components/renderProp/useModal'
import { INDEX_DEVICE_OP } from '@utils/pathIndex'
import BeforeInit from '@components/HOC/beforeInit/beforeInit'
import styles from './batch.less'
const { Option } = Select;
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
function mapStateToProps(state) {
  return { batch:state.batch }
}
const SEND_YES = 1;//指定推送
const SEND_NO = 0;//指定取消
const LOCK_YES = 1;//指定锁定
const LOCK_NO = 0;//指定解锁
const OPERAT_BATCH = 1;//全部操作
const OPERAT_SE = 0;//指定操作
@connect(mapStateToProps)
@BeforeInit({ name:'batch', isInitData:false})
export default class Device extends Component {
  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    Object.keys(fields).map((key) => {
      if ((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
    });
    dispatch({ type: 'batch/save', payload: { filter:submitData } });
    dispatch({ type: 'batch/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'batch/save', payload: { filter:{} } });
  }

  //推送配置或取消
  sendOrCancel = (status,isAllOperate) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.props.batch

    //判断状态是否统一并且是匹配status的,推送中的不可推送
    let flag = false;
    for (let obj of selectedRows) {
        if (status == 0 && obj.sendStatus != 3) {//取消操作，只能取消推送中的
            flag = true
            message.error('只可以取消推送中的状态')
            break;
        } else if(status == 1 && obj.sendStatus == 3) {//推送操作，除了推送中
            flag = true
            message.error('推送中的不可以再次推送')
            break;
        }
    }
    if(flag) {
      return;
    }

    const deviceSet = isAllOperate == 0?selectedRows.map(v=> {
      return v.deviceId
    }):[]
    dispatch({ type:'batch/batchSendOrCancel', payload:{ deviceSet, status, isAllOperate} })
  }

  //解锁或锁定
  lockOrCancel = (status, isAllOperate) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.props.batch

    //判断状态是否统一并且是匹配status的
    let flag = false;
    for (let obj of selectedRows) {
        if (obj.lockStatus == status) {
            flag = true
            message.error('解锁或者锁定状态不统一')
            break;
        }
    }
    if(flag) {
      return;
    }
    const deviceSet = isAllOperate==0?selectedRows.map(v=> {
      return v.deviceId
    }):[]
    dispatch({ type:'batch/batchLockOrUnlock', payload:{ deviceSet, status, isAllOperate}  })
  }

  //点击单条移除
  changeSelectRows = (key) => {
    const { selectedRowKeys, selectedRows, originRows } = this.props.batch
    const { dispatch } = this.props
    const selectedRowKeys_ = [];
    selectedRowKeys.map((v,n) => {
      if(v != key) selectedRowKeys_.push(v)
    })
    const selectedRows_ = []
    selectedRows.map((v,n) => {
      if(v.deviceId != key) selectedRows_.push(v)
    })
    originRows.rows = selectedRows_
    dispatch({ type:'batch/save', payload:{ originRows, selectedRows: selectedRows_, selectedRowKeys: selectedRowKeys_ } })
  }

  getLockStatus = (status) => {
    return {
      1:<Tag color="#f5222d">锁定</Tag>,
      0:<Tag color="#87d068">解锁</Tag>,
    }[status]
  }
  getSendStatus = (status) => {
    return {
      1:<Tag color="#87d068">成功</Tag>,
      2:<Tag color="#f5222d">失败</Tag>,
      3:<Tag color="#2db7f5">推送中</Tag>,
    }[status]
  }

  //根据key填充rows
  packageRows = (keys,rows) => {
    const { originRows } = this.props.batch;
    //把原始rows作为基数  拼接当前选择rows
    const resultArr = unionWith(originRows.rows,rows, (v1,v2) => {
      return v1.deviceId == v2.deviceId
    })
    return resultArr;
  }

  render() {
    const { loading, filter, pagination,teamList,selectedRowKeys,selectedRows, btnUse } = this.props.batch;
    const { dispatch } = this.props;
    /* 搜索表单配置项*/
    const filterItems = [
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
        key: 'lockStatus',
        label: '锁定状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="" value="">全部</Option>,
          <Option key="1" value="0">解锁</Option>,
          <Option key="2" value="1">锁定</Option>,
        ],
        fieldAdapter: {
          placeholder: '请选择绑定状态',
          component: Select,
        },
      },
      {
        key: 'sendStatus',
        label: '推送状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="" value="">全部</Option>,
          <Option key="1" value="1">成功</Option>,
          <Option key="2" value="2">失败</Option>,
          <Option key="3" value="3">推送中</Option>,
        ],
        fieldAdapter: {
          placeholder: '请选择资源类型',
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '设备绑定ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
      }, {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
      }, {
        title: '锁定状态',
        dataIndex: 'lockStatus',
        key: 'lockStatus',
        render:text => {
          return <span>{ this.getLockStatus(text) }</span>
        }
      }, {
        title: '推送状态',
        dataIndex: 'sendStatus',
        key: 'sendStatus',
        render:text => {
          return <span>{ this.getSendStatus(text) }</span>
        }
      }, 
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };

    //批量操作
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys_, selectedRows_) => {
        if(selectedRowKeys_.length>0) {
          dispatch({ type:'batch/save', payload:{ btnUse:false } })
        } else {
          dispatch({ type:'batch/save', payload:{ btnUse:true } })
        }
        dispatch({ type:'batch/save', payload:{ selectedRowKeys:selectedRowKeys_, selectedRows:this.packageRows(selectedRowKeys_,selectedRows_) } })
      },
    };

    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      rowKey:'deviceId',
      columns,
      rowSelection,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'batch/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'batch/queryBaseData',
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
        <div className={styles.btnBox}>
          <Button type="default" onClick={() => dispatch({type:'batch/pushRouter',payload:{ pathname:INDEX_DEVICE_OP} })}>返回</Button>
          <Popconfirm placement="topRight" title={'请确认是否推送所选?'} onConfirm={ this.sendOrCancel.bind(this,SEND_YES,OPERAT_SE) } okText="确认" cancelText="取消">
              <Button disabled={ btnUse } type='primary'><Icon type="double-right" />推送所选</Button>
          </Popconfirm>
          <Popconfirm placement="topRight" title={'请确认是否取消推送?'} onConfirm={ this.sendOrCancel.bind(this,SEND_NO,OPERAT_SE) } okText="确认" cancelText="取消">
              <Button disabled={ btnUse } type='primary'><Icon type="close" />取消推送</Button>
          </Popconfirm>

          <UseModal>
            {({ Button, Modal }) => (
              <span>
                <Button type='danger'><Icon type="double-right" />全部推送</Button>
                <Modal title="请确定是否全部推送？" onOK={ this.sendOrCancel.bind(this,SEND_YES,OPERAT_BATCH) }>
                  <Alert message="此操作会将全部数据推送，请谨慎操作！" showIcon type="warning" />
                </Modal>
              </span>
            )}
          </UseModal>
          <UseModal>
            {({ Button, Modal }) => (
              <span>
                <Button type='danger'><Icon type="close" />全部取消</Button>
                <Modal title="请确定是否全部取消？" onOK={ this.sendOrCancel.bind(this,SEND_NO,OPERAT_BATCH) }>
                  <Alert message="此操作会将全部数据取消，请谨慎操作！" showIcon type="warning" />
                </Modal>
              </span>
            )}
          </UseModal>

          <Popconfirm placement="topRight" title={'请确认是否锁定所选?'} onConfirm={ this.lockOrCancel.bind(this,LOCK_YES,OPERAT_SE) } okText="确认" cancelText="取消">
              <Button disabled={ btnUse } type='primary'><Icon type="lock" />锁定所选</Button>
          </Popconfirm>
          <Popconfirm placement="topRight" title={'请确认是否解锁所选?'} onConfirm={ this.lockOrCancel.bind(this,LOCK_NO,OPERAT_SE) } okText="确认" cancelText="取消">
              <Button disabled={ btnUse } type='primary'><Icon type="unlock" />解锁所选</Button>
          </Popconfirm>
          <UseModal>
            {({ Button, Modal }) => (
              <span>
                <Button type='danger'><Icon type="lock" />全部锁定</Button>
                <Modal title="请确定是否全部锁定？" onOK={ this.lockOrCancel.bind(this,LOCK_YES,OPERAT_BATCH) }>
                  <Alert message="此操作会将全部数据锁定，请谨慎操作！" showIcon type="warning" />
                </Modal>
              </span>
            )}
          </UseModal>
          <UseModal>
            {({ Button, Modal }) => (
              <span>
                <Button type='danger'><Icon type="unlock" />全部解锁</Button>
                <Modal title="请确定是否全部解锁？" onOK={ this.lockOrCancel.bind(this,LOCK_NO,OPERAT_BATCH) }>
                  <Alert message="此操作会将全部数据解锁，请谨慎操作！" showIcon type="warning" />
                </Modal>
              </span>
            )}
          </UseModal>
        </div>
        <Row className={ styles.warp }>
          <Col span={ 14 }>
            <LocaleProvider locale={zhCN}>
              <Table className={styles.teamTable} {...listProps} />
            </LocaleProvider>
          </Col>
          <Col span={9} offset={ 1 }>
            <LocaleProvider locale={zhCN}>
              <List
                  className={ styles.selectDiv }
                  itemLayout="horizontal"
                  bordered="true"
                  size="small"
                  dataSource={selectedRows}
                  renderItem={item => (
                    <List.Item actions={[<Button onClick={ this.changeSelectRows.bind(this,item.deviceId) } type="danger" size="small">移除</Button>]}>
                      <h3 className={ styles.listH }>{item.deviceId}</h3>
                      <span style={{ fontSize:'12px' }}>锁定状态：{ this.getLockStatus(item.lockStatus)}</span>
                      <span style={{ fontSize:'12px' }}>推送状态：{ this.getSendStatus(item.sendStatus)}</span>
                    </List.Item>
                  )}
                />
              </LocaleProvider>
          </Col>
        </Row>
      </div>
    )
  }
}
