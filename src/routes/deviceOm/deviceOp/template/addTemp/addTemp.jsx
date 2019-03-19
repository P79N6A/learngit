import React,{ Component } from 'react'
import { connect } from 'dva'
import { Divider, Button } from 'antd'
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'
import styles from './addTemp.less'
function mapStateToProps(state) {
    return { addTemp:state.addTemp }
}
@connect(mapStateToProps)
export default class addTemp extends Component {
    configDom = (data) => {
        return data.map(v=>{
            return <Button key={v.code} onClick={() => this.goConfig(v.code,v.description)}>{v.description}</Button>
        })
    }

    goConfig = (partnerType,partnerName) => {
        const { dispatch } = this.props;
        dispatch({type:'addTemp/pushRouter',payload:{ pathname:`${INDEX_DEVICE_TEM_OP}/addTemp/typeConfig`,search:{ partnerType,partnerName }}})
    }
    render() {
        const { dispatch,addTemp } = this.props;
        const { data } = addTemp;
        return (
            <div className={styles.root}>
                <h3>请选择模板类型信息</h3>
                <Divider />
                <div className={styles.buttonBox}>
                {
                    data?(this.configDom(data)):null
                    
                }
                    <Button type="primary" onClick={() => dispatch({type:'addTemp/pushRouter',payload:{ pathname:INDEX_DEVICE_TEM_OP }})}>返回</Button>
                </div>
            </div>
        )
    }
}