import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Table, Form, LocaleProvider, Icon, Popconfirm, Divider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import styles from './dealDetail.less'
import moment from 'moment'
import Modal from '@components/modal/modal'
import { INDEX_DEAL_QUERY } from '@utils/pathIndex'

let listId = ''

function mapStateToProps(state) {
  return { dealDetail:state.dealDetail }
}
@Form.create()
@connect(mapStateToProps)
export default class DealQuery extends Component {
  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    Object.keys(fields).map((key) => {
      if (key === 'date' && fields[key] && fields[key].length > 0) {
        submitData = {
          ...submitData,
          checkInDateFrom: fields[key][0].format('YYYY-MM-DD HH:mm:ss'),
          checkInDateEnd: fields[key][1].format('YYYY-MM-DD HH:mm:ss'),
        }
      } else if((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
      
    });
    dispatch({ type: 'dealDetail/save', payload: { filter:submitData } });
    dispatch({ type: 'dealDetail/queryBaseData', payload: submitData });
  }

  showUnfreeze = (id) => {
    listId = id
    this.modalUnfreeze.changeVisible(true)
    if(this.unfreezeRefForm) {
      const { form } = this.unfreezeRefForm.props;
      const { resetFields } = form
      resetFields()
  }
  }

  handleOkUnfreeze = () => {
      const { form } = this.unfreezeRefForm.props;
      const { dispatch } = this.props;
      const { validateFields } = form;
      validateFields((err, values) => {
          if (!err) {
              dispatch({ type:'dealDetail/settleAccount', payload:{ ...values, id:listId } })
              this.modalUnfreeze.changeVisible(false)
          }
      })
  }

  showModal = (content) => {
    const { dispatch } = this.props
    dispatch({ type:'dealDetail/save', payload:{ content } })
    this.onRefModal.changeVisible(true)
  }

  render() {
    const { dispatch } = this.props;
    const { loading, teamList, content } = this.props.dealDetail;
    const modalDom = (text) => {
      return (text && text != 'null')?<Button onClick={ this.showModal.bind(this,text) } type="primary" size='small'>详情<Icon type="info-circle" style={{ color: 'white' }} /></Button>:'没有信息'
    }
    /* table列表*/
    const columns = [
      { title:'时间', dataIndex: 'time', key: 'time', width:'20%', render: text => {
        return (
            text?<div>
              <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>:'暂无'
          )
        }
      },  
      {
        title: '操作名称',
        dataIndex: 'operatorName',
        key: 'operatorName',
        width:'20%',
      }, 
      {
        title: '详情',
        dataIndex: 'operatorDesc',
        key: 'operatorDesc',
        width:'20%',
        render:text => {
          return (
            modalDom(text)
          )
        }
      }, 
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width:'20%',
        render:text => {
          return text || '暂无'
        }
      }, 
      {
        title: '是否成功',
        dataIndex: 'operatorStatus',
        key: 'operatorStatus',
        width:'20%',
        render:text => {
          return text == 1?'成功':'失败'
        }
      }, 
    ];

    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      columns,
      bordered: true,
    };

    return (
      <div className={styles.content}>
        <h3>交易详情</h3>
        <Divider />
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'dealDetail/pushRouter',payload:{ pathname:INDEX_DEAL_QUERY} })}>返回</Button>
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
