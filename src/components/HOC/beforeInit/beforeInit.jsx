import React from 'react';
import { Spin } from 'antd'
import styles from './beforeInit.less'

/**
 * minxing
 * 此类用来拓展一些需要初始化查询数据展示loading框的组件，其他功能后续拓展
 * @param {*} WrappedComponent 
 */
const BeforeInit = ({ name, isInitData = true, dataName = 'data' }) => WrappedComponent => class extends WrappedComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { loading, loadingOp } = this.props[name]
        const data = this.props[name][dataName]
        return (
            isInitData?
            (
                (!loading && data)?
                (
                    <div>
                        { loadingOp?<Spin className={ styles.spin }/>:null}
                        { super.render() }
                    </div>
                ):<Spin className={ styles.spin }/>
                
            ):(
                <div>
                    { loadingOp?<Spin className={ styles.spin }/>:null}
                    { super.render() }
                </div>
            )
        )
    }
}

export default BeforeInit;