import React, { Component } from 'react';
import { Tabs, Divider } from 'antd';
import Param from './components/param'
import Default from './components/default'
import styles from './edit.less';
const TabPane = Tabs.TabPane
class EditForm extends Component {
    constructor(props) {
        super(props)
    }

    onTabClick = (key) => {
        const { getByPmsCode } = this.props
        if(key == 1) {
            this.defaultRef && this.defaultRef.reset()
        } else if(key == 2) {
            this.paramRef && this.paramRef.reset()
            getByPmsCode()
        }
    }

    reset = () => {
        const { getByPmsCode } = this.props
        this.defaultRef && this.defaultRef.reset()
        this.paramRef && this.paramRef.reset()
        getByPmsCode()
    }

    render() {
        const { editPartner = {}, updateMidnight, update, doCancel } = this.props
        const partnerType = editPartner.productInfo && editPartner.productInfo.partnerType || 0
        return (
            <div>
                <Tabs defaultActiveKey="1" onTabClick={ this.onTabClick } type="card">
                    <TabPane tab="基本信息" key="1">
                        <Default
                            getInstance={ ref => this.defaultRef = ref }
                            editPartner = { editPartner }
                            update={ update }
                            doCancel = { doCancel }
                        />
                    </TabPane>
                    {
                        partnerType && <TabPane tab="参数配置" key="2">
                        <Param
                            ref={ ref => this.paramRef = ref }
                            editPartner = { editPartner }
                            updateMidnight ={ updateMidnight }
                            updatePmsTime ={ updateMidnight }
                        />
                    </TabPane>
                    }
                </Tabs> 
            </div>
        )
    }
}

export default EditForm
