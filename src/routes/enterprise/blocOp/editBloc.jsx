import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Tabs } from 'antd'
import beforeInit from '@components/HOC/beforeInit/beforeInit'
import { INDEX_BLOC_OP } from '@utils/pathIndex'
import styles from './editBloc.less'
import Default from './components/default'
import Param from './components/param'
const TabPane = Tabs.TabPane
function mapStateToProps(state) {
    return { editBloc:state.editBloc }
}

@connect(mapStateToProps)
@Form.create()
@beforeInit({ name:'editBloc' })
export default class EditBloc extends Component {
    update = (payload) => {
        const { dispatch } = this.props;
        dispatch({type:'editBloc/action_updateGroup',payload })
    }

    callback = (key) => {
        if(key == 1) {
            this.defaultRef && this.defaultRef.reset()
        } else if(key == 2) {
            this.paramRef && this.paramRef.reset()
        }
    }
    
    render() {
        const { dispatch } = this.props;
        const { data } = this.props.editBloc;
        return (
            <div className={styles.root}>
                <h3>编辑集团信息</h3>
                <Divider />
                <Tabs defaultActiveKey="1" onChange={this.callback} type="card">
                    <TabPane tab="基本信息" key="1">
                        <Default
                            getInstance={ ref => this.defaultRef = ref }
                            data = { data }
                            update={ this.update }
                            doCancle = { () => dispatch({ type:'editBloc/pushRouter', payload:{ pathname:INDEX_BLOC_OP} }) }
                        />
                    </TabPane>
                    {/* <TabPane tab="参数配置" key="2">
                        <Param
                            getInstance={ ref => this.paramRef = ref }
                            data = { data }
                            update={ this.update }
                            doCancle = { () => dispatch({ type:'editBloc/pushRouter', payload:{ pathname:INDEX_BLOC_OP} }) }
                        />
                    </TabPane> */}
                </Tabs>  
            </div>
        )
    }
}