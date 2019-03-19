import React, { Component } from 'react';
import { connect } from 'dva';
import { Divider, Tabs } from 'antd'
import Walkin from './components/walkin'
import Frozen from './components/frozen/frozen'
import Gmv from './components/GMV/gmv'
import styles from './day.less'
const TabPane = Tabs.TabPane

function mapStateToProps(state) {
  return { day: state.day }
}
@connect(mapStateToProps)
export default class Day extends Component {

  onTabClick = (key) => {
    const { dispatch } = this.props
    if (key == 1) {
      dispatch({ type:'day/queryBaseData', payload:{ queryType:1 } })
    } else if (key == 2) {
      dispatch({ type:'day/queryBaseData', payload:{ queryType:2 } })
    }
  }

  onTabClickIn = (key) => {
    const { dispatch } = this.props
    if (key == 1) {
      dispatch({ type:'day/queryBaseData', payload:{ queryType:2 } })
    } else if (key == 2) {
      dispatch({ type:'day/queryBaseData', payload:{ queryType:3 } })
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <h3>编辑酒店信息</h3>
        <Divider />
        <Tabs defaultActiveKey="1" onTabClick={this.onTabClick} type="card">
          <TabPane tab="入住" key="1">
            <Walkin />
          </TabPane>
          <TabPane tab="交易" key="2">
            <Tabs defaultActiveKey="1" tabPosition={ 'left' } onTabClick={this.onTabClickIn}>
              <TabPane tab="冻结" key="1">
                <Frozen />
              </TabPane>
              <TabPane tab="GMV" key="2">
                <Gmv />
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
