import React,{ Component } from 'react'
import { connect } from 'dva'
import { Divider, InputNumber, Tabs } from 'antd'
import ConfigForm from '@components/configForm/configForm'
import styles from './logCollect.less'
import DataDetail from './components/dataDetail'
const TabPane = Tabs.TabPane
function mapStateToProps(state) {
    return { logCollect:state.logCollect }
}

const collectFreParam = { 
    name:'采集频率（秒）', 
    key:'dataCollectionRate', 
    rules:msg => [{ required:true, message:msg }],
    item:(name) => {
        return <InputNumber className={ styles.number } min={1} max={100} placeholder={name}/>
    }
}


@connect(mapStateToProps)
export default class GlobalConfig extends Component {
    reset = () => {
        this.collectFreRef.reset()
    }

    submitCollectRate = (values) => {
        const { dispatch } = this.props
        dispatch({type:'logCollect/setCollectRate',payload:{ ...values }})
    }

    onTabClick = (key) => {
        const { dispatch } = this.props
        if(key == 1) {
            this.reset()
            dispatch({ type:'logCollect/getCollectRate' })
        } else if(key == 2) {
            dispatch({ type:'logCollect/queryAppState' })
        }
    }

    onChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.logCollect
        dispatch({
        type: `logCollect/${type}`,
            payload: {
                ...filter,
                currentPage,
                currentSize,
            },
        })
    }

    onShowSizeChange = type => (currentPage, currentSize) => {
        const { dispatch } = this.props
        const { filter } = this.props.logCollect
        dispatch({
        type: `logCollect/${type}`,
            payload: {
                ...filter,
                currentPage:1,
                currentSize,
            },
        })
    }

    render() {
        const { logCollect, dispatch } = this.props;
        const { logCollectInfo } = logCollect;
        return (
            <div className={styles.root}>
                <h3>运行数据</h3>
                <Divider />
                <Tabs defaultActiveKey="1" onTabClick={ this.onTabClick } type="card">
                    <TabPane tab="数据采集配置" key="1">
                        <ConfigForm 
                            initialValue={ logCollectInfo }
                            params = { collectFreParam }
                            getInstance={ ref => this.collectFreRef = ref } 
                            update={ this.submitCollectRate }
                        />
                    </TabPane>
                    <TabPane tab="数据详情" key="2">
                        <DataDetail 
                            getInstance={ ref => this.dataDetailRef = ref }
                            logCollect = { logCollect }
                            save = { (payload) => dispatch({ type:'logCollect/save', payload }) }
                            getList = { (payload) => dispatch({ type:'logCollect/queryAppState', payload }) }
                            onChange={ this.onChange('queryAppState') }
                            onShowSizeChange={ this.onShowSizeChange('queryAppState') }
                        />
                    </TabPane>
                </Tabs>  
            </div>
        )
    }
}