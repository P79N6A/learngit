import React, { Component } from 'react';
import { Row, Col } from 'antd'
import styles from './titleTab.less'

export default class TitleTab extends Component {
  render() {
    const { data={} } = this.props;
    const { 
      totalHandleGuestNumber,
      totalHandleSuccGuestNumber,
      totalOrderNumber,
      totalHandleSuccNumber,
      totalHandleFailNumber,
      totalHandleAbandonNumber
    } = data
    //成功率
    const rate1 = (totalOrderNumber-totalHandleAbandonNumber<=0?0:((totalHandleSuccNumber/(totalOrderNumber-totalHandleAbandonNumber))*100).toFixed(2))+'%'
    //总人数
    const rate3 = (totalHandleGuestNumber<=0?0:100)+'%'
    //总成功人数
    const rate4 = (totalHandleGuestNumber<=0?0:((totalHandleSuccGuestNumber/totalHandleGuestNumber)*100).toFixed(2))+'%'
    //总入住单数
    const rate5 = (totalOrderNumber<=0?0:100)+'%'
    //成功入驻
    const rate6 = (totalOrderNumber<=0?0:((totalHandleSuccNumber/totalOrderNumber)*100).toFixed(2))+'%'
    //失败
    const rate7 = (totalOrderNumber<=0?0:((totalHandleFailNumber/totalOrderNumber)*100).toFixed(2))+'%'
    //放弃
    const rate8 = (totalOrderNumber<=0?0:((totalHandleAbandonNumber/totalOrderNumber)*100).toFixed(2))+'%'
    return (
      <div className={styles.tabTitle}>
        <Row className={ styles.row1 }>
          <Col span={3}>成功率</Col>
          <Col span={3}>分类</Col>
          <Col span={3}>总人数</Col>
          <Col span={3}>总成功人数</Col>
          <Col span={3}>总入住单数</Col>
          <Col span={3}>成功入住单数</Col>
          <Col span={3}>失败入住单数</Col>
          <Col span={3}>放弃入住单数</Col>
        </Row>
        <Row className={ styles.row2 } type="flex" align="top">
          <Col span={3}>{ rate1 }</Col>
          <Col span={3}>
            <p className={ styles.top }>数量</p>
            <p className={ styles.bottom }>占比</p>
          </Col>
          <Col span={3}>
            <p className={ styles.top }>{ totalHandleGuestNumber }</p>
            <p className={ styles.bottom }>{ rate3 }</p>
          </Col>
          <Col span={3}>
            <p className={ styles.top }>{ totalHandleSuccGuestNumber }</p>
            <p className={ styles.bottom }>{ rate4 }</p>
          </Col>
          <Col span={3}>
            <p className={ styles.top }>{ totalOrderNumber }</p>
            <p className={ styles.bottom }>{ rate5 }</p>
          </Col>
          <Col span={3}>
            <p className={ styles.top }>{ totalHandleSuccNumber }</p>
            <p className={ styles.bottom }>{ rate6 }</p>
          </Col>
          <Col span={3}>
            <p className={ styles.top }>{ totalHandleFailNumber }</p>
            <p className={ styles.bottom }>{ rate7 }</p>
          </Col>
          <Col span={3}>
            <p className={ styles.top }>{ totalHandleAbandonNumber }</p>
            <p className={ styles.bottom }>{ rate8 }</p>
          </Col>
        </Row>
      </div>
    )
  }
}
