import React, { Component } from 'react';
import { Row, Col } from 'antd'
import styles from './titleTab.less'

export default class TitleTab extends Component {
  render() {
    const { data={} } = this.props;
    const { 
      totalFrozenAmount,
      totalPreFrozenAmount,
      totalOfflineFrozenAmount,
      totalOnlineFrozenAmount,
      bookingTotalRoomPrice,
      bookingSuccTotalRoomPrice
    } = data
    return (
      <div className={styles.tabTitle}>
        <Row className={ styles.row1 }>
          <Col span={4}>总冻结金额</Col>
          <Col span={4}>预授权冻结金额</Col>
          <Col span={4}>线下信用住冻结金额</Col>
          <Col span={4}>线上信用住冻结金额</Col>
          <Col span={4}>成功预订总房费</Col>
          <Col span={4}>预订总房费</Col>
        </Row>
        <Row className={ styles.row3 } type='flex' align='top'>
          <Col span={4}>{ totalFrozenAmount }</Col>
          <Col span={4}>{ totalPreFrozenAmount }</Col>
          <Col span={4}>{ totalOfflineFrozenAmount }</Col>
          <Col span={4}>{ totalOnlineFrozenAmount }</Col>
          <Col span={4}>{ bookingSuccTotalRoomPrice }</Col>
          <Col span={4}>{ bookingTotalRoomPrice }</Col>
        </Row>
      </div>
    )
  }
}
