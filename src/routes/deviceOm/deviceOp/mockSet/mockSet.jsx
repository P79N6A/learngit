import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Select, Tooltip, LocaleProvider, Divider } from 'antd'
import styles from './mockSet.less'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_DEVICE_OP } from '@utils/pathIndex';
import ConfigForm from './components/mockForm'

function mapStateToProps(state) {
  return {mockSet:state.mockSet}
}

@connect(mapStateToProps)
@beforeInit({ name:'mockSet' })
export default class MonitorDetail extends Component {

  updateDetail = (values) => {
    console.log(values)
    const { dispatch } = this.props
    dispatch({ type:'mockSet/setMockDetail', payload:{ ...values } })
  }

  getParamDom = () => {
    const { mockSet } = this.props
    const { data } = mockSet
    return Object.keys(data).map((v,n) => {
      return (
        <div key={n} className={ styles.lineBox }>
          <h3>接口名称：{ v }</h3>
          <ConfigForm 
              initialObj={ data[v] }
              getInstance={ ref => this.showRoomRef = ref } 
              update={ this.updateDetail }
          />
        </div>
      )
    }) 
  }

  render() {
    const { dispatch } = this.props
    return (
      <div className={styles.content}>
        <h3 style={{ display:'inline-block' }}>设备mock信息设置</h3>
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'mockSet/pushRouter',payload:{ pathname:INDEX_DEVICE_OP} })}>返回</Button>
        </div>
        <Divider />
        { this.getParamDom() }
      </div>
    )
  }
}
