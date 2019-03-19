import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Table, DatePicker, Form, LocaleProvider, Icon, Popconfirm, Input, Select } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './dealQuery.less'
import moment from 'moment'
import Settle from './formUnfree/settle'
import SettleFre from './formUnfree/settleFre'
import Unfreeze from './formUnfree/unfreeze'
import Revokeb from './formUnfree/revoke'
import RevokebFre from './formUnfree/revokeFre'
import Modal from '@components/modal/modal'
import { INDEX_DEAL_QUERY } from '@utils/pathIndex'
import { ENUM_PRE_PAY_STATUS, ENUM_LIST } from '@utils/enums'
const { Option } = Select
const { RangePicker } = DatePicker;
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return { dealQuery: state.dealQuery }
}
@Form.create()
@connect(mapStateToProps)
export default class DealQuery extends Component {
  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type: 'dealQuery/save', payload: { isShowExport: false } })
    Object.keys(fields).map((key) => {
      if (['checkinDate','checkoutDate'].includes(key) && fields[key] && fields[key].length > 0) {
        submitData = {
          ...submitData,
          [`${key}Start`]: fields[key][0].format('YYYY-MM-DD'),
          [`${key}End`]: fields[key][1].format('YYYY-MM-DD'),
        }
      } else if((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
      
    });
    dispatch({ type: 'dealQuery/save', payload: { filter:submitData } });
    dispatch({ type: 'dealQuery/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'dealQuery/save', payload: { filter:{} } });
  }

  showUnfreeze = (id,freezeAmount) => {
    this.modalUnfreeze.changeVisible(true)
    const { dispatch } = this.props
    dispatch({ type:'dealQuery/save', payload:{ id, stepUnfreeze:null, freezeAmount }})
    if(this.unfreezeRefForm) {
      const { form } = this.unfreezeRefForm.props;
      const { resetFields } = form
      resetFields()
    }
  }
  showSettle = (id, freezeAmount, checkinDate, payType) => {
    if (payType != 2) {
      this.modalSettle.changeVisible(true)
      if(this.settleRefForm) {
        const { form } = this.settleRefForm.props;
        const { reset } = this.settleRefForm;
        const { resetFields } = form
        resetFields()
        reset()
      }
    } else {//线下信用住
      this.modalSettleFre.changeVisible(true)
      if(this.settleFreRefForm) {
        const { reset } = this.settleFreRefForm;
        reset()
      }
    }
    const { dispatch } = this.props
    dispatch({ type: 'dealQuery/save', payload: { id, stepSettle: null, freezeAmount,  checkinDate: moment(checkinDate).format('YYYY-MM-DD') } })
    
  }
  showRevoke = (id, freezeAmount, tradeAmount,checkinDate,checkoutDate,roomFee,otherFee, payType) => {
    if (payType != 2) {
      this.modalRevoke.changeVisible(true)
    } else {//线下信用住
      this.modalRevokeFre.changeVisible(true)
    }
    const { dispatch } = this.props
    dispatch({ type:'dealQuery/save', payload:{ id, freezeAmount, tradeAmount,checkinDate:moment(checkinDate).format('YYYY-MM-DD'),checkoutDate:moment(checkoutDate).format('YYYY-MM-DD'),roomFee,otherFee  }})
    if(this.revokeRefForm) {
      const { form } = this.revokeRefForm.props;
      const { resetFields } = form
      resetFields()
    }
  }
  closeModalSettle = () => {
    this.modalSettle.changeVisible(false)
  }
  closeModalSettleFre = () => {
    this.modalSettleFre.changeVisible(false)
  }
  closeModalUnfreeze = () => {
    this.modalUnfreeze.changeVisible(false)
  }
  closeModalRevoke = () => {
    this.modalRevoke.changeVisible(false)
  }
  closeModalRevokeFre = () => {
    this.modalRevokeFre.changeVisible(false)
  }

  savePayload = (payload) => {
    const { dispatch } = this.props
    dispatch({ type:'dealQuery/save', payload });
  }

  showModal = (content) => {
    const { dispatch } = this.props
    dispatch({ type:'dealQuery/save', payload:{ content } })
    this.onRefModal.changeVisible(true)
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'dealQuery/exportDeal' })
  }

  render() {
    const { loading, filter, pagination, teamList, content, freezeAmount, tradeAmount, id, isShowExport, checkinDate,checkoutDate,roomFee,otherFee  } = this.props.dealQuery;
    console.log('---',isShowExport)
    const { dispatch } = this.props;
    const modalDom = (text) => {
      return (text && text != 'null')?<Button onClick={ this.showModal.bind(this,text) } type="primary" size='small'>详情<Icon type="info-circle" style={{ color: 'white' }} /></Button>:'没有信息'
    }
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'checkinDate',
        label: '入住日期',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          format: "YYYY-MM-DD",
          component: RangePicker,
        },
      }, 
      {
        key: 'checkoutDate',
        label: '离店日期',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          format: "YYYY-MM-DD",
          component: RangePicker,
        },
      }, 
      {
        key: 'guestName',
        label: '入住人姓名',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写姓名',
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
        key: 'fhHid',
        label: '酒店ID',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写酒店ID',
          component: Input,
        },
      }, 
      {
        key: 'pmsOrderId',
        label: 'PMS订单号',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: 'PMS订单号',
          component: Input,
        },
      }, 
      {
        key: 'orderStatus',
        label: '支付状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: ENUM_LIST(ENUM_PRE_PAY_STATUS,true).map((v,n)=>{
            return <Option key={ n } value={ v.code }>{ v.description }</Option>
        }),
        fieldAdapter: {
          component: Select,
        },
      }, 
      {
        key: 'payType',
        label: '支付类型',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="0">预授权</Option>,
          <Option key="3" value="2">线下信用住</Option>,
          <Option key="4" value="1">线上信用住</Option>,
        ],
        fieldAdapter: {
          component: Select,
        },
      }, 
    ];
    const priceDom = (num) => {
      return num?<span className={ styles.price }>{ num=='0.00'?0:num }</span>:<span className={ styles.price }>0</span>
    }
    /* table列表*/
    const columns = [
      { title:'入住日期', dataIndex: 'checkinDate', key: 'checkinDate', render: text => {
        return (
            text?<div>
              <p>{moment(text).format('YYYY-MM-DD')}</p>
            </div>:'暂无'
          )
        }
      },  
      { title:'离店日期', dataIndex: 'checkoutDate', key: 'checkoutDate', render: text => {
        return (
          text?<div>
          <p>{moment(text).format('YYYY-MM-DD')}</p>
        </div>:'暂无'
          )
        }
      },  
      {
        title: '酒店Id',
        dataIndex: 'fhHid',
        key: 'fhHid',
      }, 
      {
        title: '入住人姓名',
        dataIndex: 'guestName',
        key: 'guestName',
        render:text => text || '暂无'
      }, 
      {
        title: '外部订单号',
        dataIndex: 'outOrderNo',
        key: 'outOrderNo',
      }, 
      {
        title: 'pms订单号',
        dataIndex: 'pmsOrderId',
        key: 'pmsOrderId',
      }, 
      {
        title: '冻结金额',
        dataIndex: 'freezeAmount',
        key: 'freezeAmount',
        render: text => {
          return priceDom(text)
        }
      }, 
      {
        title: '解冻金额',
        dataIndex: 'unFreezeAmount',
        key: 'unFreezeAmount',
        render: text => {
          return priceDom(text)
        }
      }, 
      {
        title: '不足金额',
        dataIndex: 'insufficientAmount',
        key: 'insufficientAmount',
        render: text => {
          return priceDom(text)
        }
      }, 
      {
        title: '结算金额',
        dataIndex: 'tradeAmount',
        key: 'tradeAmount',
        render: text => {
          return priceDom(text)
        }
      }, 
      { title:'结算日期', dataIndex: 'settleDate', key: 'settleDate', render: text => {
        return (
          text?<div>
          <p>{moment(text).format('YYYY-MM-DD')}</p>
        </div>:'暂无'
          )
        }
      },  
      {
        title: '结算房费',
        dataIndex: 'roomFee',
        key: 'roomFee',
        render: text => {
          return priceDom(text)
        }
      }, 
      {
        title: '结算杂费',
        dataIndex: 'otherFee',
        key: 'otherFee',
        render: text => {
          return priceDom(text)
        }
      }, 
      
      {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
        render:text => text || '暂无'
      }, 
      {
        title: '支付状态',
        dataIndex: 'orderStatusDesc',
        key: 'orderStatusDesc',
      }, 
      {
        title: '支付类型',
        dataIndex: 'payTypeDesc',
        key: 'payTypeDesc',
      }, 
      {
        title: '操作',
        dataIndex: '',
        key:'x',
        fixed: 'right',
        width: 200,
        render:(record) => {
          //payType 0-预授权 1-线上信用住  2-线下信用住
          const { id, payType, orderStatus, outOrderNo, freezeAmount, tradeAmount, checkinDate, checkoutDate, roomFee, otherFee } = record;
          return (
            <div>
              {
                payType != 1 && 
                <Button style={{ display:'inline-block' }} size="small" type="primary" onClick={() => dispatch({ type:'dealQuery/pushRouter',payload:{ pathname:`${INDEX_DEAL_QUERY}/dealDetail`, search:{ outOrderNo } }})}>详情</Button>
              }
              {
                (payType != 1 &&  [1,3,5,10].includes(orderStatus)) && 
                <div style={{ display:'inline-block' }}>
                  <Button size="small" type="primary" onClick={this.showSettle.bind(this,id,freezeAmount, checkinDate, payType)}>结账</Button>
                  {
                    payType == 0 && <Button size="small" type="primary" onClick={this.showUnfreeze.bind(this,id,freezeAmount)}>解冻</Button>
                  }
                </div>
              }
              {
                (payType != 1 &&  orderStatus == 2) && 
                <Button style={{ display:'inline-block' }} size="small" type="primary" onClick={this.showRevoke.bind(this,id,freezeAmount,tradeAmount,checkinDate,checkoutDate,roomFee,otherFee, payType)}>撤销</Button>
              }
            </div>
            
          )
        }
      }
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit,dataArr:[{ dateName:'checkinDate',areaName:['checkinDateStart','checkinDateEnd'] },{ dateName:'checkoutDate',areaName:['checkoutDateStart','checkoutDateEnd'] }], filter, onReset: this.onReset };
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
            type: 'dealQuery/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'dealQuery/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
      },
      scroll:{ x: 2100 }
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
        <Modal
            notOkHidden = { true }
            title="结账"
            ref={ ref => this.modalSettle = ref }
            noFooter={ true }
        >
            <Settle checkinDate={checkinDate} freezeAmount={ freezeAmount } submit={ (values) => dispatch({ type:'dealQuery/settleAccount', payload:{ ...values, id } }) } save={ this.savePayload } cancel={ this.closeModalSettle } dealQuery={ this.props.dealQuery } wrappedComponentRef={(form) => this.settleRefForm = form}  />
        </Modal>
        <Modal
          notOkHidden={true}
          title="结账(线下信用住)"
          ref={ref => this.modalSettleFre = ref}
          noFooter={true}
        >
          <SettleFre checkinDate={checkinDate} submit={(values) => dispatch({ type: 'dealQuery/settleAccount', payload: { ...values, id, payType: 1 } })} save={this.savePayload} cancel={this.closeModalSettleFre} dealQuery={this.props.dealQuery} wrappedComponentRef={(form) => this.settleFreRefForm = form} />
        </Modal>
        <Modal
            notOkHidden = { true }
            title="解冻"
            ref={ ref => this.modalUnfreeze = ref }
            noFooter={ true }
        >
            <Unfreeze freezeAmount={ freezeAmount } submit={ (values) => dispatch({ type:'dealQuery/unfreeze', payload:{ ...values, id } }) } save={ this.savePayload } cancel={ this.closeModalUnfreeze } dealQuery={ this.props.dealQuery } wrappedComponentRef={(form) => this.unfreezeRefForm = form}  />
        </Modal>
        <Modal
            notOkHidden = { true }
            title="撤销"
            ref={ ref => this.modalRevoke = ref }
            noFooter={ true }
        >
            <Revokeb freezeAmount={ freezeAmount } tradeAmount={ tradeAmount } submit={ (values) => dispatch({ type:'dealQuery/revoke', payload:{ ...values, id } }) } save={ this.savePayload } cancel={ this.closeModalRevoke } dealQuery={ this.props.dealQuery } wrappedComponentRef={(form) => this.revokeRefForm = form}  />
        </Modal>
        <Modal
          notOkHidden={true}
          title="撤销（线下信用住）"
          ref={ref => this.modalRevokeFre = ref}
          noFooter={true}
        >
          <RevokebFre
            checkinDate={checkinDate}
            checkoutDate={checkoutDate}
            roomFee={roomFee}
            otherFee={otherFee}
            submit={(values) => dispatch({ type: 'dealQuery/revoke', payload: { ...values, id, payType: 1 } })}
            save={this.savePayload}
            cancel={this.closeModalRevokeFre}
            dealQuery={this.props.dealQuery}
            wrappedComponentRef={(form) => this.revokeRefForm = form} />
        </Modal>
        <Modal
            title="详情"
            ref={ onRefModal => this.onRefModal = onRefModal }
          >
          { content }
        </Modal>
      </div>
    )
  }
}
