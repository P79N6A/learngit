import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import styles from './useModal.less';

class UseModal extends Component {
    state = { on: false };
    toggle = () => this.setState({ on: !this.state.on });
    MyButton = props => <Button {...props} onClick={this.toggle} />;
    MyModal = ({ onOK, ...rest }) => (
      <Modal
        {...rest}
        className = { styles.modal }
        visible={this.state.on}
        onOk={() => {
          onOK && onOK();
          this.toggle();
        }}
        onCancel={this.toggle}
      />
    );
  
    render() {
      return this.props.children({
        on: this.state.on,
        toggle: this.toggle,
        Button: this.MyButton,
        Modal: this.MyModal
      });
    }
  }

export default UseModal
