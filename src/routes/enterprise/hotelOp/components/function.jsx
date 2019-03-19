import React,{ Component } from 'react'
import { Tabs } from 'antd'
import styles from './function.less'
import Checkout from './checkout'
import Walkin from './walkin'
const TabPane = Tabs.TabPane

export default class Function extends Component {
    componentDidMount() {
    }

    onTabClick = (key) => {
        const { getCheckOut, getWalkin } = this.props
        if(key == 1) {
            this.walkinRef && this.walkinRef.reset()
            getWalkin()
        } else if(key == 2) {
            this.checkoutRef && this.checkoutRef.reset()
            getCheckOut()
        }
    }

    reset = () => {
        this.walkinRef && this.walkinRef.reset()
    }

    render() {
        const { editHotel, save, doCancle, updateCheckOut, updateWalkin } = this.props
        return (
            <div className={styles.root}>
                <Tabs tabPosition={ 'left' } defaultActiveKey="1" onTabClick={ this.onTabClick }>
                    <TabPane tab="walkin" key="1">
                        <Walkin
                            getInstance={ ref => this.walkinRef = ref }
                            editHotel = { editHotel }
                            save={ save }
                            updateWalkin={ updateWalkin }
                            doCancle = { doCancle }
                            />
                    </TabPane>
                    <TabPane tab="退房" key="2">
                        <Checkout
                            getInstance={ ref => this.checkoutRef = ref }
                            editHotel = { editHotel }
                            save={ save }
                            updateCheckOut={ updateCheckOut }
                            doCancle = { doCancle }
                            />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}