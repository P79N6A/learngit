import React, { Component } from 'react';
import { Form, Modal } from 'antd';
import styles from './modal.less';

class ModalVersion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        }
    }

    changeVisible = (flag) => {
        this.setState({ visible:flag })
    }
    onOk = () => {
        const { onOk, notOkHidden } = this.props
        onOk && onOk()
        !notOkHidden && this.setState({ visible:false })
    }
    onCancel = () => {
        const { onCancel } = this.props
        onCancel && onCancel()
        this.setState({ visible:false })
    }

    render() {
        const { title, children, visible, noFooter, width } = this.props;
        return (
            noFooter?
            <Modal title = { title }
                className = { styles.modal }
                visible={ visible || this.state.visible }
                onOk={ this.onOk }
                width={ width || 520 }
                onCancel={ this.onCancel }
                footer = { null }
            >
                { children }
            </Modal>:
                <Modal title = { title }
                className = { styles.modal }
                visible={ visible || this.state.visible }
                onOk={ this.onOk }
                width={ width || 520 }
                onCancel={ this.onCancel }
            >
                { children }
            </Modal>
        )
    }
}

export default ModalVersion
