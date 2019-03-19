import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Table, LocaleProvider, Icon, Divider, Tooltip } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { INDEX_LOGOM_DAY } from '@utils/pathIndex'
import styles from './detail.less'
import moment from 'moment'
import Modal from '@components/modal/modal'



function mapStateToProps(state) {
  return {detail:state.detail}
}
@connect(mapStateToProps)
export default class Day extends Component {

  showModal = (content) => {
    const { dispatch } = this.props
    dispatch({ type:'detail/save', payload:{ content } })
    this.onRefModal.changeVisible(true)
  }

  render() {
    const { dispatch } = this.props;
    const { teamList, loading, pagination, content } = this.props.detail;
    const toolTipDom = (text) => {
      return (text && text != 'null')?
        <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
          <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
        </Tooltip>:'无'
    }
    const modalDom = (text) => {
      return (text && text != 'null')?<Button onClick={ this.showModal.bind(this,text) } type="primary" size='small'>详情<Icon type="info-circle" style={{ color: 'white' }} /></Button>:'没有信息'
    }
    /* table列表*/
    const columns = [
      {
        title: '办理入住日期',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      {
        title: '入住人姓名',
        dataIndex: 'guestName',
        key: 'guestName',
      }, 
      {
        title: '入住人身份证',
        dataIndex: 'guestIdCard',
        key: 'guestIdCard',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      }, 
      {
        title: '入住人电话',
        dataIndex: 'guestTel',
        key: 'guestTel',
        render:text => {
          return (
            toolTipDom(text)
          )
        }
      }, 
      {
        title:'未来酒店id',
        dataIndex: 'fhHid',
        key: 'fhHid',
      },
      {
        title:'入住单状态',
        dataIndex: 'checkInStatusDesc',
        key: 'checkInStatusDesc',
      },
      {
        title:'入住单步骤',
        dataIndex: 'checkInStepDesc',
        key: 'checkInStepDesc',
      },
      {
        title:'设备id',
        dataIndex: 'deviceId',
        key: 'deviceId',
      },
      {
        title:'pms订单号',
        dataIndex: 'pmsOrderId',
        key: 'pmsOrderId',
      },
      {
        title:'错误描述',
        dataIndex: 'errorMsg',
        key: 'errorMsg',
        render:text => {
          return modalDom(text)
        }
      },
      {
        title:'请求参数',
        dataIndex: 'requestParam',
        key: 'requestParam',
        render:text => {
          return modalDom(text)
        }
      },
      {
        title:'返回参数',
        dataIndex: 'resultText',
        key: 'resultText',
        render:text => {
          return modalDom(text)
        }
      },
      {
        title:'流水id',
        dataIndex: 'traceId',
        key: 'traceId',
      },
    ];

    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'detail/queryBaseData',
            payload: {
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'detail/queryBaseData',
            payload: {
              currentPage,
              currentSize,
            },
          })
        },
        scroll:{ x: 2600 }
      },
    };


    return (
      <div className={styles.content}>
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'detail/pushRouter',payload:{ pathname:INDEX_LOGOM_DAY} })}>返回</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>

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
