import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Icon } from 'antd'
import styles from './detail.less'
import DetailList from './component/detailList'
import { INDEX_REPORT_BEHAVIOR } from '@utils/pathIndex';
import beforeInit from '@components/HOC/beforeInit/beforeInit'

function mapStateToProps(state) {
  return {detailBehavior:state.detailBehavior}
}
@connect(mapStateToProps)
@beforeInit({ name:'detailBehavior', dataName:'triceIdList'})
export default class TriceIdDetail extends Component {
  //通过展开和收起调用的info接口默认传递当前对象中的currentPage，如果没有传递第一页
  getInfo = (traceId, openFlag) => {
    const { dispatch } = this.props
    dispatch({ type:'detailBehavior/getTriceIdDetail', payload:{ traceId, openFlag } })
  }
  onLoadMore = (traceId, currentPage) => {
    const { dispatch } = this.props
    dispatch({ type:'detailBehavior/getTriceIdDetailMore', payload:{ traceId, openFlag:true, currentPage } })
  }
  getList = () => {
    const { triceIdList, loading, nowId } = this.props.detailBehavior
    if(!triceIdList || ( triceIdList && triceIdList.length == 0 )) {
      return (
        <p style={{ textAlign:'center',lineHeight:'300px' }}>暂无数据</p>
      )
    };
    return (
      <ul className={ styles.ul }>
        {
          triceIdList.map((v,n) => {
            return (
              <li key={ n }>
                <Row style={ {width:'100%'} } gutter={16}>
                <Col span={ 7 }>
                  <span>triceId：</span>{ v.traceId }
                </Col>
                <Col span={ 6 }>
                  <span>设备Id：</span>{ v.deviceId }
                </Col>
                <Col span={ 3 }>
                  <span>APP版本：</span>{ v.appVersion }
                </Col>
                <Col span={ 3 }>
                  <span>时长（秒）：</span>{ v.totalTime }
                </Col>
                <Col span={ 4 }>
                  <span>姓名 ：</span>{ v.guestName }
                </Col>
                <Col span={ 1 }>
                  <a onClick={ this.getInfo.bind(this,v.traceId,!v.show) }>
                    {
                      v.show?<Icon type="up" />:<Icon type="down" />
                    }
                  </a>
                </Col>
              </Row>
              {
                (v.show && nowId == v.traceId) && <DetailList traceId={ v.traceId } onLoadMore={ this.onLoadMore } loading={ loading } infoList={ v.infoList } />
              }
              </li>
            )
          })
        }
      </ul>
    )
  }
  render() {
    const { dispatch } = this.props
    return (
      <div className={styles.content}>
      <Button style={{ display:'inline-block', marginRight:'20px' }} type="primary" onClick={() => dispatch({type:'detailBehavior/pushRouter',payload:{ pathname:INDEX_REPORT_BEHAVIOR} })}>返回</Button>
        <h3 style={{ display:'inline-block' }}>详情</h3>
        { this.getList() }
      </div>
    )
  }
}
