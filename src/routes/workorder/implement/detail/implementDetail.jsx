import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Divider, Form, DatePicker, LocaleProvider, Row, Col, Input, Select, Popconfirm, Icon, message, Table } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pickBy, filter } from 'lodash'
import styles from './implementDetail.less'
import UploadPackage from '../components/upload'
import UploadPackageOld from '../components/uploadOld'
import AddRemark from '../components/addRemark'
import moment from 'moment'
import { max } from '@utils/valid'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import Modal from '@components/modal/modal'
import { INDEX_WORKORDER_IMPLEMENT } from '@utils/pathIndex';
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const formItemLayoutLine = {
  labelCol: { span: 10 },
  wrapperCol: { span: 24 },
};
const formItemLayoutRemark = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};

function mapStateToProps(state) {
  return { implementDetail: state.implementDetail }
}

const formConfig = {
  orderDetail: {
    label: '基本信息',
    list: [
      { name: '工单号', key: 'orderId' },
      { name: '工单类型', key: 'type' },
      { name: '工单状态', key: 'orderStatusDesc' },
      { name: '派单人', key: 'distributor' },
      { name: '上线人', key: 'onlineOperator' },
      { name: '上线时间', key: 'onlineTime' },
      { name: '设备商', key: 'companyPartnerId', rules: msg => [{ required: true, message: msg }], disabled: 1 },
      { name: '要求实施完成时间', key: 'orderExpectTime', rules: msg => [{ required: true, message: msg }], disabled: 1 },
      { name: '实际实施完成时间', key: 'orderFinishTime' },
      { name: '自助入住测试单号', key: 'checkinTestId', rules: msg => [{ required: true, message: msg }, { validator: max(64) }],disabled: 2 },
      { name: '预授权测试单号', key: 'preAuthId', rules: msg => [{ required: true, message: msg }, { validator: max(64) }],disabled: 2 },
    ]
  },
  uploadDetail: {
    label: '实施详情',
    list: [
      { name:'实施图片', key:'photo' },
      { name:'实施视频', key:'video' },
    ]
  },
  hotelDetail: {
    label: '酒店信息',
    list: [
      { name:'酒店名称', key:'hotelName' },
      { name:'酒店地址', key:'hotelAddress' },
      { name:'酒店联系人', key:'hotelContact' },
      { name:'联系电话', key:'hotelContactTel' },
      { name:'联系人信息', key:'contacts' },
    ]
  },
  hotelDeviceType: {
    label: '酒店设备类型信息',
    list: [
      { name: '设备', key: 'deviceName' },
      { name: '旅业系统', key: 'tourismSystem' },
      { name: 'PMS', key: 'pms' },
      { name: '读卡器', key: 'cardReader' },
      { name: '发卡器', key: 'cardProvider' },
      { name: '制卡写卡器', key: 'cardCreater' },
    ]
  },
  installPackage: {
    label: '安装包信息',
    list: [
      { name: '安装实施教程', key: 'coursePath' },
      { name: '自助机windows安装包', key: 'winPath' },
      { name: 'APP安装包', key: 'appPath' },
      { name: '设备激活码', key: 'activeCode' },
    ]
  },
  remark: {
    label: '备注信息',
  },
  logs: {
    label: '操作日志',
  }
}
//存放添加行点击删除后的roomType数组
let temContacts = [];
let uuid = 0;
@connect(mapStateToProps)
@Form.create()
@beforeInit({ name: 'implementDetail' })
export default class Day extends Component {

  constructor(props) {
      super(props);
      this.state = {
        companyIdRe:false,
        orderExpectTimeRe:false,
        checkinTestIdRe:false,
        preAuthIdRe:false,
      }
  }

  //合并手机联系人为对象数组
  getTrueParams = (v) => {
      for(let key in v) {
          /**
           * 该判断主要将添加行的行数据组合成真正的参数，因为存在删除这一样，导致数组中会存在empty的情况所以下标重新定义
           */
          if(key.includes('addLine')) {
              let addLineArr = key.split('_');
              v[addLineArr[1]] = v[addLineArr[1]]?v[addLineArr[1]]:[];
              let addLineTrueV = v[addLineArr[1]];
              //过滤empty 获取下标书组
              let indexInit = 0;
              v[key].map((vAdd) => {
                  if(!addLineTrueV[indexInit]) {
                      addLineTrueV[indexInit] = {};
                  }
                  addLineTrueV[indexInit][addLineArr[2]] = addLineArr[2]=='value'?vAdd.join(','):vAdd;
                  indexInit++;
              })
          }
      }
  }

  getDistributor = () => {
    const { equproducerList } = this.props.implementDetail;
    if (equproducerList) {
      return equproducerList.map((v, n) => <Option key={n} value={v.companyPartnerId}>{v.companyPartnerName}</Option>)
    } else {
      return []
    }
  }

  //判断是否禁止输入
  checkDisabled = (disabledFlag) => {
    const { implementDetail } = this.props;
    const { data, textOrderDis } = implementDetail;
    const { orderStatus } = data;
    if (orderStatus != 1 && disabledFlag == 1) {//不是已创建，并且判断条件是1 的不可修改
      return true
    } 
    if(textOrderDis && disabledFlag == 2) {//判断条件为2
      return true
    }
    return false
  }

  contains = (arrays, obj) => {
      var i = arrays.length;
      while (i--) {
          if (arrays[i] === obj) {
              return i;
          }
      }
      return false;
  }

  remove = (k) => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      if (keys.length === 1) {
          return;
      }
      //同时删除临时roomType数组,防止删除第一条默认列表后初始化又增加了这一条记录
      const indexLoca = this.contains(keys,k)
      temContacts.splice(indexLoca,1)
      form.setFieldsValue({
          keys: keys.filter(key => key !== k),
      });
  }

  add = () => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(uuid);
      uuid++;
      form.setFieldsValue({
          keys: nextKeys,
      });
  }

  getAddItem = (obj) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const initialValue =  obj.map((v,n) => {
        return n
    })
    getFieldDecorator('keys', { initialValue });
    const keys = getFieldValue('keys');
    uuid =  keys.length>0?keys[keys.length-1]+1:0
    return keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayoutLine}
          label={null}
          key={k}
          className = {styles.addLine}
        >
              <Row gutter={16} className = {styles.addRow}>
                <Col span={6}>
                    <FormItem {...formItemLayout} label={'职位'}>
                        {getFieldDecorator(`addLine_contacts_position[${k}]`,{
                            rules:[{ required:true, message:'请输入职位' }],
                            initialValue:obj[index]?obj[index].position:''
                        })(
                            <Input placeholder='请输入职位'/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label={'姓名'}>
                        {getFieldDecorator(`addLine_contacts_name[${k}]`,{
                            rules:[{ required:true, message:'请输入姓名' }],
                            initialValue:obj[index]?obj[index].name:''
                        })(
                            <Input placeholder='请输入姓名'/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label={'联系电话'}>
                        {getFieldDecorator(`addLine_contacts_phone[${k}]`,{
                            rules:[{ required:true, message:'请输入联系电话' }],
                            initialValue:obj[index]?obj[index].phone:''
                        })(
                            <Input placeholder='请输入联系电话'/>
                        )}
                    </FormItem>
                </Col>
                {keys.length > 1 ? (
                    <Col span={6}>
                        <Button
                            className={styles.deleteBtn}
                            type="primary"
                            size="small"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        >删除</Button>
                    </Col>
                ) : null}
            </Row>
        </FormItem>
      );
    });
  }

  getHotelDetail = (list) => {
    const { implementDetail } = this.props;
    const { data } = implementDetail;

    //为添加行的参数 临时数组第一次赋值
    temContacts = data.contacts || [{name:"",position:"",phone:''}];
    return list.map((v, n) => {
      if (v.key == 'contacts') {//输入
        return (
          <div key={ n }>
            { this.getAddItem(temContacts) }
            <Row type="flex" justify="center" style={{ marginTop:'10px' }}>
              <Col span={6}>
                <Button style={{ display:'inline-block' }} type="default" onClick={this.add}>
                    <Icon type="plus" /> 新增联系人
                </Button>
                <Button style={{ display:'inline-block', marginLeft:'10px' }} type="primary" onClick={this.saveContact}>
                    保存联系人
                </Button>
              </Col>
            </Row>
          </div>
        )
      }
      return (
        <div key={n} className={styles.lineBox4}>
          <Row type="flex" align="middle" style={{ height:'100%' }}>
            <Col className={styles.lable} span={10}>{`${v.name}：`}</Col>
            <Col className={styles.text} span={14}>{v.key == 'type' ? '实施工单' : (data[v.key] || '暂无')}</Col>
          </Row>
        </div>
      )
    })
  }

  getDomDetail = (key, list) => {
    const { getFieldDecorator } = this.props.form;
    const { implementDetail } = this.props;
    const { data, equproducerList } = implementDetail;
    if (key == 'orderDetail' || key == 'hotelDeviceType') {
      return list.map((v, n) => {
        if (v.rules) {//输入
          const rules = v.rules(`请输入${v.name}`)
          rules[0].required = this.state[`${v.key}Re`]
          if (v.key == 'companyPartnerId') {
            return (
              <div key={n} className={styles.lineBox}>
                <FormItem {...formItemLayout} label={v.name}>
                  {getFieldDecorator(v.key, {
                    rules,
                    initialValue: data[v.key] || (equproducerList && equproducerList[0].companyPartnerId)
                  })(
                    <Select style={{ width: '100%' }} disabled={this.checkDisabled(v.disabled)}>
                      {this.getDistributor()}
                    </Select>
                  )}
                </FormItem>
              </div>
            )
          }
          if (v.key == 'orderExpectTime') {
            return (
              <div key={n} className={styles.lineBox}>
                <FormItem {...formItemLayout} label={v.name}>
                  {getFieldDecorator(v.key, {
                    rules,
                    initialValue: data[v.key]?moment(data[v.key]) : null
                  })(
                    <DatePicker format="YYYY-MM-DD" disabled={this.checkDisabled(v.disabled)} />
                  )}
                </FormItem>
              </div>
            )
          }
          return (
            <div key={n} className={styles.lineBox}>
              <FormItem {...formItemLayout} label={v.name}>
                {
                  getFieldDecorator(v.key, {
                    rules,
                    initialValue: data[v.key]
                  })(
                    <Input placeholder={v.name} disabled={this.checkDisabled(v.disabled)} />
                  )}
              </FormItem>
            </div>
          )
        }
        return (
          <div key={n} className={styles.lineBox}>
            <Row type="flex" align="middle" style={{ height:'100%' }}>
              <Col className={styles.lable} span={10}>{`${v.name}：`}</Col>
              <Col className={styles.text} span={14}>{v.key == 'type' ? '实施工单' : (data[v.key] || '暂无')}</Col>
            </Row>
          </div>
        )
      })
    } else if (key == 'installPackage') {//安装包模块
      return list.map((v, n) => {
        if(v.key == 'activeCode') {
          return (
            <div key={n} className={styles.lineBox4}>
              <Row type="flex">
                <Col className={styles.lable} span={14}>{`${v.name}：`}</Col>
                <Col className={styles.text} span={10}>{ data[v.key] }</Col>
              </Row>
            </div>
          )
        }
          return (
            <div key={n} className={styles.lineBoxLarge}>
              <Row type="flex">
                <Col className={styles.lable} span={11}>{`${v.name}：`}</Col>
                <Col className={styles.text} span={13}>
                  {
                    //已上传
                    data[`${v.key}Flag`] ?
                      (
                        <div>
                          <Button onClick={this.showUploadOld.bind(this, v.key)} style={{ marginRight: '2px' }} size="small" type="primary"><Icon type="upload" />上传</Button>
                          <Popconfirm placement="topRight" title="请确认是否下载?" onConfirm={this.downloadOld.bind(this, v.key)} okText="确认" cancelText="取消">
                            <Button style={{ marginRight: '2px' }} size="small" type="primary"><Icon type="download" />下载</Button>
                          </Popconfirm>
                          <Popconfirm placement="topRight" title="请确认是否删除?" onConfirm={this.deleteFile.bind(this, v.key)} okText="确认" cancelText="取消">
                            <Button size="small" type="danger"><Icon type="delete" />删除</Button>
                          </Popconfirm>
                        </div>
                      ) : (
                        <Button onClick={this.showUploadOld.bind(this, v.key)} size="small" type="primary"><Icon type="upload" />上传</Button>
                      )
                  }
                </Col>
              </Row>
            </div>
            // if(data[v.key]) {
            // <div key={n} className={styles.lineBox4}>
            //   <Row type="flex">
            //     <Col className={styles.lable} span={14}>{`${v.name}：`}</Col>
            //     <Col className={styles.text} span={10}>
            //       <Popconfirm placement="topRight" title="请确认是否下载?" onConfirm={this.download.bind(this, v.key, data[v.key])} okText="确认" cancelText="取消">
            //         <Button style={{ marginRight: '2px' }} size="small" type="primary"><Icon type="download" />下载</Button>
            //       </Popconfirm>
            //     </Col>
            //   </Row>
            // </div>
          )
      })
    } else if (key == 'remark') {//备注信息
      return (
        <div>
          {
            this.getDomRemarks(data['remarks'])
          }
          <Row type="flex" style={{ marginTop: '10px' }}>
            <Col span={9} offset={1}>
              <FormItem {...formItemLayoutRemark} label={'备注：'}>
                {
                  getFieldDecorator('remark', {
                    rules: [{ required: false, message: '输入备注信息' }],
                  })(
                    <TextArea placeholder={'输入备注信息'} />
                  )}
              </FormItem>
            </Col>
            <Col span={14}>
              <Button onClick={this.addRemark} size="small" type="primary">添加备注</Button>
            </Col>
          </Row>
        </div>
      )
    } else if (key == 'logs' && data['logs'] && data['logs'].length > 0) {//操作日志
      return this.getDomLogs(data['logs'])
    } else if(key == 'uploadDetail') {
      return list.map((v, n) => {
        const { orderDatas=[] } = data
        return (
          <div key={n}>
            <Row type="flex">
              <Col className={styles.lable} span={2}>{`${v.name}：`}</Col>
              <Col style={{ marginBottom:'10px' }} span={22}>
                {
                  filter(orderDatas,{ type:v.key }).length < (v.key=='photo'?4:2) && <Button style={{ marginRight:'10px', marginBottom:'5px' }} onClick={this.showUpload.bind(this, v.key)} size="small" type="primary"><Icon type="upload" />上传</Button>
                }
                { filter(orderDatas,{ type:v.key }).length>0 && (
                  <div>
                    {
                      filter(orderDatas,{ type:v.key }).slice(0,v.key=='photo'?4:2).map((obj,index)=>{
                        return <Popconfirm key={index} placement="topRight" title="请确认是否下载?" onConfirm={this.download.bind(this, v.key, obj.path)} okText="确认" cancelText="取消">
                          <Button style={{ marginRight:'5px'}} size="small" type="primary"><Icon type="download" />{ obj.path }下载</Button>
                        </Popconfirm>
                      })
                    }
                  </div>
                )}
              </Col>
            </Row>
          </div>
        )
      })
    }
  }

  //下载安装包
  downloadOld = (key) => {
    const { dispatch, implementDetail } = this.props
    const { data } = implementDetail
    const fileName = data[key]
    const fileType = key.replace('Path', '')
    dispatch({ type: 'implementDetail/downloadFileOld', payload: { fileType: fileType, fileName } })
  }

  //删除安装包
  deleteFile = (key) => {
    const { dispatch } = this.props
    const fileType = key.replace('Path', '')
    dispatch({ type: 'implementDetail/deleteFile', payload: { fileType, fileName: fileType } })
  }

  /**
   * photo-实施工单照片
   * video-实施工单视频
   * win-实施工单windows安装包 
   * app-实施工单app安装包
   * courese-实施工单教程
   */
  download = (key,fileName) => {
    const { dispatch } = this.props
    const fileType = key.replace('Path', '')
    dispatch({ type: 'implementDetail/downloadFile', payload: { fileType: fileType, fileName } })
  }

  //显示上传弹窗
  showUpload = (key) => {
    const { dispatch } = this.props
    dispatch({ type: 'implementDetail/save', payload: { fileType: key.replace('Path', '') } })
    this.modalUpload.changeVisible(true)
    this.uploadRef && this.uploadRef.reset()
  }

  //显示上传弹窗Old
  showUploadOld = (key) => {
    const { dispatch } = this.props
    dispatch({ type: 'implementDetail/save', payload: { fileType: key.replace('Path', '') } })
    this.modalUploadOld.changeVisible(true)
    this.uploadRefOld && this.uploadRefOld.reset()
  }

  //备注表格
  getDomRemarks = (listArr) => {
    /* table列表*/
    const columns = [
      { title:'时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width:'15%', render: text => {
          return (
            text?<p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>:'暂无'
          )
        }
      }, 
      { title:'操作人', dataIndex: 'operatorName', key: 'operatorName', width:'10%' }, 
      { title:'备注内容', dataIndex: 'remark', key: 'remark', width:'25%' }, 
    ];

    /** 表格参数 */
    const listProps = {
      dataSource: listArr,
      columns,
      rowKey:'id',
      bordered: true,
      pagination: {
        pageSize: 50,
        className:styles.pagination,
      }
    };

    return (
      <LocaleProvider locale={zhCN}>
        <Table className={styles.teamTable} {...listProps} />
      </LocaleProvider>
    )
  }

  //日志表格
  getDomLogs = (listArr) => {
    /* table列表*/
    const columns = [
      { title:'操作时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width:'15%', render: text => {
          return (
            text?<p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>:'暂无'
          )
        }
      }, 
      { title:'操作人', dataIndex: 'operatorName', key: 'operatorName', width:'10%' }, 
      { title:'操作内容', dataIndex: 'operatorTypeDesc', key: 'operatorTypeDesc', width:'25%' }, 
      { title:'操作结果', dataIndex: 'operatorResult', key: 'operatorResult', width:'50%'  },
    ];

    /** 表格参数 */
    const listProps = {
      dataSource: listArr,
      columns,
      rowKey:'id',
      bordered: true,
      pagination: {
        pageSize: 50,
        className:styles.pagination,
      }
    };

    return (
      <LocaleProvider locale={zhCN}>
        <Table className={styles.teamTable} {...listProps} />
      </LocaleProvider>
    )
  }

  //拼接dom列表
  getDomList = () => {
    return Object.keys(formConfig).map((v, n) => {
      return (
        <div key={n} className={styles.modelBox}>
          <p className={styles.tabTitle}>{formConfig[v].label}</p>
          <div className={styles.modelContent}>
            { v == 'hotelDetail' && this.getHotelDetail(formConfig[v].list) }
            {this.getDomDetail(v, formConfig[v].list)}
          </div>
        </div>
      )
    })
  }

  //修改订单
  update = (orderStatus) => {
    const { dispatch, implementDetail } = this.props
    const { data={} } = implementDetail
    const { hotelName } = data
    const { companyPartnerId } = data
    dispatch({ type: 'implementDetail/update', payload: { orderStatus, hotelName, companyPartnerId } })
  }

  //刷新detail
  getDetail = () => {
    const { dispatch } = this.props
    dispatch({ type: 'implementDetail/getimplementDetail' })
  }

  //保存联系人
  saveContact = () => {
    const { dispatch } = this.props
    this.setState({
      checkinTestIdRe:false,
      preAuthIdRe:false,
      companyIdRe:false,
      orderExpectTimeRe:false,
    }, () => {
      this.props.form.validateFields(['orderExpectTime','companyPartnerId','checkinTestId','preAuthId'], { force: true });
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.getTrueParams(values)
          dispatch({ type: 'implementDetail/addContact', payload: { contacts:values.contacts } })
        } else {
          message.error('请填写必填参数')
        }
      });
    });
  }

  //保存订单
  saveOrder = () => {
    const { dispatch, implementDetail={} } = this.props
    const { data, equproducerList } = implementDetail
    const { getFieldValue } = this.props.form
    const paramKeys = ['companyPartnerId', 'orderExpectTime', 'checkinTestId', 'preAuthId']
    const values = {}
    paramKeys.map(v => {
      values[v] = getFieldValue(v)
    })
    //获取设备商name
    equproducerList.map(v => {
      if (v.companyPartnerId == values.companyPartnerId) {
        values.companyPartnerName = v.companyPartnerName
        values.companyPartnerId = v.companyPartnerId
      }
    })
    if( !values.companyPartnerName && !values.companyPartnerId ) {
      values.companyPartnerName = data.companyPartnerName
      values.companyPartnerId = data.companyPartnerId
    }
    values.orderExpectTime = values.orderExpectTime?moment(values.orderExpectTime).format('YYYY-MM-DD'):null
    dispatch({ type: 'implementDetail/saveOrder', payload: values })
  }

  //派单
  payout = () => {
    const { dispatch, implementDetail } = this.props
    const { data, equproducerList } = implementDetail
    //先判断设备参数是否都有
    let deviceFlag = true
    for (let i = 0; i < formConfig.hotelDeviceType.list.length; i++) {
      const key = formConfig.hotelDeviceType.list[i].key
      if(!data[key]) {
        deviceFlag = false;
        break
      }
    }
    if(!deviceFlag) {
      message.error('请进行模板设置后再派单！')
      return
    }
    
    this.setState({
      checkinTestIdRe:false,
      preAuthIdRe:false,
      companyIdRe:true,
      orderExpectTimeRe:true,
    }, () => {
      this.props.form.validateFields(['orderExpectTime','companyPartnerId','checkinTestId','preAuthId'], { force: true });
      this.props.form.validateFields((err, values) => {
        if (!err) {
          //获取设备商name
          equproducerList.map(v => {
            if (v.companyPartnerId == values.companyPartnerId) {
              values.companyPartnerName = v.companyPartnerName
              values.companyPartnerId = v.companyPartnerId
            }
          })
          if( !values.companyPartnerName && !values.companyPartnerId ) {
            values.companyPartnerName = data.companyPartnerName
            values.companyPartnerId = data.companyPartnerId
          }
          values.orderExpectTime = moment(values.orderExpectTime).format('YYYY-MM-DD')
          values.hotelName = data.hotelName
          dispatch({ type: 'implementDetail/update', payload: { orderStatus:3, ...values } })
        } else {
          message.error('请填写必填参数')
        }
      });
    });
  }

  //添加备注
  addRemark = () => {
    const { dispatch } = this.props
    const { getFieldValue } = this.props.form
    const remarkStr = getFieldValue('remark')
    if (remarkStr) {
      dispatch({ type: 'implementDetail/addRemark', payload: { remark: remarkStr } })
    } else {
      message.error('备注不可为空')
    }
  }

  //实施完成
  workDone = () => {
    const { dispatch, implementDetail } = this.props
    const { data } = implementDetail
    this.setState({
      checkinTestIdRe:true,
      preAuthIdRe:true,
    }, () => {
      this.props.form.validateFields(['checkinTestId','preAuthId'], { force: true });
      this.props.form.validateFields((err, values) => {
        if(!err) {
          values = pickBy(values,(v,key) => {
            if(['checkinTestId','preAuthId'].includes(key)) return true;
          })
          values.hotelName = data.hotelName
          values.companyPartnerId = data.companyPartnerId
          dispatch({ type: 'implementDetail/update', payload: { orderStatus:4, ...values } })
        } else {
          message.error('请填写必填参数')
        }
      });
    });
  }

  //试试不通过
  showRemark = () => {
    this.modalRemark && this.modalRemark.changeVisible(true)
  }

  //添加试试备注
  handleOkRemark = () => {
    const { dispatch, implementDetail } = this.props;
    const { data={} } = implementDetail
    const { form } = this.remarkRef.props;
    const { validateFields, resetFields } = form;
    validateFields((err, values) => {
        if (!err) {
          values.companyPartnerId = data.companyPartnerId
          values.hotelName = data.hotelName
          dispatch({ type: 'implementDetail/update', payload: { orderStatus:6, ...values } })
          this.modalRemark.changeVisible(false)
          resetFields()
        }
    })
  }

  render() {
    const { dispatch, implementDetail } = this.props
    const { fileType, data } = implementDetail
    const { orderStatus, orderId } = data
    return (
      <div className={styles.content}>
        <h4 style={{ display: 'inline-block', marginRight: '20px' }}>工单详情</h4>
        <Button size="small" style={{ display: 'inline-block', marginRight: '20px' }} type="primary" onClick={() => dispatch({ type: 'implementDetail/pushRouter', payload: { pathname: INDEX_WORKORDER_IMPLEMENT } })}>返回</Button>
        <Divider />
        <LocaleProvider locale={zhCN}>
          <Form className={styles.form}>
            {this.getDomList()}
          </Form>
        </LocaleProvider>
        { orderStatus != 2 &&
        <div className={styles.btnBox}>
          {
            //已派单
            orderStatus == 3 && (
                <Popconfirm placement="topRight" title="请确认是否撤单?" onConfirm={this.update.bind(this, 8)} okText="确认" cancelText="取消">
                  <Button type="default">撤单</Button>
                </Popconfirm>
            )
          }
          {
            //已创建
            orderStatus == 1 && (
                <Popconfirm placement="topRight" title="请确认是否取消?" onConfirm={this.update.bind(this, 2)} okText="确认" cancelText="取消">
                  <Button type="default">取消</Button>
                </Popconfirm>
            )
          }
          {
            //已创建
            orderStatus < 3 && (
              <Button type="primary" onClick={this.saveOrder}>保存</Button>
            )
          }
          {
            //已创建
            orderStatus < 3 && (
              <Popconfirm placement="topRight" title="请确认是否派单?" onConfirm={this.payout} okText="确认" cancelText="取消">
                <Button type="primary">派单</Button>
              </Popconfirm>
            )
          }
          {
            //实施完成
            (orderStatus == 4) && (
              <div>
                <Popconfirm placement="topRight" title="请确认是否通过?" onConfirm={this.update.bind(this, 5)} okText="确认" cancelText="取消">
                  <Button type="primary">验收通过</Button>
                </Popconfirm>
                <Button onClick={this.showRemark} type="primary">验收不通过</Button>
              </div>
            )
          }
          {
            //已验收
            orderStatus == 5 && (
              <Popconfirm placement="topRight" title="请确认是否培训?" onConfirm={this.update.bind(this, 7)} okText="确认" cancelText="取消">
                <Button type="primary">培训</Button>
              </Popconfirm>
            )
          }
          {
            (orderStatus == 6 || orderStatus == 3) && (
              <Popconfirm placement="topRight" title="请确认是否实施完成?" onConfirm={this.workDone} okText="确认" cancelText="取消">
                <Button type="primary">实施完成</Button>
              </Popconfirm>
            )
          }
        </div>
        }
        <Modal
          title="上传"
          ref={ref => this.modalUpload = ref}
        >
          <UploadPackage getDetail={this.getDetail} orderId={orderId} fileType={fileType} ref={ref => this.uploadRef = ref} />
        </Modal>
        <Modal
          title="上传"
          ref={ref => this.modalUploadOld = ref}
        >
          <UploadPackageOld getDetail={this.getDetail} orderId={orderId} fileType={fileType} ref={ref => this.uploadRefOld = ref} />
        </Modal>
        <Modal
          title="请填写备注"
          ref={ref => this.modalRemark = ref}
          notOkHidden = { true }
          onOk={ this.handleOkRemark }
        >
          <AddRemark wrappedComponentRef={ref => this.remarkRef = ref} />
        </Modal>
      </div>
    )
  }
}
