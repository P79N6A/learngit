import React from 'react';
import Modal from '@components/modal/modal'
import { Button, Icon, Popconfirm } from 'antd'
import { Spin } from 'antd'
import styles from './decrypt.less'

/**
 * minxing
 * 此类用来拓展一些需要初始化查询数据展示loading框的组件，其他功能后续拓展
 * @param {*} WrappedComponent 
 */
const Decrypt = (name) => WrappedComponent => class extends WrappedComponent {
    constructor(props) {
        super(props);
    }

    modalDom = (text) => {
        return (text && text != 'null')?(
            <Popconfirm placement="topRight" title="请确认是否解密?" onConfirm={this.showModal.bind(this,text)} okText="确认" cancelText="取消">
                <Button type="primary" size='small'>详情<Icon type="info-circle" style={{ color: 'white' }} /></Button>
            </Popconfirm>
        ):'没有信息'
    }

    showModal = (decryptContent) => {
        const { dispatch } = this.props
        this.onRefModal.changeVisible(true)
        dispatch({ type:`${name}/decrypt`, payload:{ ciphertext:decryptContent } })
    }

    render() {
        const { decryptContent, loadingOp } = this.props[name]
        return (
            <div>
                { super.render() }
                { loadingOp?<Spin className={ styles.spin }/>:null}
                <Modal
                    title="内容"
                    ref={ onRefModal => this.onRefModal = onRefModal }
                >
                { loadingOp?<Spin className={ styles.spin }/>:decryptContent}
                </Modal>
            </div>
        )
    }
}

export default Decrypt;