import React, { Component } from 'react';
import { Row, Col } from 'antd'
import styles from './titleTab.less'

export default class TitleTab extends Component {
  render() {
    const { data={} } = this.props;
    const { 
      totalPayGmv,
      preAuthGmv,
      offLineCreditGmv,
      onLinePayGmv

    } = data
    return (
      <div className={styles.tabTitle}>
        <Row className={ styles.row1 }>
          <Col span={6}>总GMV（元）</Col>
          <Col span={6}>预授权GMV（元）</Col>
          <Col span={6}>线下信用住GMV（元）</Col>
          <Col span={6}>线上信用住GMV（元）</Col>
        </Row>
        <Row className={ styles.row3 } type='flex' align='top'>
          <Col span={6}>{ totalPayGmv }</Col>
          <Col span={6}>{ preAuthGmv }</Col>
          <Col span={6}>{ offLineCreditGmv }</Col>
          <Col span={6}>{ onLinePayGmv }</Col>
        </Row>
      </div>
    )
  }
}
