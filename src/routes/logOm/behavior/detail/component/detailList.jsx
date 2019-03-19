import React, { Component } from 'react';
import { Row, Col, List, Button } from 'antd'
import styles from './detailList.less'
export default class DetailList extends Component {
  onLoadMore =() => {
    const { onLoadMore, infoList, traceId } = this.props
    let currentPage_ = infoList.currentPage
    onLoadMore(traceId, ++currentPage_)
  }
  render() {
    const { infoList, loading } = this.props
    const loadMore = !loading ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        <Button type="primary" size="small" onClick={this.onLoadMore}>加载更多</Button>
      </div>
    ) : null;
    return (
      <div className={ styles.row }>
        <Row className={styles.title}>
          <Col span={ 8 } offset={ 1 }>
            <span>时间</span>
          </Col>
          <Col span={ 7 }>
            <span>事件</span>
          </Col>
          <Col span={ 8 }>
            <span>页面</span>
          </Col>
        </Row>
        <List
          size="small"
          loadMore={loadMore}
          dataSource={infoList.rows}
          renderItem={(v,n) => (
            <List.Item>
              <Row className={ styles.listRow }>
                <Col span={ 1 }>
                  <span>{ n+1 }</span>
                </Col>
                <Col span={ 8 }>
                  <span>{ v.time }</span>
                </Col>
                <Col span={ 7 }>
                  <span>{ v.eventName }</span>
                </Col>
                <Col span={ 8 }>
                  <span>{ v.pageName }</span>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    )
  }
}
